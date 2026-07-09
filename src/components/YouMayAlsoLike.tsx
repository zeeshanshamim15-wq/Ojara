import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/mockData";

/**
 * Bottom-of-page cross-sell. Rotates the catalogue so it starts just after the
 * current product, surfacing a different, wider spread of pieces than the
 * "Complete Your Ritual" rail higher up the page.
 */
export default function YouMayAlsoLike({ currentId }: { currentId: string }) {
  const currentIndex = products.findIndex((p) => p.id === currentId);
  const start = currentIndex === -1 ? 0 : currentIndex;

  const suggestions = Array.from({ length: products.length }, (_, i) => {
    return products[(start + i + 1) % products.length];
  })
    .filter((product) => product.id !== currentId)
    .slice(0, 4);

  return (
    <section className="border-t border-champagne-gold/20 bg-ivory px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-14">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Keep Exploring
          </span>
          <h2 className="mt-4 font-heading text-3xl text-midnight-navy sm:text-4xl">
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              prefetch
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand shadow-sm transition-all duration-500 ease-out group-hover:shadow-xl group-hover:shadow-champagne-gold/20">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-champagne-gold">
                  {product.intention}
                </p>
                <h3 className="mt-2 text-sm text-midnight-navy sm:text-base">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-midnight-navy/70">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
