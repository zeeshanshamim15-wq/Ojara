import { products } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

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

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
