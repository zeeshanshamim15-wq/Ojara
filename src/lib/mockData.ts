// Shoppers arrive by *intention* ("I need money luck", "someone's nazar is on me")
// or by *object* ("pyrite bracelet"). Both are modelled so /category/[slug] can
// serve either entry point from the same product list.
export type IntentionSlug = "wealth" | "protection" | "healing" | "vastu";

export type TypeSlug =
  | "raw-clusters"
  | "bracelets"
  | "zibu-coins"
  | "crystal-trees"
  | "vastu-turtles";

export type CategorySlug = IntentionSlug | TypeSlug;

export interface Product {
  id: string;
  name: string;
  // Whole rupees. Rendered via formatPrice() so grouping stays Indian (₹1,29,999).
  price: number;
  // When set, the pre-discount price — rendered struck-through beside `price`.
  // Used by curated bundles to show the saving versus buying pieces separately.
  originalPrice?: number;
  description: string;
  // Headline intention, shown as the card badge and on the PDP.
  intention: string;
  // Scannable outcome promises — the reason to buy, as bullets on the PDP.
  benefits: string[];
  // Intention categories this piece belongs to. A stone can serve more than one.
  intentions: IntentionSlug[];
  // Object category. Absent for pieces that aren't one of the five shop types
  // (the tumbled focus stone, the multi-piece set) — they're found by intention.
  type?: TypeSlug;
  image: string;
  // Units on hand. Small-batch numbers (2–15) power authentic scarcity cues.
  stockCount: number;
  // Marks curated multi-piece sets so the UI can badge them distinctly.
  isBundle?: boolean;
  // The Wix Stores catalog GUID, captured when the product is seeded into Wix
  // (Phase 2). Required for addToCurrentCart / real orders; null until then.
  wixCatalogItemId?: string;
}

export interface Category {
  slug: CategorySlug;
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
    slug: "wealth",
    label: "Wealth & Success",
    title: "Wealth & Success — Money Magnets",
    tagline:
      "Pyrite, jade, and citrine — the classical money magnets, placed in your wealth corner to pull income, opportunity, and steady growth toward you.",
    group: "intention",
    image: "photo-1609216970141-d981d693484a",
  },
  {
    slug: "protection",
    label: "Evil Eye & Protection",
    title: "Evil Eye & Protection — Nazar Suraksha",
    tagline:
      "Shield your home and your aura from nazar dosh, envy, and negative energy with pieces worn for this purpose for centuries.",
    group: "intention",
    image: "photo-1647638162212-51180c35deae",
  },
  {
    slug: "healing",
    label: "Health & Healing",
    title: "Health & Healing",
    tagline:
      "Balance your seven chakras, quiet an anxious mind, and restore the vital energy your body runs on.",
    group: "intention",
    image: "photo-1599858875300-3af12792e682",
  },
  {
    slug: "vastu",
    label: "Vastu & Home Harmony",
    title: "Vastu & Home Harmony",
    tagline:
      "Vastu-compliant objects placed to correct the energy of a room — for a calmer, luckier, more harmonious home.",
    group: "intention",
    image: "photo-1781579327044-da2da04b0a87",
  },
  {
    slug: "raw-clusters",
    label: "Raw Clusters",
    title: "Raw Crystal Clusters",
    tagline:
      "Uncut, unpolished, and at full natural potency — raw clusters radiate the widest field of energy of any form.",
    group: "type",
    image: "photo-1609216970141-d981d693484a",
  },
  {
    slug: "bracelets",
    label: "Bracelets",
    title: "Crystal & Evil Eye Bracelets",
    tagline:
      "Your intention, worn on the wrist — carried with you from morning to night.",
    group: "type",
    image: "photo-1647638162212-51180c35deae",
  },
  {
    slug: "zibu-coins",
    label: "Zibu Coins",
    title: "Zibu Symbol Coins",
    tagline:
      "Angelic Zibu symbols etched into auspicious stone — carried in a purse or locker to open the flow of money.",
    group: "type",
    image: "photo-1607772990885-48f6e4e4be3b",
  },
  {
    slug: "crystal-trees",
    label: "Crystal Trees",
    title: "Crystal Trees",
    tagline:
      "Hand-wired trees strung with healing stones — a living centrepiece that radiates balance through the room.",
    group: "type",
    image: "photo-1599858875300-3af12792e682",
  },
  {
    slug: "vastu-turtles",
    label: "Vastu Turtles",
    title: "Vastu Turtles",
    tagline:
      "The ancient emblem of longevity and stability, placed per Vastu to invite good fortune and grounded growth.",
    group: "type",
    image: "photo-1781579327044-da2da04b0a87",
  },
];

