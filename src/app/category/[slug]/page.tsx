import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";
import ValueProps from "@/components/ValueProps";

// Prerender a static page for every intention and every product type.
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: `${category.title} | OJARA`,
    description: category.tagline,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category);
  const siblings = categories.filter((c) => c.group === category.group);

  return (
    <div className="bg-ivory">
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
          <li aria-current="page" className="text-midnight-navy">
            {category.label}
          </li>
        </ol>
      </nav>

      {/* Category header */}
      <header className="mx-auto max-w-3xl px-6 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-champagne-gold">
          {category.group === "intention" ? "Shop by Intention" : "Shop by Type"}
        </p>
        <h1 className="mt-5 text-4xl text-midnight-navy sm:text-5xl">
          {category.title}
        </h1>
        <p className="mt-5 text-sm leading-7 text-midnight-navy/70 sm:text-base">
          {category.tagline}
        </p>
      </header>

      {/* Sibling categories — keep the shopper moving laterally */}
      <nav
        aria-label={
          category.group === "intention"
            ? "Other intentions"
            : "Other product types"
        }
        className="mx-auto max-w-6xl px-6 pb-14"
      >
        <ul className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 sm:justify-center">
          {siblings.map((sibling) => {
            const isActive = sibling.slug === category.slug;
            return (
              <li key={sibling.slug} className="snap-start">
                <Link
                  href={`/category/${sibling.slug}`}
                  prefetch
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex whitespace-nowrap rounded-full border px-6 py-3 text-sm tracking-wide transition-all duration-300 ease-out ${
                    isActive
                      ? "border-champagne-gold bg-champagne-gold text-midnight-navy"
                      : "border-champagne-gold/25 bg-sand text-midnight-navy hover:border-champagne-gold hover:bg-champagne-gold/25 hover:shadow-sm"
                  }`}
                >
                  ✦ {sibling.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {categoryProducts.length > 0 ? (
          <>
            <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-midnight-navy/50">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-champagne-gold/25 bg-sand/50 px-6 py-20 text-center">
            <p className="font-heading text-2xl text-midnight-navy">
              New pieces are being cleansed and charged.
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-midnight-navy/70">
              This collection is being prepared. In the meantime, explore the
              full range of sacred objects.
            </p>
            <Link
              href="/#collection"
              prefetch
              className="mt-8 inline-flex rounded-full bg-champagne-gold px-10 py-4 text-xs font-medium uppercase tracking-[0.25em] text-midnight-navy transition-colors duration-300 ease-out hover:bg-champagne-gold/85"
            >
              View the Collection
            </Link>
          </div>
        )}
      </section>

      {/* Reassurance, reused from the home page */}
      <ValueProps />
    </div>
  );
}
