import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, products } from "@/lib/mockData";
import AddToCartButton from "@/components/AddToCartButton";
import StickyAddToBag from "@/components/StickyAddToBag";
import CompleteYourRitual from "@/components/CompleteYourRitual";
import RitualAccordion from "@/components/RitualAccordion";
import ProductFaq from "@/components/ProductFaq";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";
import ProductGallery from "@/components/ProductGallery";
import RecentlyViewed from "@/components/RecentlyViewed";
import TrackRecentlyViewed from "@/components/TrackRecentlyViewed";

// Minimalist risk-reversal cues shown beneath the primary CTA.
const trustBadges = [
  {
    label: "Authenticity Guaranteed",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3l7 3v5c0 4.4-3 8.2-7 9.5C8 19.2 5 15.4 5 11V6l7-3Z" />
        <path d="m9 11.5 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "30-Day Easy Returns",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 1 3 6.7" />
        <path d="M3 21v-4h4" />
      </svg>
    ),
  },
  {
    label: "Secure Checkout",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
];

// Prerender a static page for each mock product.
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-ivory">
      {/* Record this visit in the persisted browsing history */}
      <TrackRecentlyViewed productId={product.id} />

      {/* Breadcrumb trail */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-6 py-8 sm:py-10"
      >
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-midnight-navy/50">
          <li>
            <Link
              href="/"
              prefetch
              className="transition-colors duration-300 ease-out hover:text-midnight-navy"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-champagne-gold">
            /
          </li>
          <li>
            <Link
              href="/#collection"
              prefetch
              className="transition-colors duration-300 ease-out hover:text-midnight-navy"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true" className="text-champagne-gold">
            /
          </li>
          <li className="text-midnight-navy/70">{product.intention}</li>
          <li aria-hidden="true" className="text-champagne-gold">
            /
          </li>
          <li aria-current="page" className="text-midnight-navy">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Split-screen: image left, details right */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-16">
        <ProductGallery image={product.image} alt={product.name} />

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.35em] text-champagne-gold">
              Manifestation &amp; Energy
            </span>
            {product.isBundle && (
              <span className="rounded-full bg-champagne-gold px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-midnight-navy">
                ✦ Curated Harmony Set
              </span>
            )}
          </div>

          {/* Authentic, spiritual scarcity — only when genuinely low on hand */}
          {product.stockCount < 5 && (
            <p className="mt-4 text-sm tracking-wide text-champagne-gold">
              ✦ Only {product.stockCount} pieces remaining — Energy-cleansed and
              ready for your intention.
            </p>
          )}

          <h1 className="mt-4 text-4xl text-midnight-navy sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <p className="text-2xl text-midnight-navy">${product.price}</p>
            {product.originalPrice && (
              <>
                <p className="text-lg text-midnight-navy/40 line-through">
                  ${product.originalPrice}
                </p>
                <span className="rounded-full bg-champagne-gold/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-champagne-gold">
                  Save ${product.originalPrice - product.price}
                </span>
              </>
            )}
          </div>

          {/* Intention — reinforces the brand story */}
          <div className="mt-8 rounded-2xl border border-champagne-gold/30 bg-sand/50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-champagne-gold">
              The Intention
            </p>
            <p className="mt-2 font-heading text-3xl text-midnight-navy">
              {product.intention}
            </p>
            <p className="mt-3 text-sm leading-6 text-midnight-navy/70">
              Charged with purpose and kept close — a daily reminder to{" "}
              {product.intention.toLowerCase()}, every day.
            </p>
          </div>

          {/* Ritual accordions — energy, ritual, promise */}
          <RitualAccordion product={product} />

          <div id="main-add-to-bag" className="mt-10">
            <AddToCartButton
              product={product}
              className="w-full rounded-full bg-champagne-gold px-8 py-5 text-sm font-medium uppercase tracking-[0.25em] text-midnight-navy transition-colors hover:bg-champagne-gold/85 sm:w-auto sm:px-14"
            />
          </div>

          {/* Risk reversal — minimalist trust badges */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-midnight-navy/70">
            {trustBadges.map((badge) => (
              <li
                key={badge.label}
                className="inline-flex items-center gap-2 text-xs tracking-wide sm:text-sm"
              >
                <span className="text-champagne-gold">{badge.icon}</span>
                <span>✦ {badge.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Item-specific FAQ — answers the last objections before checkout */}
      <ProductFaq product={product} />

      {/* Cross-sell rail to keep the shopper browsing */}
      <CompleteYourRitual currentId={product.id} />

      {/* Wider cross-sell at the very bottom of the page */}
      <YouMayAlsoLike currentId={product.id} />

      {/* Personalised history — reads from persisted browsing state */}
      <RecentlyViewed currentId={product.id} />

      {/* Scroll-triggered sticky checkout nudge */}
      <StickyAddToBag product={product} />
    </div>
  );
}
