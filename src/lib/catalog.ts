// ============================================================================
// Catalog access seam — the ONE place the backend catalog swaps in.
//
// Today it re-exports the local `mockData` catalog. When Wix is live (Phase 2),
// swap the bodies of these functions to query Wix Stores (collections/products)
// and map the results to the `Product` / `Category` shapes — nothing else in the
// app needs to change if data flows through here.
//
// NOTE: the 22 existing components still import from `@/lib/mockData` directly.
// Migrating them to import from here is a mechanical Phase-2 step (done when we
// actually switch to Wix, since those files change then anyway). Kept as a
// deliberate no-op-for-now seam so mock mode stays byte-for-byte the working
// storefront. See the plan file + OJARA-HANDOVER §6.
// ============================================================================

import {
  products,
  categories,
  getProductById as _getProductById,
  getCategoryBySlug as _getCategoryBySlug,
  getProductsByCategory as _getProductsByCategory,
  type Product,
  type Category,
} from "@/lib/mockData";

export type { Product, Category };

export const getAllProducts = (): Product[] => products;
export const getCategories = (): Category[] => categories;
export const getProductById = (id: string): Product | undefined =>
  _getProductById(id);
export const getCategoryBySlug = (slug: string): Category | undefined =>
  _getCategoryBySlug(slug);
export const getProductsByCategory = (category: Category): Product[] =>
  _getProductsByCategory(category);
