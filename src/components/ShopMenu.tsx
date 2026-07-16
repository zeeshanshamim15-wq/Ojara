"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/catalog";

// Hover to open on pointer devices, click/Enter on touch and keyboard. Closing
// is deliberately forgiving: a short delay on mouseleave so a diagonal path from
// the trigger down into the panel doesn't dismiss it mid-travel.
const CLOSE_DELAY_MS = 120;

export default function ShopMenu() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    cancelClose();
    // Load categories dynamically from the API route
    async function load() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const list = await res.json();
          setCategories(list);
        }
      } catch (e) {
        console.error("Failed to load categories in ShopMenu:", e);
      }
    }
    load();
  }, []);

  // Escape closes and returns focus to the page; clicking away closes too.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        // Only close once focus has left the trigger *and* the panel.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs uppercase tracking-[0.25em] text-champagne-gold transition-all duration-150 hover:text-ivory active:scale-95"
      >
        Shop
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-300 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Panel. Anchored to the trigger on desktop; full-width sheet on mobile. */}
      <div
        className={`absolute left-1/2 top-full z-[100] w-[320px] -translate-x-1/2 pt-4 transition-all duration-300 ease-out ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-champagne-gold/30 bg-midnight-navy/98 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div>
            <p className="mb-4 text-[0.65rem] uppercase tracking-[0.35em] text-champagne-gold/90">
              Shop by Collection
            </p>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    prefetch
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm tracking-wide text-ivory transition-colors duration-300 ease-out hover:bg-champagne-gold/10 hover:text-champagne-gold"
                  >
                    ✦ {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-champagne-gold/30 pt-4">
            <Link
              href="/#collection"
              prefetch
              onClick={() => setOpen(false)}
              className="cursor-pointer text-xs uppercase tracking-[0.25em] text-champagne-gold underline-offset-8 transition-all duration-150 ease-out hover:text-ivory hover:underline active:scale-95"
            >
              View the full collection →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
