"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Reusable FAQ accordion. Unlike the PDP's single-open RitualAccordion, each
 * question opens independently (FAQ convention). Shared by the general FAQ page
 * and the item-specific FAQ on the product page. Calm ease-out reveal.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (index: number) =>
    setOpen((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    );

  return (
    <div className="divide-y divide-champagne-gold/25 border-y border-champagne-gold/25">
      {items.map((item, index) => {
        const isOpen = open.includes(index);
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base tracking-wide text-midnight-navy sm:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-xl leading-none text-champagne-gold transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-all duration-500 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-sm leading-7 text-midnight-navy/70">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
