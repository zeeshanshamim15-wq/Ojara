"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/catalog";

// The mega menu's counterpart below the md breakpoint. A hover popover doesn't
// translate to touch, so the same categories are served as a full-width sheet.
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load categories dynamically
    async function load() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const list = await res.json();
          setCategories(list);
        }
      } catch (e) {
        console.error("Failed to load categories in MobileNav:", e);
      }
    }
    load();
  }, []);

  // Lock body scroll while the sheet is open; close on Escape.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer rounded-full p-2 text-champagne-gold transition-all duration-150 hover:text-ivory active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-100%)] overflow-y-auto border-t border-champagne-gold/30 bg-midnight-navy/98 backdrop-blur-sm">
          <div className="space-y-8 px-6 py-8">
            <div>
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.35em] text-champagne-gold/90">
                Shop by Collection
              </p>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      prefetch
                      onClick={() => setOpen(false)}
                      className="block py-2.5 text-sm tracking-wide text-ivory transition-colors duration-300 ease-out hover:text-champagne-gold"
                    >
                      ✦ {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 border-t border-champagne-gold/30 pt-6">
              <Link
                href="/our-story"
                prefetch
                onClick={() => setOpen(false)}
                className="block py-2.5 text-xs uppercase tracking-[0.25em] text-champagne-gold transition-colors duration-300 ease-out hover:text-ivory"
              >
                Our Story
              </Link>
              <Link
                href="/faq"
                prefetch
                onClick={() => setOpen(false)}
                className="block py-2.5 text-xs uppercase tracking-[0.25em] text-champagne-gold transition-colors duration-300 ease-out hover:text-ivory"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
