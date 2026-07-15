import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/mockData";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

// Shared by the home collection grid and every /category/[slug] page, so a
// product looks and behaves the same wherever a shopper meets it.
export default function ProductCard({
  product,
  sizes = "(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: {
  product: Product;
  sizes?: string;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-sand shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-champagne-gold/20">
      <Link
        href={`/product/${product.id}`}
        prefetch
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-square overflow-hidden sm:aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Intention badge — front and center to the brand story */}
          <span className="absolute left-2 top-2 rounded-full bg-midnight-navy/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-champagne-gold backdrop-blur-sm sm:left-4 sm:top-4 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em]">
            {product.intention}
          </span>
          {product.isBundle && (
            <span className="absolute right-2 top-2 rounded-full bg-champagne-gold px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-midnight-navy shadow-sm sm:right-4 sm:top-4 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em]">
              Set
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3 pb-0 sm:p-6 sm:pb-0">
          <h3 className="line-clamp-2 text-sm leading-snug text-midnight-navy sm:text-xl sm:leading-normal">
            {product.name}
          </h3>
        </div>
      </Link>

      <div className="p-3 pt-2 sm:p-6 sm:pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-baseline gap-1.5 text-sm text-midnight-navy sm:gap-2 sm:text-lg">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <span className="text-[0.65rem] text-midnight-navy/60 line-through sm:text-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </span>
          <AddToCartButton
            product={product}
            className="w-full rounded-full border border-midnight-navy px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.15em] text-midnight-navy transition-colors hover:bg-midnight-navy hover:text-champagne-gold sm:w-auto sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.2em]"
          />
        </div>
      </div>
    </article>
  );
}
