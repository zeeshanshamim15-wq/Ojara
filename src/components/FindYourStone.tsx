"use client";

import { useState } from "react";
import EnergyQuiz from "@/components/EnergyQuiz";

/**
 * Self-contained "Find Your Stone" CTA + quiz. Drop it anywhere (Hero, Header)
 * and it owns its own open state, so server components can render it freely.
 */
export default function FindYourStone({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold px-8 py-3.5 text-xs font-normal uppercase tracking-[0.25em] text-champagne-gold transition-colors duration-300 ease-out hover:bg-champagne-gold hover:text-midnight-navy sm:px-10 sm:text-sm"
        }
      >
        ✦ Find Your Stone
      </button>

      <EnergyQuiz open={open} onClose={() => setOpen(false)} />
    </>
  );
}
