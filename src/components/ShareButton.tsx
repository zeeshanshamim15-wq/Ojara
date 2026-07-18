"use client";

import { useState } from "react";

type ShareButtonProps = {
  productName: string;
  className?: string;
};

// Native share sheet where the browser supports it (mobile, some desktops);
// otherwise fall back to copying the page URL to the clipboard and flashing a
// "Link copied" confirmation so the tap is never a no-op.
export default function ShareButton({ productName, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${productName} | OJARA`,
      text: `Check out the ${productName} from OJARA`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed the sheet, or share failed — fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — nothing else to do.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${productName}`}
      className={`cursor-pointer inline-flex items-center gap-2 rounded-full border border-champagne-gold/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-midnight-navy/70 transition-all duration-150 ease-out hover:border-champagne-gold hover:text-midnight-navy active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Link copied
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
