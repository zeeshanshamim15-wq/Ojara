"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  useCartStore,
  selectTotalPrice,
  useCartHydrated,
} from "@/lib/store/useCartStore";
import RecentlyViewed from "@/components/RecentlyViewed";

// Spend this much (in dollars) to unlock complimentary shipping.
const FREE_SHIPPING_THRESHOLD = 300;
// Flat fee for the luxury gift-wrap + handwritten intention note.
const GIFT_WRAP_FEE = 15;

export default function CartDrawer() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItemsRaw = useCartStore((state) => state.cartItems);
  const totalPriceRaw = useCartStore(selectTotalPrice);

  // Guard against hydration mismatch: match the server's empty render first.
  const hydrated = useCartHydrated();
  const cartItems = hydrated ? cartItemsRaw : [];
  const totalPrice = hydrated ? totalPriceRaw : 0;

  // Luxury gift wrap + intention note upsell.
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0;
  const displayTotal = totalPrice + giftWrapFee;

  // Offer code — frontend only for now.
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoApplied(true);
    setPromoCode("");
    toast.success("✦ Harmony code applied successfully.");
  };

  // Checkout hand-off. Placeholder for the real Wix Secure Checkout API — for
  // now it shows a loading state, toasts, then clears the bag to simulate a
  // successful hand-off.
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleWixCheckout = async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    toast.success("✦ Initiating Wix Secure Checkout...", {
      description: "Awaiting API Integration",
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setPromoApplied(false);
    setGiftWrap(false);
    setGiftNote("");
    setIsCheckingOut(false);
  };

  // Free-shipping progress: how far to the threshold, and how full the bar is.
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const hasFreeShipping = amountToFreeShipping === 0;
  const shippingProgress = Math.min(
    100,
    (totalPrice / FREE_SHIPPING_THRESHOLD) * 100,
  );

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!isCartOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, closeCart]);

  return (
    <>
      {/* Dark overlay — click to close */}
      <div
        aria-hidden={!isCartOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-midnight-navy/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sliding panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-grey/40 px-6 py-5">
          <h2 className="font-heading text-xl uppercase tracking-[0.25em] text-midnight-navy">
            Your Bag
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="rounded-full p-1 text-midnight-navy/70 transition-colors hover:text-midnight-navy"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free-shipping progress — nudges average order value upward */}
        {cartItems.length > 0 && (
          <div className="border-b border-warm-grey/40 px-6 py-4">
            <p className="text-center text-xs leading-5 tracking-wide text-midnight-navy/80 sm:text-sm">
              {hasFreeShipping ? (
                <span className="font-medium text-champagne-gold">
                  ✦ You have unlocked Free Shipping!
                </span>
              ) : (
                <>
                  You are{" "}
                  <span className="font-medium text-midnight-navy">
                    ${amountToFreeShipping}
                  </span>{" "}
                  away from Free Shipping!
                </>
              )}
            </p>
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sand"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={FREE_SHIPPING_THRESHOLD}
              aria-valuenow={Math.min(totalPrice, FREE_SHIPPING_THRESHOLD)}
              aria-label="Progress toward free shipping"
            >
              <div
                className="h-full rounded-full bg-champagne-gold transition-[width] duration-500 ease-out"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col justify-center">
              <div className="text-center">
                <p className="text-midnight-navy/70">Your bag is empty.</p>
                <p className="mt-2 text-sm text-warm-grey">
                  Add a piece to carry your intention.
                </p>
              </div>
              {/* Nudge back into the catalogue with their own history */}
              <div className="mt-10">
                <RecentlyViewed variant="compact" onNavigate={closeCart} />
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-warm-grey/40">
              {cartItems.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-sand">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <h3 className="text-base text-midnight-navy">
                        {item.product.name}
                      </h3>
                      <span className="text-base text-midnight-navy">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-champagne-gold">
                      {item.product.intention}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-sm text-midnight-navy/70">
                        Qty {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs uppercase tracking-[0.15em] text-midnight-navy/50 underline-offset-4 transition-colors hover:text-midnight-navy hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer: total + checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-warm-grey/40 px-6 py-6">
            {/* Luxury gift wrap + intention note */}
            <div className="mb-5 border-b border-warm-grey/40 pb-5">
              <button
                type="button"
                role="switch"
                aria-checked={giftWrap}
                onClick={() => setGiftWrap((v) => !v)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-midnight-navy/80">
                  ✦ Add Luxury Gift Wrap &amp; Intention Note{" "}
                  <span className="text-champagne-gold">(+${GIFT_WRAP_FEE})</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300 ease-out ${
                    giftWrap ? "bg-champagne-gold" : "bg-warm-grey/50"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-transform duration-300 ease-out ${
                      giftWrap ? "translate-x-[1.375rem]" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>

              <div
                className={`grid transition-all duration-500 ease-out ${
                  giftWrap
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.15em] text-midnight-navy/50">
                      Your handwritten note
                    </span>
                    <textarea
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      rows={3}
                      maxLength={240}
                      placeholder="With love and light — may this carry your intention…"
                      className="mt-2 w-full resize-none rounded-2xl border border-warm-grey/50 bg-white/50 px-4 py-3 text-sm leading-6 text-midnight-navy placeholder:text-warm-grey focus:border-champagne-gold focus:outline-none focus:ring-2 focus:ring-champagne-gold/30"
                    />
                    <span className="mt-1 block text-right text-[0.65rem] text-warm-grey">
                      {giftNote.length}/240
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Offer code — collapsible */}
            <div className="mb-5 border-b border-warm-grey/40 pb-5">
              <button
                type="button"
                onClick={() => setPromoOpen((v) => !v)}
                aria-expanded={promoOpen}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-midnight-navy/70">
                  Apply Offer Code
                </span>
                <span
                  aria-hidden="true"
                  className={`text-lg leading-none text-champagne-gold transition-transform duration-300 ease-out ${
                    promoOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid transition-all duration-500 ease-out ${
                  promoOpen
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <form onSubmit={applyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoApplied(false);
                      }}
                      placeholder="Enter code"
                      aria-label="Offer code"
                      className="flex-1 rounded-full border border-warm-grey/50 bg-white/50 px-4 py-2.5 text-sm uppercase tracking-[0.15em] text-midnight-navy placeholder:normal-case placeholder:tracking-normal placeholder:text-warm-grey focus:border-champagne-gold focus:outline-none focus:ring-2 focus:ring-champagne-gold/30"
                    />
                    <button
                      type="submit"
                      className="flex-shrink-0 rounded-full bg-midnight-navy px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-champagne-gold transition-colors duration-300 ease-out hover:bg-midnight-navy/90"
                    >
                      Apply
                    </button>
                  </form>
                  {promoApplied && (
                    <p className="mt-3 text-xs tracking-wide text-champagne-gold">
                      ✦ Code applied — savings appear at checkout.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {giftWrap && (
              <div className="mb-2 flex items-center justify-between text-xs text-midnight-navy/60">
                <span className="uppercase tracking-[0.15em]">
                  Gift wrap &amp; note
                </span>
                <span>+${GIFT_WRAP_FEE}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.2em] text-midnight-navy/70">
                Total
              </span>
              <span className="text-2xl text-midnight-navy">
                ${displayTotal}
              </span>
            </div>
            <button
              type="button"
              onClick={handleWixCheckout}
              disabled={isCheckingOut}
              aria-busy={isCheckingOut}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-champagne-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.25em] text-midnight-navy transition-colors duration-300 ease-out hover:bg-champagne-gold/85 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCheckingOut && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-midnight-navy/30 border-t-midnight-navy"
                />
              )}
              {isCheckingOut ? "Processing..." : "Checkout"}
            </button>
            <p className="mt-3 text-center text-xs text-warm-grey">
              Secure Wix checkout · encrypted &amp; protected.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
