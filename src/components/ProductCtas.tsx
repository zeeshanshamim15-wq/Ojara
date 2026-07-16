"use client";

import { toast } from "sonner";
import type { Product } from "@/lib/mockData";
import AddToCartButton from "@/components/AddToCartButton";
import { useCartStore } from "@/lib/store/useCartStore";

export default function ProductCtas({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const openCheckout = useCartStore((state) => state.openCheckout);
  const cartItems = useCartStore((state) => state.cartItems);
  const isOutOfStock = product.stockCount === 0;

  const handleBuyNow = () => {
    // Check if there are other items in the cart
    const hasOtherItems = cartItems.some((item) => item.product.id !== product.id);

    if (hasOtherItems) {
      const proceed = window.confirm(
        "✦ You already have items in your cart from a previous session.\n\nClick 'OK' to combine them and proceed to checkout, or 'Cancel' to review your cart."
      );
      if (!proceed) {
        openCart(); // Show the cart drawer
        return;
      }
    }

    // Add the current item to the cart if not already present
    const alreadyInCart = cartItems.some((item) => item.product.id === product.id);
    if (!alreadyInCart) {
      addItem(product);
    }

    toast.success("✦ Item secured! Proceeding to checkout...", {
      description: product.name,
      style: {
        background: "#10b981",
        color: "#ffffff",
        border: "none",
      },
    });

    openCheckout(); // Open checkout directly
  };

  if (isOutOfStock) {
    return (
      <div className="mt-6">
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full bg-gray-200 text-gray-500 border border-gray-300 px-6 py-4 text-xs font-bold uppercase tracking-wider text-center"
        >
          SOLD OUT - JOIN WAITLIST
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Trust strip. Was "Get Extra ₹50 Off on Prepaid Payments" — pulled while
          prepaid is disabled (see PREPAID_ENABLED in CheckoutModal): advertising a
          discount for a payment method the shopper cannot select is a promise the
          checkout can't keep. Restore that line when prepaid comes back. */}
      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-md px-4 py-3 text-xs font-semibold flex items-center gap-2 mt-6">
        <span>✦</span>
        <span>Cash on Delivery available · Free shipping across India</span>
      </div>

      <div id="main-add-to-bag" className="mt-6">
        <div className="grid grid-cols-2 gap-4">
          <AddToCartButton
            product={product}
            className="w-full rounded-full border border-midnight-navy bg-transparent text-midnight-navy px-6 py-4 text-xs font-bold uppercase tracking-wider hover:bg-midnight-navy hover:text-ivory transition-colors"
          >
            Add to Cart
          </AddToCartButton>
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full cursor-pointer rounded-full bg-champagne-gold text-midnight-navy px-6 py-4 text-xs font-bold uppercase tracking-wider hover:bg-champagne-gold/85 transition-all duration-150 md:hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            Buy Now ⚡
          </button>
        </div>
      </div>
    </>
  );
}
