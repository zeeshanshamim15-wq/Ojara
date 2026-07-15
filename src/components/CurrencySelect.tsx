"use client";

import { useEffect, useState } from "react";

// Display-only region selector for now. Persists the choice so it sticks across
// visits; wiring it to real price conversion can come later. Prices render in
// INR today, so INR leads and is the default.
const currencies = ["INR", "USD"] as const;
type Currency = (typeof currencies)[number];

export default function CurrencySelect({
  className = "",
}: {
  className?: string;
}) {
  const [currency, setCurrency] = useState<Currency>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("ojara-currency");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of a persisted preference on mount
    if (saved === "USD" || saved === "INR") setCurrency(saved);
  }, []);

  const handleChange = (value: Currency) => {
    setCurrency(value);
    localStorage.setItem("ojara-currency", value);
  };

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">Select currency</span>
      <select
        value={currency}
        onChange={(e) => handleChange(e.target.value as Currency)}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1 pl-3 pr-6 text-xs uppercase tracking-[0.2em] text-champagne-gold/95 transition-colors duration-300 ease-out hover:text-champagne-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold/40"
      >
        {currencies.map((c) => (
          <option key={c} value={c} className="bg-midnight-navy text-ivory">
            {c}
          </option>
        ))}
      </select>
      {/* Chevron */}
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
        className="pointer-events-none absolute right-1 text-champagne-gold"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
