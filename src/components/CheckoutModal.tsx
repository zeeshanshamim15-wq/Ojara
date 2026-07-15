"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { formatPrice } from "@/lib/format";
import {
  computeTotals,
  evaluateCoupon,
  PREPAID_DISCOUNT,
} from "@/lib/commerce/pricing";
import { WIX_ENABLED, BRAND_NAME } from "@/lib/commerce/config";

type PaymentMethod = "PREPAID" | "COD";

// ISO 3166-2 subdivision codes — Wix requires the CODE, not free text.
const IN_STATES: { code: string; name: string }[] = [
  { code: "IN-AP", name: "Andhra Pradesh" },
  { code: "IN-AS", name: "Assam" },
  { code: "IN-BR", name: "Bihar" },
  { code: "IN-CT", name: "Chhattisgarh" },
  { code: "IN-DL", name: "Delhi" },
  { code: "IN-GA", name: "Goa" },
  { code: "IN-GJ", name: "Gujarat" },
  { code: "IN-HR", name: "Haryana" },
  { code: "IN-HP", name: "Himachal Pradesh" },
  { code: "IN-JH", name: "Jharkhand" },
  { code: "IN-KA", name: "Karnataka" },
  { code: "IN-KL", name: "Kerala" },
  { code: "IN-MP", name: "Madhya Pradesh" },
  { code: "IN-MH", name: "Maharashtra" },
  { code: "IN-OR", name: "Odisha" },
  { code: "IN-PB", name: "Punjab" },
  { code: "IN-RJ", name: "Rajasthan" },
  { code: "IN-TN", name: "Tamil Nadu" },
  { code: "IN-TG", name: "Telangana" },
  { code: "IN-UP", name: "Uttar Pradesh" },
  { code: "IN-UT", name: "Uttarakhand" },
  { code: "IN-WB", name: "West Bengal" },
];

