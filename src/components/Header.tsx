"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useCartStore,
  selectTotalQuantity,
  useCartHydrated,
} from "@/lib/store/useCartStore";
import SearchOverlay from "@/components/SearchOverlay";
import AccountModal from "@/components/AccountModal";
import CurrencySelect from "@/components/CurrencySelect";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default function Header() {
  const totalQuantity = useCartStore(selectTotalQuantity);
  const openCart = useCartStore((state) => state.openCart);
  const hydrated = useCartHydrated();
  const count = hydrated ? totalQuantity : 0;

  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-champagne-gold/15 bg-midnight-navy/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            prefetch
            className="font-heading text-2xl uppercase tracking-[0.3em] text-champagne-gold"
          >
            Ojara
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <CurrencySelect className="mr-1 hidden sm:inline-flex" />

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-champagne-gold transition-colors duration-300 ease-out hover:text-ivory"
            >
              <svg {...iconProps}>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* Account */}
            <button
              type="button"
              aria-label="Account"
              onClick={() => setAccountOpen(true)}
              className="rounded-full p-2 text-champagne-gold transition-colors duration-300 ease-out hover:text-ivory"
            >
              <svg {...iconProps}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
              </svg>
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label="Cart"
              onClick={openCart}
              className="relative rounded-full p-2 text-champagne-gold transition-colors duration-300 ease-out hover:text-ivory"
            >
              <svg {...iconProps}>
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M2.5 3h2l2.2 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-champagne-gold text-[10px] font-medium text-midnight-navy">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
