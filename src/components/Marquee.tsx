const PHRASE =
  "✦ FREE GLOBAL SHIPPING ✦ ETHICALLY SOURCED CRYSTALS ✦ CLEANSED & CHARGED ✦ MAGNIFY YOUR INTENTION ✦";

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-champagne-gold py-2.5 text-midnight-navy">
      {/* Two identical halves; translating the track -50% loops seamlessly */}
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((half) => (
          <span
            key={half}
            aria-hidden={half === 1}
            className="flex shrink-0 items-center text-xs font-medium uppercase tracking-[0.3em]"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="px-8">
                {PHRASE}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
