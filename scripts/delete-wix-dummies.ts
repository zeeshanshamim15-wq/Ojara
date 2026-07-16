import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

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

const headers = {
  Authorization: KEY,
  "wix-account-id": ACCT,
  "wix-site-id": SITE,
  "Content-Type": "application/json",
};

async function run() {
  console.log("Querying all products to check for dummy template items...");
  const res = await fetch("https://www.wixapis.com/stores/v3/products/query", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: {
        paging: { limit: 100 }
      }
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    console.error("Failed to query products:", JSON.stringify(body));
    process.exit(1);
  }

  const products = body.products || [];
  const dummyProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes("i'm a product") ||
    p.name.toLowerCase().includes("dummy") ||
    p.name.toLowerCase().includes("test")
  );

  if (dummyProducts.length === 0) {
    console.log("No default Wix 'I'm a product' templates or dummy items found in the store.");
    return;
  }

  console.log(`Found ${dummyProducts.length} dummy/template products to delete:`);
  for (const p of dummyProducts) {
    console.log(`Deleting: [${p.id}] "${p.name}"`);
    const delRes = await fetch(`https://www.wixapis.com/stores/v3/products/${p.id}`, {
      method: "DELETE",
      headers,
    });
    if (delRes.ok) {
      console.log(`  Successfully deleted [${p.id}]`);
    } else {
      const delBody = await delRes.json().catch(() => ({}));
      console.error(`  Failed to delete [${p.id}]:`, JSON.stringify(delBody));
    }
  }
}

run().catch(console.error);
