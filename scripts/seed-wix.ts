// ============================================================================
// Phase 2 — seed the OJARA catalog into Wix Stores (Catalog V3).
//
// Run:
//   node --experimental-strip-types scripts/seed-wix.ts --dry-run   (prints, writes nothing)
//   node --experimental-strip-types scripts/seed-wix.ts --execute   (creates products in Wix)
//
// WHY V3: this site reports CATALOG_V3. The V1 endpoints (/stores/v1/*) reject
// writes with 428 CATALOG_V3_CALLING_CATALOG_V1_API. Note /stores-reader/v1 still
// *reads* (a compat shim serving 12 stale template demos that do NOT exist in V3)
// — do not trust it as the source of truth. V3 is authoritative and starts empty.
//
// This script is standalone Node — it deliberately imports nothing from Next.js.
// ============================================================================

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore
import { products } from "../src/lib/mockData.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

// --- env ---------------------------------------------------------------
// Minimal .env.local reader: we only need three keys and don't want a dep.
// Ignores comments/blank lines, trims whitespace (dotenv semantics).
function readEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    out[m[1]] = m[2].trim();
  }
  return out;
}

const env = readEnv();
const KEY = env.WIX_API_KEY;
const SITE = env.WIX_SITE_ID;
const ACCT = env.WIX_ACCOUNT_ID;

if (!KEY || !SITE || !ACCT) {
  console.error("Missing WIX_API_KEY / WIX_SITE_ID / WIX_ACCOUNT_ID in .env.local");
  process.exit(1);
}

const MODE = process.argv.includes("--execute") ? "execute" : "dry-run";

// --- mapping -----------------------------------------------------------
// mockData.Product -> Wix Catalog V3 CreateProductWithInventory payload.
//
// Field notes:
//   price      INR integer -> V3 wants a decimal *string* (actualPrice.amount).
//   stockCount -> inventory quantity, with trackQuantity so scarcity cues stay real.
//   image      Unsplash CDN URL. Wix media wants its own Media Manager IDs, so
//              images are NOT seeded here — see the caveat printed at the end.
//   benefits   -> joined into the description; V3 has no first-class list field.
function toWixPayload(p: (typeof products)[number]) {
  const benefitsHtml = p.benefits.map((b) => `<li>${b}</li>`).join("");
  return {
    product: {
      name: p.name,
      slug: p.id, // keep the mockData id as the Wix slug: stable join key
      productType: "PHYSICAL",
      physicalProperties: {},
      description: `<p>${p.description}</p><ul>${benefitsHtml}</ul>`,
      visible: true,
      variantsInfo: {
        variants: [
          {
            price: { actualPrice: { amount: String(p.price) } },
          },
        ],
      },
    },
    // Inventory is per-variant; quantity mirrors mockData.stockCount.
    inventory: {
      trackQuantity: true,
      quantity: p.stockCount,
    },
  };
}

// --- dry-run table -----------------------------------------------------
function pad(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n);
}

console.log(`\nMODE: ${MODE.toUpperCase()}   target site: ${SITE}\n`);
console.log(
  pad("mockData.id", 24) + pad("name", 44) + pad("price", 9) + pad("stock", 6) + "intentions",
);
console.log("-".repeat(100));
for (const p of products) {
  console.log(
    pad(p.id, 24) +
      pad(p.name, 44) +
      pad("₹" + p.price.toLocaleString("en-IN"), 9) +
      pad(String(p.stockCount), 6) +
      p.intentions.join(", "),
  );
}
console.log("-".repeat(100));
console.log(`${products.length} products\n`);

console.log("Example payload (product #1), exactly as it will be POSTed:");
console.log(JSON.stringify(toWixPayload(products[0]), null, 2));

if (MODE === "dry-run") {
  console.log("\nDRY RUN — nothing was written to Wix. Re-run with --execute to create.\n");
  process.exit(0);
}

// --- execute -----------------------------------------------------------
const headers = {
  Authorization: KEY,
  "wix-account-id": ACCT,
  "wix-site-id": SITE,
  "Content-Type": "application/json",
};

const results: { mockId: string; productId: string; variantId: string }[] = [];

for (const p of products) {
  const res = await fetch("https://www.wixapis.com/stores/v3/products-with-inventory", {
    method: "POST",
    headers,
    body: JSON.stringify(toWixPayload(p)),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error(`FAIL ${p.id}: HTTP ${res.status}`, JSON.stringify(body).slice(0, 300));
    console.error("Stopping. Products created so far are listed above; re-running will duplicate them.");
    process.exit(1);
  }
  const prod = body.product ?? body.productWithInventory?.product ?? body;
  const variantId = prod?.variantsInfo?.variants?.[0]?.id ?? "";
  results.push({ mockId: p.id, productId: prod.id, variantId });
  console.log(`  ok  ${pad(p.id, 24)} -> product ${prod.id}  variant ${variantId}`);
}

console.log("\nSEEDED:");
console.log(JSON.stringify(results, null, 2));
console.log(
  "\nNext: write these ids into mockData.ts as wixCatalogItemId, then uncomment " +
    "NEXT_PUBLIC_WIX_CLIENT_ID in .env.local.\n",
);
