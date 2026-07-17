import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getAllProducts } from "@/lib/catalog";

export default async function GiftingSection() {
  const products = await getAllProducts();
  const giftSets = products.slice(0, 2).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    tagline: p.description.slice(0, 100) + (p.description.length > 100 ? "..." : ""),
    image: p.image,
    benefits: p.benefits,
  }));

  return (
    <section className="border-y border-champagne-gold/30 bg-midnight-navy text-ivory px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Curated Gifting
          </span>
          <h2 className="mt-5 font-heading text-3xl uppercase tracking-[0.15em] text-champagne-gold sm:text-4xl">
            Give the Gift of Energy
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ivory/70">
            Thoughtfully packaged, energized before dispatch, and complete with a handwritten intention card.
          </p>
        </div>

        {/* Gift sets — both cards side by side on mobile too (owner call
            2026-07-17), so they're compacted: the description and benefit bullets
            are hidden on phones, leaving image → name → price → button. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-10 lg:gap-14">
          {giftSets.map((gift) => (
            <div
              key={gift.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-champagne-gold/25 bg-midnight-navy/50 p-3 sm:p-8"
            >
              {/* Image box */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-sand/10 sm:aspect-[16/10]">
                <Image
                  src={gift.image}
                  alt={gift.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 500px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-full bg-champagne-gold px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.1em] text-midnight-navy font-semibold sm:left-4 sm:top-4 sm:px-3.5 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.15em]">
                  ✦ Gift Box
                </span>
              </div>

              {/* Title & price info */}
              <div className="mt-3 flex-1 sm:mt-8">
                <h3 className="font-heading text-base leading-snug text-champagne-gold sm:text-2xl">
                  {gift.name}
                </h3>
                {/* Description + benefits: desktop only — too much for a half-width
                    phone card. */}
                <p className="mt-3 hidden text-sm leading-relaxed text-ivory/70 sm:block">
                  {gift.tagline}
                </p>
                <ul className="mt-6 hidden space-y-2 sm:block">
                  {gift.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-xs text-ivory/80">
                      <span className="text-champagne-gold">✦</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex flex-col gap-3 border-t border-champagne-gold/15 pt-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                <span className="flex items-baseline gap-2">
                  <span className="text-base text-champagne-gold font-semibold sm:text-lg">
                    {formatPrice(gift.price)}
                  </span>
                  {gift.originalPrice && (
                    <span className="text-xs text-ivory/40 line-through">
                      {formatPrice(gift.originalPrice)}
                    </span>
                  )}
                </span>

                <Link
                  href={`/product/${gift.id}`}
                  prefetch
                  className="cursor-pointer whitespace-nowrap rounded-full bg-champagne-gold px-4 py-2.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.15em] text-midnight-navy shadow-sm transition-all duration-150 hover:bg-champagne-gold/85 active:scale-95 sm:px-6 sm:text-xs sm:tracking-[0.2em]"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
