import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/mockData";

/**
 * Cross-sell rail shown at the foot of a product page. Surfaces three other
 * pieces to keep the shopper browsing after they've considered the main item.
 */
export default function CompleteYourRitual({
  currentId,
}: {
  currentId: string;
}) {
  const suggestions = products
    .filter((product) => product.id !== currentId)
    .slice(0, 3);

  return (
    <section className="border-t border-champagne-gold/20 bg-sand px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Pair It With
          </span>
          <h2 className="mt-4 text-3xl uppercase tracking-[0.15em] text-midnight-navy sm:text-4xl">
            Complete Your Ritual
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              prefetch
              className="group flex flex-col overflow-hidden rounded-2xl bg-ivory shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-champagne-gold/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-midnight-navy/90 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-champagne-gold backdrop-blur-sm">
                  {product.intention}
                </span>
              </div>

              <div className="flex items-center justify-between p-6">
                <h3 className="text-base text-midnight-navy sm:text-lg">
                  {product.name}
                </h3>
                <span className="text-base text-midnight-navy sm:text-lg">
                  ${product.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