// Razorpay ships no npm checkout SDK — inject the script on demand.
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutModal() {
  const router = useRouter();
  const wixClient = useWixClient();
  const cartItems = useCartStore((s) => s.cartItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const open = useCartStore((s) => s.isCheckoutOpen);
  const onClose = useCartStore((s) => s.closeCheckout);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  // COD by default: pre-keys it completes the full mock order + email flow. The
  // prepaid −₹50 optics show the moment the shopper switches to "Pay Online".
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  // Normalised cart lines — the seam. Today from the local store; when the Wix
  // cart takes over (Phase 2) this maps the Wix lineItems to the same shape.
  const lines = useMemo(
    () =>
      cartItems.map((ci) => ({
        id: ci.product.id,
        name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        image: ci.product.image,
        wixCatalogItemId: ci.product.wixCatalogItemId,
      })),
    [cartItems],
  );

  const isPrepaid = paymentMethod === "PREPAID";
  const totals = useMemo(
    () =>
      computeTotals({
        lines,
        isPrepaid,
        appliedCouponCode: appliedCoupon || undefined,
      }),
    [lines, isPrepaid, appliedCoupon],
  );

  // Reset transient UI whenever the modal opens; lock body scroll while open.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const goToStep2 = () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStep(2);
  };

  const validateDelivery = (): string => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!address.trim()) return "Please enter your address.";
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim()))
      return "Please enter a valid 6-digit pincode.";
    if (!city.trim()) return "Please enter your city.";
    if (!stateCode) return "Please select your state.";
    if (mobile.replace(/\D/g, "").length !== 10)
      return "Phone must be exactly 10 digits (remove any country code).";
    return "";
  };

  const handleApplyCoupon = () => {
    const { discount, error: cErr } = evaluateCoupon(couponInput, totals.subtotal);
    if (discount > 0) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      setCouponError("");
      setCouponInput("");
      toast.success("✦ Coupon applied.");
    } else {
      setCouponError(cErr);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponError("");
  };

  // Build the item + summary payload the email renderer needs (mock mode) and the
  // Wix email step mirrors (live mode).
  const buildOrderPayload = () => {
    const stateName = IN_STATES.find((s) => s.code === stateCode)?.name || stateCode;
    return {
      items: lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unitPrice: String(l.price),
        lineTotal: String(l.price * l.quantity),
        image: l.image,
      })),
      summary: {
        subtotal: String(totals.subtotal),
        shipping: "0",
        discount: String(totals.couponDiscount + totals.prepaidDiscount),
        total: String(totals.total),
      },
      amount: totals.total.toFixed(2),
      stateName,
    };
  };

  // Turn the cart into an order via /api/checkout. Mock mode sends items+summary;
  // live mode first materialises a Wix checkout from the current cart.
  const finalizeOrder = async (
    method: PaymentMethod,
    razorpayPaymentId?: string,
  ): Promise<{ orderId: string }> => {
    const payload = buildOrderPayload();

    let checkoutId: string | undefined;
    if (WIX_ENABLED) {
      // Bridge the local cart into Wix so the order lands in Wix Stores. Requires
      // each product's wixCatalogItemId (populated once products are seeded).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wc = wixClient as any;
      const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
      const lineItems = lines
        .filter((l) => l.wixCatalogItemId)
        .map((l) => ({
          catalogReference: {
            appId: WIX_STORES_APP_ID,
            catalogItemId: l.wixCatalogItemId,
          },
          quantity: l.quantity,
        }));
      if (lineItems.length) {
        await wc.currentCart.addToCurrentCart({ lineItems });
      }
      const checkoutResult = await wc.currentCart.createCheckoutFromCurrentCart({
        channelType: "WEB",
      });
      checkoutId = checkoutResult?.checkoutId;
      if (!checkoutId) throw new Error("Wix returned an empty checkoutId.");
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkoutId,
        details: {
          email: email.trim(),
          fullName: fullName.trim(),
          phone: mobile.replace(/\D/g, ""),
          addressLine1: address.trim(),
          addressLine2: addressLine2.trim(),
          city: city.trim(),
          state: stateCode,
          postalCode: pincode.trim(),
          paymentMethod: method,
          razorpayPaymentId,
          razorpayAmount: method === "PREPAID" ? totals.total.toFixed(2) : undefined,
        },
        items: payload.items,
        summary: payload.summary,
        amount: payload.amount,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Order creation failed.");
    if (!data.orderId) throw new Error("No order ID was returned.");
    return { orderId: data.orderId };
  };

  const completeOrder = (orderId: string) => {
    clearCart();
    // Reset for next time (handler, not an effect — React Compiler safe).
    setStep(1);
    setProcessing(false);
    setError("");
    setAppliedCoupon("");
    if (WIX_ENABLED) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wixClient as any).currentCart
        ?.deleteCurrentCart?.()
        .catch(() => {});
    }
    onClose();
    router.push(`/success?orderId=${encodeURIComponent(orderId)}`);
  };

  // PREPAID: Razorpay order → widget → verify signature → THEN create the order.
  const runPrepaidOrder = async () => {
    const orderResponse = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totals.total,
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: { email: email.trim(), phone: mobile.replace(/\D/g, "") },
      }),
    });
    const orderData = await orderResponse.json().catch(() => ({}));
    if (!orderResponse.ok || !orderData?.order_id) {
      throw new Error(orderData?.error || "Could not start the payment.");
    }

    const scriptOk = await loadRazorpayScript();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!scriptOk || !(window as any).Razorpay) {
      throw new Error("Could not load the payment gateway. Check your connection.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay({
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.order_id,
      name: BRAND_NAME,
      description: "Order payment",
      prefill: {
        name: fullName.trim(),
        email: email.trim(),
        contact: mobile.replace(/\D/g, ""),
      },
      notes: { address: address.trim() },
      theme: { color: "#071a47" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyResponse.json().catch(() => ({}));
          if (!verifyResponse.ok || !verifyData?.verified) {
            throw new Error("Payment verification failed.");
          }
          const { orderId } = await finalizeOrder(
            "PREPAID",
            response.razorpay_payment_id,
          );
          completeOrder(orderId);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setError(
            `Payment received but the order could not be completed: ${msg}. Please contact support with payment ID ${response.razorpay_payment_id}.`,
          );
          setProcessing(false);
        }
      },
      modal: { ondismiss: () => setProcessing(false) },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rzp.on("payment.failed", (resp: any) => {
      setError(`Payment failed: ${resp?.error?.description || "Please try again."}`);
      setProcessing(false);
    });

    rzp.open();
  };

  const handlePayment = async () => {
    const validationError = validateDelivery();
    if (validationError) return setError(validationError);
    if (!lines.length) return setError("Your bag is empty.");

    setError("");
    setProcessing(true);

    try {
      if (paymentMethod === "PREPAID") {
        await runPrepaidOrder(); // stays "processing" until its callbacks fire
        return;
      }
      const { orderId } = await finalizeOrder("COD");
      completeOrder(orderId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to place order: ${msg}`);
      setProcessing(false);
    }
  };

  if (!open) return null;

  const inputClass =
    "w-full rounded-md border border-midnight-navy/30 bg-white px-4 py-2.5 text-sm text-midnight-navy placeholder:text-midnight-navy/50 focus:outline-none focus:border-midnight-navy focus:ring-1 focus:ring-midnight-navy";

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-stretch justify-end">
      {/* Overlay */}
      <div
        onClick={() => !processing && onClose()}
        className="absolute inset-0 bg-midnight-navy/60 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-ivory shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-midnight-navy/15 px-6 py-5">
          <div>
            <h2 className="font-heading text-xl uppercase tracking-[0.25em] text-midnight-navy font-bold">
              Checkout
            </h2>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-midnight-navy/50">
              Step {step} of 2 · {step === 1 ? "Contact" : "Delivery & Payment"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close checkout"
            onClick={() => !processing && onClose()}
            className="cursor-pointer rounded-full p-1 text-midnight-navy/70 transition-all hover:text-midnight-navy active:scale-95"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-midnight-navy/70">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-2 ${inputClass}`}
                  autoFocus
                />
              </label>
              <p className="text-xs leading-6 text-midnight-navy/60">
                Your order confirmation and updates are sent here.
              </p>
              <button
                type="button"
                onClick={goToStep2}
                className="w-full cursor-pointer rounded-full bg-midnight-navy px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-champagne-gold transition-all hover:bg-midnight-navy/90 active:scale-95"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Delivery details */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className={`sm:col-span-2 ${inputClass}`} />
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile" inputMode="numeric" className={inputClass} />
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" inputMode="numeric" className={inputClass} />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (house no, street, area)" className={`sm:col-span-2 ${inputClass}`} />
                <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Landmark (optional)" className={`sm:col-span-2 ${inputClass}`} />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
                  <option value="">Select state</option>
                  {IN_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-midnight-navy/70">Payment method</span>
                {(["PREPAID", "COD"] as PaymentMethod[]).map((m) => (
                  <label
                    key={m}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                      paymentMethod === m
                        ? "border-champagne-gold bg-champagne-gold/10"
                        : "border-midnight-navy/20 hover:border-midnight-navy/40"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} className="accent-midnight-navy" />
                      <span className="text-sm font-medium text-midnight-navy">
                        {m === "PREPAID" ? "Pay Online (UPI / Card)" : "Cash on Delivery"}
                      </span>
                    </span>
                    {m === "PREPAID" && (
                      <span className="text-xs font-bold text-green-600">Save ₹{PREPAID_DISCOUNT}</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Coupon */}
              <div className="rounded-lg border border-midnight-navy/15 bg-white/50 p-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-700">
                      ✦ {appliedCoupon} applied
                    </span>
                    <button type="button" onClick={handleRemoveCoupon} className="cursor-pointer text-xs text-midnight-navy/60 underline underline-offset-2 hover:text-midnight-navy">
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }} placeholder="Coupon code" className={`flex-1 ${inputClass} uppercase`} />
                      <button type="button" onClick={handleApplyCoupon} className="flex-shrink-0 cursor-pointer rounded-full bg-midnight-navy px-5 py-2 text-xs font-medium uppercase tracking-wider text-champagne-gold transition-all hover:bg-midnight-navy/90 active:scale-95">
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
                  </>
                )}
              </div>

              {/* Totals — the "tigdam" */}
              <div className="space-y-1.5 rounded-lg bg-sand/30 p-4 text-sm">
                <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                <Row
                  label="Shipping"
                  strike={formatPrice(totals.shippingFeeDisplay)}
                  value="FREE"
                  valueClass="text-green-600 font-bold"
                />
                <Row
                  label="Processing fee"
                  strike={formatPrice(totals.processingFeeDisplay)}
                  value="₹0"
                  valueClass="text-green-600 font-bold"
                />
                {totals.couponDiscount > 0 && (
                  <Row label={`Coupon (${appliedCoupon})`} value={`− ${formatPrice(totals.couponDiscount)}`} valueClass="text-champagne-gold font-semibold" />
                )}
                {totals.prepaidDiscount > 0 && (
                  <Row label="Online payment discount" value={`− ${formatPrice(totals.prepaidDiscount)}`} valueClass="text-champagne-gold font-semibold" />
                )}
                <div className="mt-2 flex items-center justify-between border-t border-midnight-navy/15 pt-2">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-midnight-navy/80">To pay</span>
                  <span className="text-xl font-bold text-midnight-navy">{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer CTA (step 2 only) */}
        {step === 2 && (
          <div className="border-t border-midnight-navy/15 bg-ivory/95 px-6 py-4 backdrop-blur">
            <button
              type="button"
              onClick={handlePayment}
              disabled={processing}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-champagne-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-midnight-navy shadow-lg transition-all hover:bg-champagne-gold/85 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {processing
                ? "Processing…"
                : paymentMethod === "PREPAID"
                  ? `Pay ${formatPrice(totals.total)} securely ⚡`
                  : `Place order · ${formatPrice(totals.total)}`}
            </button>
            <p className="mt-2 text-center text-[0.6rem] uppercase tracking-wider text-midnight-navy/50">
              🔒 Secure checkout · {isPrepaid ? "Razorpay encrypted" : "Pay on delivery"}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Row({
  label,
  value,
  strike,
  valueClass = "text-midnight-navy",
}: {
  label: string;
  value: string;
  strike?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-midnight-navy/80">
      <span className="text-xs uppercase tracking-[0.12em]">{label}</span>
      <span className="flex items-center gap-2">
        {strike && <span className="text-xs text-midnight-navy/40 line-through">{strike}</span>}
        <span className={`text-sm ${valueClass}`}>{value}</span>
      </span>
    </div>
  );
}
