"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

// Trending searches deep-link to the most relevant piece so the overlay is
// useful even before real search is wired up.
const trending = [
  { label: "Pyrite", href: "/product/raw-pyrite-cluster" },
  { label: "Evil Eye", href: "/product/evil-eye-bracelet" },
  { label: "Protection", href: "/product/evil-eye-bracelet" },
];

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    // Focus the field once the overlay is up.
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      window.clearTimeout(id);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[90] bg-midnight-navy/80 backdrop-blur-md transition-opacity duration-500 ease-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute right-6 top-6 cursor-pointer rounded-full p-2 text-champagne-gold transition-all duration-150 hover:text-ivory active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
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

      {/* Panel — stop propagation so clicks inside don't close */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        className={`mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 transition-transform duration-500 ease-out ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <span className="text-center text-xs uppercase tracking-[0.4em] text-champagne-gold">
          Search
        </span>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            toast.success(`✦ Divining results for "${query.trim()}"...`, {
              description: "Full search is aligning soon.",
            });
            onClose();
          }}
          className="mt-8 border-b border-champagne-gold/50 focus-within:border-champagne-gold"
        >
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you seeking?"
            aria-label="Search sacred objects"
            className="w-full bg-transparent pb-4 text-center font-heading text-3xl text-ivory placeholder:text-ivory/70 focus:outline-none sm:text-4xl"
          />
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-ivory/80">
            Trending Searches
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {trending.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch
                onClick={onClose}
                className="cursor-pointer rounded-full border border-champagne-gold/30 px-5 py-2 text-sm tracking-wide text-ivory/90 transition-all duration-150 hover:border-champagne-gold hover:bg-champagne-gold/15 active:scale-95"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
