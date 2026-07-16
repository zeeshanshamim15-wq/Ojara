"use client";

import dynamic from "next/dynamic";
import { useCartStore } from "@/lib/store/useCartStore";

// The single mount point for the account drawer, rendered once from layout.
//
// Header (desktop) and MobileBottomNav (mobile) each used to render their own
// <AuthDrawer>. MobileBottomNav is only visually hidden on desktop (md:hidden),
// so it still mounted — putting TWO drawers in the DOM at once, each with
// id="ojara-email" / id="ojara-password" and aria-modal="true". Duplicate ids
// meant <label htmlFor> could focus the hidden copy, so the visible form read as
// untypeable and its buttons looked dead.
//
// Keeping it dynamic/ssr:false preserves the original behaviour: the drawer is a
// heavy client-only surface and shouldn't be in the server payload.
const AuthDrawer = dynamic(() => import("@/components/AuthDrawer"), {
  ssr: false,
});

export default function AuthDrawerMount() {
  const open = useCartStore((state) => state.isAuthOpen);
  const closeAuth = useCartStore((state) => state.closeAuth);

  return <AuthDrawer open={open} onClose={closeAuth} />;
}
