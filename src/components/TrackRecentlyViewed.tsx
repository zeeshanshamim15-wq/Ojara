"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";

/**
 * Invisible tracker dropped onto a product page. On mount it records the current
 * product in the persisted "recently viewed" history.
 */
export default function TrackRecentlyViewed({ productId }: { productId: string }) {
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed(productId);
  }, [productId, addRecentlyViewed]);

  return null;
}
