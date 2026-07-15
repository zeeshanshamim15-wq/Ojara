import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/mockData";

export interface CartItem {
  product: Product;
  quantity: number;
}

// How many recently-viewed product IDs we keep on hand.
const RECENTLY_VIEWED_LIMIT = 8;

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  // The checkout modal (opened from the cart's "ORDER NOW"). Never persisted.
  isCheckoutOpen: boolean;
  // Product IDs, most-recent first. Powers the "Recently Viewed" rails.
  recentlyViewed: string[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addRecentlyViewed: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      recentlyViewed: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.cartItems.find(
            (item) => item.product.id === product.id,
          );

          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            cartItems: [...state.cartItems, { product, quantity: 1 }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.product.id !== productId,
          ),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        })),

      clearCart: () => set({ cartItems: [] }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // Opening checkout closes the cart drawer so they don't stack.
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      addRecentlyViewed: (productId) =>
        set((state) => ({
          // Move to the front, drop any duplicate, cap the list length.
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, RECENTLY_VIEWED_LIMIT),
        })),
    }),
    {
      name: "ojara-cart",
      storage: createJSONStorage(() => localStorage),
      // Cart contents and browsing history survive refreshes — never the
      // open/closed UI state.
      partialize: (state) => ({
        cartItems: state.cartItems,
        recentlyViewed: state.recentlyViewed,
      }),
    },
  ),
);

/** Total number of items across all lines (primitive → safe default equality). */
export const selectTotalQuantity = (state: CartState) =>
  state.cartItems.reduce((sum, item) => sum + item.quantity, 0);

/** Total cart value in dollars. */
export const selectTotalPrice = (state: CartState) =>
  state.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

/**
 * Hydration guard. On the first client render this returns `false` so components
 * render the same (empty) state the server produced — avoiding a mismatch — then
 * flips to `true` after mount, once the persisted cart has rehydrated from
 * localStorage (which is synchronous, so it's ready by the time the effect runs).
 */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount flag for the SSR hydration guard
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
