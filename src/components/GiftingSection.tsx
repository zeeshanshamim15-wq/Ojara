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

        {/* Gift sets grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {giftSets.map((gift) => (
            <div
              key={gift.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-champagne-gold/25 bg-midnight-navy/50 p-6 sm:p-8"
            >
              {/* Image box */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-sand/10">
                <Image
                  src={gift.image}
                  alt={gift.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-champagne-gold px-3.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-midnight-navy font-semibold">
                  ✦ Curated Gift Box
                </span>
              </div>

              {/* Title & price info */}
              <div className="mt-8 flex-1">
                <h3 className="font-heading text-xl text-champagne-gold sm:text-2xl">
                  {gift.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {gift.tagline}
                </p>

                {/* Benefits bullets list */}
                <ul className="mt-6 space-y-2">
                  {gift.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-xs text-ivory/80">
                      <span className="text-champagne-gold">✦</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-champagne-gold/15 pt-6 flex items-center justify-between">
                <div>
                  <span className="flex items-baseline gap-2">
                    <span className="text-lg text-champagne-gold font-medium">
                      {formatPrice(gift.price)}
                    </span>
                    {gift.originalPrice && (
                      <span className="text-xs text-ivory/40 line-through">
                        {formatPrice(gift.originalPrice)}
                      </span>
                    )}
                  </span>
                </div>

                <Link
                  href={`/product/${gift.id}`}
                  prefetch
                  className="cursor-pointer rounded-full bg-champagne-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-midnight-navy transition-all duration-150 hover:bg-champagne-gold/85 active:scale-95"
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
