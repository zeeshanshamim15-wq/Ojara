// Shoppers arrive by *intention* ("I need money luck", "shield my aura")
// or by *stone* ("citrine bracelet"). Both are modelled so /category/[slug] can
// serve either entry point from the same product list.
export type IntentionSlug = "protection" | "wealth" | "vitality" | "focus";

export type TypeSlug =
  | "tourmaline"
  | "carnelian"
  | "citrine"
  | "lapis-lazuli";

export type CategorySlug = IntentionSlug | TypeSlug;

export interface Product {
  id: string;
  name: string;
  // Whole rupees. Rendered via formatPrice() so grouping stays Indian (₹1,29,999).
  price: number;
  // When set, the pre-discount price — rendered struck-through beside `price`.
  originalPrice?: number;
  description: string;
  // Headline intention, shown as the card badge and on the PDP.
  intention: string;
  // Scannable outcome promises — the reason to buy, as bullets on the PDP.
  benefits: string[];
  // Intention categories this piece belongs to.
  intentions: IntentionSlug[];
  // Stone type category.
  type?: TypeSlug;
  image: string;
  // Every gallery image, in Wix's ordering (image[0] === `image`, the main one).
  // Populated from Wix media.items in live mode; in mock mode it falls back to
  // the single `image` so the PDP gallery always has at least one entry.
  images?: string[];
  // Units on hand. Small-batch numbers (2–15) power authentic scarcity cues.
  stockCount: number;
  // Marks curated multi-piece sets so the UI can badge them distinctly.
  isBundle?: boolean;
  // The Wix Stores catalog GUID, captured when the product is seeded into Wix.
  wixCatalogItemId?: string;
  // Wix collection GUIDs this product belongs to. Populated only in live mode
  // (catalog.ts), and used to resolve /category/[slug] against Wix collections.
  // Was previously bolted on behind a @ts-ignore, which hid the fact that it
  // wasn't on the type at all.
  collectionIds?: string[];
}

export interface Category {
  // In mock mode this is a CategorySlug ("protection", "citrine", ...). In live
  // mode it's whatever slug Wix's collection carries ("protection-evil-eye",
  // "wealth-success", "all-products"), which is a DIFFERENT set — so this can't
  // be narrowed to CategorySlug without lying about live data.
  slug: CategorySlug | string;
  // Menu label — short, for the Shop dropdown.
  label: string;
  // Page heading — the fuller, search-intent-matching phrasing.
  title: string;
  tagline: string;
  group: "intention" | "type";
  // Representative product image for the category strip on the home page.
  image?: string;
}

// Drives both the Shop mega menu and the /category/[slug] routes.
export const categories: Category[] = [
  {
    slug: "protection",
    label: "Protection & Evil Eye",
    title: "Protection & Evil Eye — Shield Your Aura",
    tagline:
      "Shield yourself from nazar dosh, envy, and negative energy with authentic protective stones combined with therapeutic bio-magnetic beads.",
    group: "intention",
    image: "/images/category-protection.jpg",
  },
  {
    slug: "wealth",
    label: "Wealth & Success",
    title: "Wealth & Success — Money Magnets",
    tagline:
      "Citrine combined with bio-magnetic fields to align your frequencies, pull opportunities, and attract financial success.",
    group: "intention",
    image: "/images/category-wealth.jpg",
  },
  {
    slug: "vitality",
    label: "Energy & Vitality",
    title: "Energy & Vitality — Power & Stamina",
    tagline:
      "Ignite your inner fire, boost physical stamina, and clear fatigue with Carnelian energy and circulation-boosting magnetic therapy.",
    group: "intention",
    image: "/images/category-vitality.jpg",
  },
  {
    slug: "focus",
    label: "Calm & Focus",
    title: "Calm & Focus — Mind Clarity",
    tagline:
      "Soothe anxiety, quiet mental chatter, and sharpen your intellect with Lapis Lazuli and harmonizing magnetic frequency therapy.",
    group: "intention",
    image: "/images/category-focus.jpg",
  },
  // Stones
  {
    slug: "tourmaline",
    label: "Black Tourmaline",
    title: "Black Tourmaline Magnetic Bracelets",
    tagline:
      "The ultimate grounding and protective shield, absorbing negative frequencies and shielding from buri nazar.",
    group: "type",
    image: "/images/category-protection.jpg",
  },
  {
    slug: "carnelian",
    label: "Carnelian",
    title: "Carnelian Magnetic Bracelets",
    tagline:
      "Bold energy for creative fire, courage, and vitality, amplified by healing magnetic elements.",
    group: "type",
    image: "/images/category-vitality.jpg",
  },
  {
    slug: "citrine",
    label: "Citrine",
    title: "Citrine Magnetic Bracelets",
    tagline:
      "The merchant stone of pure wealth, abundance, and joy, designed to magnetise professional growth.",
    group: "type",
    image: "/images/category-wealth.jpg",
  },
  {
    slug: "lapis-lazuli",
    label: "Lapis Lazuli",
    title: "Lapis Lazuli Magnetic Bracelets",
    tagline:
      "The deep blue stone of truth, wisdom, and intellectual focus, steadying an overactive mind.",
    group: "type",
    image: "/images/category-focus.jpg",
  },
];

