import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/mockData";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductGrid() {
  return (
    <section
      id="collection"
      className="scroll-mt-24 border-y border-champagne-gold/20 bg-ivory px-6 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl text-midnight-navy sm:text-4xl">
            The Collection
          </h2>
          <p className="mx-auto mt-4 max-w-md text-warm-grey">
            Sacred objects and curated sets, each cleansed and charged with
            intention.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-sand shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-champagne-gold/20"
            >
              <Link
                href={`/product/${product.id}`}
                prefetch
                className="flex flex-1 flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Intention badge — front and center to the brand story */}
                  <span className="absolute left-4 top-4 rounded-full bg-midnight-navy/90 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-champagne-gold backdrop-blur-sm">
                    {product.intention}
                  </span>
                  {product.isBundle && (
                    <span className="absolute right-4 top-4 rounded-full bg-champagne-gold px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-midnight-navy shadow-sm">
                      Harmony Set
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 pb-0">
                  <h3 className="text-xl text-midnight-navy">{product.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-midnight-navy/70">
                    {product.description}
                  </p>
                </div>
              </Link>

              <div className="p-6 pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-baseline gap-2 text-lg text-midnight-navy">
                    ${product.price}
                    {product.originalPrice && (
                      <span className="text-sm text-midnight-navy/40 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </span>
                  <AddToCartButton
                    product={product}
                    className="rounded-full border border-midnight-navy px-5 py-2 text-xs uppercase tracking-[0.2em] text-midnight-navy transition-colors hover:bg-midnight-navy hover:text-champagne-gold"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
