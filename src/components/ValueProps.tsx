import type { ReactNode } from "react";

interface ValueProp {
  title: string;
  description: string;
  icon: ReactNode;
}

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 32,
  height: 32,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const values: ValueProp[] = [
  {
    title: "Handcrafted Excellence",
    description:
      "Each piece is set by hand in small batches, finished with the care of a single maker.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 4 8v8l8 5 8-5V8l-8-5Z" />
        <path d="M12 3v18M4 8l8 5 8-5" />
      </svg>
    ),
  },
  {
    title: "Natural Gemstones",
    description:
      "Ethically sourced crystals, chosen for their clarity, colour, and quiet character.",
    icon: (
      <svg {...iconProps}>
        <path d="M6 3h12l3 6-9 12L3 9l3-6Z" />
        <path d="M3 9h18M9 3l3 18M15 3l-3 18" />
      </svg>
    ),
  },
  {
    title: "Meaningful Energy",
    description:
      "Every stone carries an intention — worn close, to hold what matters near.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
  },
];

export default function ValueProps() {
  return (
    <section className="border-y border-champagne-gold/20 bg-sand px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-champagne-gold/30 bg-champagne-gold/30 sm:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col items-center bg-ivory px-8 py-16 text-center"
          >
            <span className="text-champagne-gold">{value.icon}</span>
            <h3 className="mt-8 text-lg uppercase tracking-[0.2em] text-midnight-navy">
              {value.title}
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-7 text-midnight-navy/60">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
