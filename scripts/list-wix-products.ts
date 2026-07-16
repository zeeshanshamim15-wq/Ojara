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
  console.log("Querying Wix Catalog V3 products...");
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
  console.log(`Found ${products.length} products:`);
  for (const p of products) {
    console.log(`- [${p.id}] name: "${p.name}" slug: "${p.slug}" visible: ${p.visible}`);
  }
}

run().catch(console.error);
