// ============================================================================
// Pricing engine — the Viora "tigdam", ported to OJARA (bundle §5).
//
// ONE place for every number, so the frontend never drifts from the Wix coupon
// dashboard. Read the rules below before changing anything.
//
//   • subtotal        — Σ price×qty. The ONLY number allowed to touch money.
//   • prepaid −₹50    — flat online-payment discount. Client-side, STACKS on top
//                       of any coupon, and is NOT a Wix coupon (Wix can't model a
//                       stacking flat discount — §8 reconciles it on the order).
//   • coupon          — validated by Wix's engine when live; the tiers below are a
//                       MIRROR so the UI can show "add ₹X to unlock" and so the
//                       Razorpay charge still lines up if Wix reports no amount.
//   • display optics  — shipping ₹99 + processing ₹50 are SHOWN then struck off,
//                       purely to make "FREE shipping / no fees" legible. They are
//                       folded into `displaySubtotal` and must NEVER be sent to
//                       Razorpay, the Wix order, or the confirmation email.
//   • total           — max(0, subtotal − couponDiscount − prepaidDiscount).
//                       THIS is what Razorpay charges.
//
// ⚠️ DRIFT: if you change a coupon in the Wix dashboard, update the matching tier
// here in the same commit, or the UI will promise a discount the backend won't
// honour (or vice-versa).
// ============================================================================

/** Flat "pay online" discount. Stacks on any coupon. Not a Wix coupon. */
export const PREPAID_DISCOUNT = 50;

/** Shown-then-struck display fees. Pure optics — never charged. */
export const SHIPPING_FEE_DISPLAY = 99;
export const PROCESSING_FEE_DISPLAY = 50;

export type CouponType = "FLAT" | "PERCENT";

export interface CouponTier {
  code: string;
  type: CouponType;
  /** Minimum cart subtotal (₹) required for the code to apply. */
  minimum: number;
  /** For FLAT: rupees off. For PERCENT: a rate like 0.1 (= 10%). */
  value: number;
  /** Shopper-facing one-liner for the "unlock" nudge. */
  label: string;
}

// Example tiers. These MUST mirror the coupons the owner creates in the Wix
// dashboard (Phase 2). Codes are matched case-insensitively.
export const COUPON_TIERS: CouponTier[] = [
  {
    code: "WELCOME50",
    type: "FLAT",
    minimum: 700,
    value: 50,
    label: "₹50 off orders over ₹700",
  },
  {
    code: "OJARA10",
    type: "PERCENT",
    minimum: 999,
    value: 0.1,
    label: "10% off orders over ₹999",
  },
];

export interface PricedLine {
  price: number;
  quantity: number;
}

export const cartSubtotal = (lines: PricedLine[]): number =>
  lines.reduce(
    (sum, l) => sum + (Number(l.price) || 0) * (Number(l.quantity) || 0),
    0,
  );

/**
 * Frontend coupon mirror. Returns the discount a code WOULD give at this subtotal,
 * or an error string if it can't apply. In live mode Wix is authoritative; this is
 * the pre-apply preview + the fallback when Wix reports no amount.
 */
export const evaluateCoupon = (
  rawCode: string,
  subtotal: number,
): { discount: number; error: string; tier?: CouponTier } => {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { discount: 0, error: "Enter a coupon code." };

  const tier = COUPON_TIERS.find((t) => t.code.toUpperCase() === code);
  if (!tier) return { discount: 0, error: "That code isn’t valid." };

  if (subtotal < tier.minimum) {
    return {
      discount: 0,
      error: `Add ₹${tier.minimum - subtotal} more to use ${tier.code}.`,
      tier,
    };
  }

  const discount =
    tier.type === "FLAT"
      ? tier.value
      : Math.round(subtotal * tier.value);
  return { discount, error: "", tier };
};

export interface TotalsInput {
  lines: PricedLine[];
  isPrepaid: boolean;
  /** Discount reported by Wix (live) — takes precedence over the mirror. */
  wixReportedDiscount?: number;
  /** Coupon code currently on the cart, if any (used by the mirror fallback). */
  appliedCouponCode?: string;
}

export interface Totals {
  subtotal: number;
  couponDiscount: number;
  prepaidDiscount: number;
  /** The real amount charged. Never negative. */
  total: number;
  /** Optics only — inflated subtotal so shipping/processing can be struck off. */
  displaySubtotal: number;
  shippingFeeDisplay: number;
  processingFeeDisplay: number;
}

/**
 * The single source of truth for what the shopper pays. Pure — safe to memoize.
 */
export const computeTotals = ({
  lines,
  isPrepaid,
  wixReportedDiscount,
  appliedCouponCode,
}: TotalsInput): Totals => {
  const subtotal = cartSubtotal(lines);

  // Trust Wix's reported amount when present; otherwise fall back to the mirror.
  let couponDiscount = 0;
  if (typeof wixReportedDiscount === "number" && wixReportedDiscount > 0) {
    couponDiscount = wixReportedDiscount;
  } else if (appliedCouponCode) {
    couponDiscount = evaluateCoupon(appliedCouponCode, subtotal).discount;
  }

  const prepaidDiscount = isPrepaid ? PREPAID_DISCOUNT : 0;
  const total = Math.max(0, subtotal - couponDiscount - prepaidDiscount);

  return {
    subtotal,
    couponDiscount,
    prepaidDiscount,
    total,
    // *** DISPLAY ONLY — never send to a gateway / order / email. ***
    displaySubtotal: subtotal + SHIPPING_FEE_DISPLAY + PROCESSING_FEE_DISPLAY,
    shippingFeeDisplay: SHIPPING_FEE_DISPLAY,
    processingFeeDisplay: PROCESSING_FEE_DISPLAY,
  };
};
