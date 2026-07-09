"use client";

import { toast } from "sonner";
import type { Product } from "@/lib/mockData";
import { useCartStore } from "@/lib/store/useCartStore";

export default function AddToCartButton({
  product,
  className,
  children = "Add to Bag",
  onAdded,
}: {
  product: Product;
  className?: string;
  children?: React.ReactNode;
  // Optional hook fired after the item is added (e.g. to close a modal).
  onAdded?: () => void;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleClick = () => {
    addItem(product);
    toast.success("✦ Added to your ritual", {
      description: product.name,
    });
    onAdded?.();
    openCart(); // slide the drawer open to confirm the addition
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
