// The site's top trust bar. Sits above the Header so the three objections an
// Indian shopper has (is it real? can I pay on delivery? what's shipping cost?)
// are answered before they scroll.
const PHRASE =
  "✦ 100% ORIGINAL LAB CERTIFIED CRYSTALS ✦ CASH ON DELIVERY AVAILABLE ✦ FREE PAN-INDIA SHIPPING ✦";

export default function AnnouncementBar() {
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
