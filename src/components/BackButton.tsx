"use client";

import { useRouter } from "next/navigation";

/**
 * A small, consistent "Back" control. Uses the browser history when there is a
 * previous entry, and otherwise falls back to a sensible in-site route so it is
 * never a dead end (e.g. a customer who landed on a product page from a shared
 * link and has no history to pop).
 */
export default function BackButton({
  fallbackHref = "/",
  label = "Back",
  tone = "dark",
  className = "",
}: {
  fallbackHref?: string;
  label?: string;
  // "dark" = navy text for ivory backgrounds; "light" = ivory text for dark heroes.
  tone?: "dark" | "light";
  className?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    // history.length is 1 when this is the first page in the tab's session.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  const toneClass =
    tone === "light"
      ? "text-ivory/80 hover:text-ivory"
      : "text-midnight-navy/60 hover:text-midnight-navy";

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={`inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 active:scale-95 ${toneClass} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