export const products: Product[] = [
  {
    id: "black-tourmaline-evil-eye",
    name: "Black Tourmaline Evil Eye Bracelet",
    price: 1899,
    description:
      "Authentic Black Tourmaline beads paired with high-gauss bio-magnetic elements to repel negative energy and shield your aura from nazar dosh.",
    intention: "Ward Off Negativity",
    benefits: [
      "Removes nazar dosh and buri nazar",
      "Shields your aura from external negative energies",
      "Magnetic therapy supports deep cellular detoxification",
    ],
    intentions: ["protection"],
    type: "tourmaline",
    image: "https://static.wixstatic.com/media/f059b5_59c041cbd5954992bdddcde5f2faf0ab~mv2.png",
    stockCount: 5,
    wixCatalogItemId: "eac41b3f-0e3f-4c7b-a5a3-a9bbf3f8bb2c",
  },
  {
    id: "citrine-bracelet",
    name: "Citrine Bracelet",
    price: 1999,
    description:
      "Vibrant Citrine stones aligned with bio-magnetic fields to activate your solar plexus chakra, magnetising wealth, abundance, and luck.",
    intention: "Attract Wealth",
    benefits: [
      "Attracts business growth and professional success",
      "Amplifies manifesting frequencies to attract money",
      "Bio-magnetic therapy balances vital life energy",
    ],
    intentions: ["wealth"],
    type: "citrine",
    image: "https://static.wixstatic.com/media/f059b5_26dcab2dfc554c99913cda28b3ba1a9a~mv2.png",
    stockCount: 12,
    wixCatalogItemId: "91750104-9bb9-4fbc-8cc9-24f99cb34dde",
  },
  {
    id: "carnelian-bracelet",
    name: "Carnelian Bracelet",
    price: 1799,
    description:
      "Vibrant Carnelian beads working in synergy with bio-magnetic fields that stimulate local blood circulation, igniting energy, passion, and vitality.",
    intention: "Energy & Vitality",
    benefits: [
      "Ignites inner fire, motivation, and creativity",
      "Magnetic therapy stimulates circulation & oxygen flow",
      "Clears physical fatigue and sluggish energy",
    ],
    intentions: ["vitality"],
    type: "carnelian",
    image: "https://static.wixstatic.com/media/f059b5_10d78768f66d4c50a9d630ce50dfa4f4~mv2.png",
    stockCount: 7,
    wixCatalogItemId: "3ca369d0-5813-48d0-b7ac-423bb673238b",
  },
  {
    id: "lapis-lazuli-bracelet",
    name: "Lapis Lazuli Bracelet",
    price: 1899,
    description:
      "Deep blue Lapis Lazuli beads combine with circulation-boosting magnetic therapy to balance cognitive energy, quiet anxiety, and enhance deep concentration.",
    intention: "Calm & Focus",
    benefits: [
      "Quiets mind chatter, overthinking, and anxiety",
      "Enhances focus, wisdom, and intellectual performance",
      "Magnetic field supports deeper sleep and stress relief",
    ],
    intentions: ["focus"],
    type: "lapis-lazuli",
    image: "https://static.wixstatic.com/media/f059b5_985f7bc64682498ca1ffc548a0fd14c6~mv2.png",
    stockCount: 6,
    wixCatalogItemId: "5177db65-d3a1-46c5-b614-57b1969b9b1a",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

// Intention categories match against `intentions`; stone categories against `type`.
export function getProductsByCategory(category: Category): Product[] {
  if (category.group === "type") {
    return products.filter((product) => product.type === category.slug);
  }
  return products.filter((product) =>
    product.intentions.includes(category.slug as IntentionSlug),
  );
}
