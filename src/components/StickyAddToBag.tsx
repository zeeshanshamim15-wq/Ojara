"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/mockData";
import { useCartStore } from "@/lib/store/useCartStore";

/**
 * Scroll-triggered checkout nudge. It watches the main "Add to Bag" button
 * (identified by #main-add-to-bag) and slides a compact bar up from the bottom
 * once that button has scrolled up out of view — keeping the primary action
 * within reach on long product pages, especially on mobile.
 */
export default function StickyAddToBag({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const target = document.getElementById("main-add-to-bag");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show once the main button has scrolled ABOVE the viewport,
        // never while it's still below the fold on first load.
        setVisible(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    addItem(product);
    toast.success("✦ Added to your ritual", { description: product.name });
    openCart();
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-champagne-gold/25 bg-midnight-navy/95 backdrop-blur-sm transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      {/* pb accounts for the iOS home indicator so the CTA stays in the thumb zone */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pt-4">
        <div className="min-w-0">
          <p className="truncate text-sm text-ivory sm:text-base">
            {product.name}
          </p>
          <p className="text-xs text-champagne-gold sm:text-sm">
            ${product.price}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex-shrink-0 rounded-full bg-champagne-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-midnight-navy transition-colors duration-300 ease-out hover:bg-champagne-gold/85 sm:px-10"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}
