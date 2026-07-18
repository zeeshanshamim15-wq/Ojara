import { SITE_URL, BRAND_NAME } from "@/lib/commerce/config";
import type { Product } from "@/lib/mockData";

// Central SEO constants + JSON-LD builders. SITE_URL already resolves to the live
// domain (https://www.ojara.co.in) in production — see commerce/config.ts.
export { SITE_URL };

export const SITE_NAME = BRAND_NAME; // "OJARA"

export const SITE_DESCRIPTION =
  "OJARA makes bracelets of natural gemstones — Black Tourmaline and evil eye for protection, Citrine for abundance, Carnelian for courage, Lapis Lazuli for clarity. Each piece is cleansed and charged before it reaches you.";

/** Absolute URL helper — joins a path onto SITE_URL with no double slashes. */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Default social share image (falls back to the brand mark). */
export const DEFAULT_OG_IMAGE = absoluteUrl("/logo.png");

// Ensure a product image is an absolute URL (Wix images already are; local
// /images/* paths need the origin prepended for Open Graph + JSON-LD).
const toAbsolute = (url: string) =>
  url.startsWith("http") ? url : absoluteUrl(url);

/** Organization schema for the root layout. */
export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/logo.png"),
  description: SITE_DESCRIPTION,
  sameAs: ["https://www.instagram.com/ojara.india"],
});

/** WebSite schema (enables the sitelinks search box in Google). */
export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
});

/** Product schema for a product detail page. */
export const productSchema = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: (product.images?.length ? product.images : [product.image]).map(toAbsolute),
  brand: { "@type": "Brand", name: SITE_NAME },
  offers: {
    "@type": "Offer",
    url: absoluteUrl(`/product/${product.id}`),
    priceCurrency: "INR",
    price: String(product.price),
    availability:
      product.stockCount > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: SITE_NAME },
  },
});
