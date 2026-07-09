import Link from "next/link";

// Shop By Intention — a visual, energy-first way in for the shopper. Each
// intention deep-links to the sacred object that best carries it, so the bar
// works as real navigation rather than decoration.
const intentions = [
  { label: "Attract Wealth", href: "/product/raw-pyrite-cluster" },
  { label: "Evil Eye Protection", href: "/product/evil-eye-bracelet" },
  { label: "Chakra Healing", href: "/product/chakra-crystal-tree" },
  { label: "Inner Peace", href: "/product/tigers-eye-focus-stone" },
  { label: "Good Fortune", href: "/product/golden-vastu-turtle" },
];

export default function IntentionNav() {
  return (
    <nav
      aria-label="Shop by intention"
      className="border-b border-champagne-gold/20 bg-ivory"
    >
      <div className="mx-auto max-w-6xl px-6 py-5">
        <p className="mb-4 text-center text-[0.65rem] uppercase tracking-[0.4em] text-champagne-gold sm:text-xs">
          Shop By Intention
        </p>
        <ul className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 sm:justify-center">
          {intentions.map((intention) => (
            <li key={intention.label} className="snap-start">
              <Link
                href={intention.href}
                prefetch
                className="inline-flex whitespace-nowrap rounded-full border border-champagne-gold/25 bg-sand px-6 py-3 text-sm tracking-wide text-midnight-navy transition-all duration-300 ease-out hover:border-champagne-gold hover:bg-champagne-gold/25 hover:shadow-sm"
              >
                ✦ {intention.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
