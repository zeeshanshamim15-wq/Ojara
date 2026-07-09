export interface Product {
  id: string;
  name: string;
  price: number;
  // When set, the pre-discount price — rendered struck-through beside `price`.
  // Used by curated bundles to show the saving versus buying pieces separately.
  originalPrice?: number;
  description: string;
  intention: string;
  image: string;
  // Units on hand. Small-batch numbers (2–15) power authentic scarcity cues.
  stockCount: number;
  // Marks curated multi-piece sets so the UI can badge them distinctly.
  isBundle?: boolean;
}

// Unsplash images sized for portrait product cards. IDs verified to resolve (HTTP 200)
// and visually matched to each spiritual/manifestation piece.
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const products: Product[] = [
  {
    id: "raw-pyrite-cluster",
    name: "Raw Pyrite Cluster",
    price: 68,
    description:
      "A raw cluster of golden pyrite — the fabled 'fool's gold' — placed in your wealth corner to magnetise prosperity, drive, and abundance.",
    intention: "Attract Wealth",
    image: img("photo-1609216970141-d981d693484a"),
    stockCount: 4,
  },
  {
    id: "chakra-crystal-tree",
    name: "7 Chakra Healing Crystal Tree",
    price: 94,
    description:
      "A hand-wired tree strung with all seven chakra stones, aligning your energy centres and radiating balance through every room it graces.",
    intention: "Balance Energy",
    image: img("photo-1599858875300-3af12792e682"),
    stockCount: 7,
  },
  {
    id: "green-jade-zibu-coin",
    name: "Green Jade Zibu Coin",
    price: 42,
    description:
      "Carved from auspicious green jade and etched with a Zibu abundance symbol, carried to open the flow of money, luck, and opportunity.",
    intention: "Invite Abundance",
    image: img("photo-1607772990885-48f6e4e4be3b"),
    stockCount: 12,
  },
  {
    id: "evil-eye-bracelet",
    name: "Authentic Evil Eye Protection Bracelet",
    price: 58,
    description:
      "Hand-strung around a cobalt evil-eye bead, worn for centuries to deflect envy and shield your aura from unwanted, negative energy.",
    intention: "Ward Off Negativity",
    image: img("photo-1647638162212-51180c35deae"),
    stockCount: 3,
  },
  {
    id: "golden-vastu-turtle",
    name: "Golden Vastu Turtle for Luck",
    price: 76,
    description:
      "A golden Vastu turtle — the ancient emblem of longevity and stability — placed to invite good fortune, calm, and steady, grounded growth.",
    intention: "Bring Good Fortune",
    image: img("photo-1781579327044-da2da04b0a87"),
    stockCount: 9,
  },
  {
    id: "tigers-eye-focus-stone",
    name: "Tiger's Eye Focus Stone",
    price: 38,
    description:
      "A polished tiger's eye, banded in gold and earth, held in meditation to steady the mind, sharpen focus, and restore quiet courage.",
    intention: "Sharpen Focus",
    image: img("photo-1780619692657-ab3105d87f7c"),
    stockCount: 2,
  },
  {
    id: "abundance-harmony-set",
    name: "The Abundance Harmony Set",
    price: 380,
    originalPrice: 450,
    description:
      "Our signature wealth ritual, curated as one. The Raw Pyrite Cluster, the Green Jade Zibu Coin, and a hand-strung Citrine bracelet work in harmony to magnetise prosperity, open the flow of opportunity, and hold your intention through the day. Priced below the sum of its parts, for maximum abundance.",
    intention: "Attract Wealth",
    image: img("photo-1609216970141-d981d693484a"),
    stockCount: 5,
    isBundle: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
