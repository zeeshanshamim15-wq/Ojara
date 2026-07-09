"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ojara-cookie-consent";

export default function CookieBanner() {
  // Start hidden so the server and first client render match; reveal only once
  // we've confirmed (client-side) that consent hasn't been given yet.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "accepted") {
      // Small delay so it eases in after the page settles.
      const id = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(id);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-[80] transition-transform duration-500 ease-out ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:flex-row sm:justify-between sm:gap-8">
        <div className="rounded-2xl border border-champagne-gold/25 bg-midnight-navy/95 px-6 py-4 shadow-xl backdrop-blur-sm sm:flex sm:flex-1 sm:items-center sm:justify-between sm:gap-6">
          <p className="text-center text-xs leading-6 text-ivory/80 sm:text-left sm:text-sm">
            We use cookies to enhance your spiritual journey — remembering your
            bag and tailoring your experience. See our{" "}
            <Link
              href="/privacy"
              prefetch
              className="text-champagne-gold underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={accept}
            className="mt-4 w-full flex-shrink-0 rounded-full bg-champagne-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-midnight-navy transition-colors duration-300 ease-out hover:bg-champagne-gold/85 sm:mt-0 sm:w-auto"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