// Unsplash images sized for portrait product cards. IDs verified to resolve (HTTP 200)
// and visually matched to each spiritual/manifestation piece.
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const products: Product[] = [
  {
    id: "raw-pyrite-cluster",
    name: "Raw Pyrite Money Magnet (For Wealth & Success)",
    price: 2499,
    description:
      "A raw cluster of golden pyrite — the fabled 'fool's gold' — kept in your locker, cash box, or the north wealth corner of your home to magnetise prosperity, drive, and abundance.",
    intention: "Attract Wealth",
    benefits: [
      "Attracts new income streams and business opportunity",
      "Traditionally kept in the cash locker to multiply money",
      "Builds confidence and drive at work",
      "Vastu-compliant for the North (wealth) direction",
    ],
    intentions: ["wealth"],
    type: "raw-clusters",
    image: img("photo-1609216970141-d981d693484a"),
    stockCount: 4,
  },
  {
    id: "chakra-crystal-tree",
    name: "7 Chakra Healing Crystal Tree (For Positive Energy)",
    price: 3499,
    description:
      "A hand-wired tree strung with all seven chakra stones, aligning your energy centres and radiating balance and positivity through every room it graces.",
    intention: "Balance Energy",
    benefits: [
      "Balances all seven chakras",
      "Clears negative energy from the home",
      "Invites calm, positivity, and restful sleep",
      "Auspicious Vastu placement for the living room",
    ],
    intentions: ["healing", "vastu"],
    type: "crystal-trees",
    image: img("photo-1599858875300-3af12792e682"),
    stockCount: 7,
  },
  {
    id: "green-jade-zibu-coin",
    name: "Green Jade Zibu Coin (For Money & Luck)",
    price: 1299,
    description:
      "Carved from auspicious green jade and etched with a Zibu abundance symbol, carried in your purse or locker to open the flow of money, luck, and opportunity.",
    intention: "Invite Abundance",
    benefits: [
      "Opens the flow of money and unexpected gains",
      "Carried in the purse or cash locker for daily luck",
      "Zibu angelic symbol for abundance",
      "Pocket-sized — travels with you everywhere",
    ],
    intentions: ["wealth"],
    type: "zibu-coins",
    image: img("photo-1607772990885-48f6e4e4be3b"),
    stockCount: 12,
  },
  {
    id: "evil-eye-bracelet",
    name: "Authentic Evil Eye Protection Bracelet (Nazar Dosh)",
    price: 1499,
    description:
      "Hand-strung around a cobalt evil-eye bead, worn for centuries to remove nazar dosh, deflect envy, and shield your aura from unwanted, negative energy.",
    intention: "Ward Off Negativity",
    benefits: [
      "Removes nazar dosh and buri nazar",
      "Blocks negative energy and the envy of others",
      "Safe for daily wear — unisex, adjustable fit",
      "Traditionally gifted to newborns and newlyweds",
    ],
    intentions: ["protection"],
    type: "bracelets",
    image: img("photo-1647638162212-51180c35deae"),
    stockCount: 3,
  },
  {
    id: "golden-vastu-turtle",
    name: "Golden Vastu Turtle (For Good Luck & Home Harmony)",
    price: 2199,
    description:
      "A golden Vastu turtle — the ancient emblem of longevity and stability — placed in the North or East of your home to invite good fortune, calm, and steady, grounded growth.",
    intention: "Bring Good Fortune",
    benefits: [
      "Vastu correction for the North / East direction",
      "Invites stability, longevity, and family harmony",
      "Attracts steady financial growth",
      "A traditional griha pravesh (housewarming) gift",
    ],
    intentions: ["vastu", "wealth"],
    type: "vastu-turtles",
    image: img("photo-1781579327044-da2da04b0a87"),
    stockCount: 9,
  },
  {
    id: "tigers-eye-focus-stone",
    name: "Tiger's Eye Focus Stone (For Confidence & Clarity)",
    price: 999,
    description:
      "A polished tiger's eye, banded in gold and earth, held in meditation to steady an anxious mind, sharpen focus, and restore quiet courage before the moments that matter.",
    intention: "Sharpen Focus",
    benefits: [
      "Calms anxiety and an overthinking mind",
      "Sharpens focus for exams, interviews, and work",
      "Restores confidence and courage",
      "Shields the wearer from negative intent",
    ],
    intentions: ["healing", "protection"],
    image: img("photo-1780619692657-ab3105d87f7c"),
    stockCount: 2,
  },
  {
    id: "abundance-harmony-set",
    name: "The Abundance Harmony Set (Complete Wealth Ritual)",
    price: 5999,
    originalPrice: 7199,
    description:
      "Our signature wealth ritual, curated as one. The Raw Pyrite Money Magnet, the Green Jade Zibu Coin, and a hand-strung Citrine bracelet work in harmony to magnetise prosperity, open the flow of opportunity, and hold your intention through the day. Priced below the sum of its parts, for maximum abundance.",
    intention: "Attract Wealth",
    benefits: [
      "Three money magnets working as one ritual",
      "Covers your locker, your purse, and your wrist",
      "Saves ₹1,200 versus buying the pieces separately",
      "Arrives energized, cleansed, and ready to place",
    ],
    intentions: ["wealth"],
    image: img("photo-1609216970141-d981d693484a"),
    stockCount: 5,
    isBundle: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

// Intention categories match against `intentions`; type categories against `type`.
export function getProductsByCategory(category: Category): Product[] {
  if (category.group === "type") {
    return products.filter((product) => product.type === category.slug);
  }
  return products.filter((product) =>
    product.intentions.includes(category.slug as IntentionSlug),
  );
}
