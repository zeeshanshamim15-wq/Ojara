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

const headers = {
  Authorization: KEY!,
  "wix-account-id": ACCT!,
  "wix-site-id": SITE!,
  "Content-Type": "application/json",
};

async function testEndpoint(url: string, method = "POST", body: any = null) {
  try {
    console.log(`Testing ${method} ${url}...`);
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    console.log(`Response status: ${res.status}`);
    if (res.ok) {
      console.log(`Success! Found ${data.collections?.length || data.items?.length || 0} items.`);
      if (data.collections && data.collections.length > 0) {
        console.log("Raw collection sample:", JSON.stringify(data.collections[0], null, 2));
      }
    } else {
      console.log(`Error:`, JSON.stringify(data).slice(0, 300));
    }
  } catch (e: any) {
    console.log(`Exception:`, e.message);
  }
  console.log("-".repeat(50));
}

async function run() {
  await testEndpoint("https://www.wixapis.com/stores/v2/collections/query", "POST", { query: {} });
  await testEndpoint("https://www.wixapis.com/catalog/v1/collections/query", "POST", { query: {} });
  await testEndpoint("https://www.wixapis.com/catalog/v3/collections/query", "POST", { query: {} });
  await testEndpoint("https://www.wixapis.com/ecom/v1/collections/query", "POST", { query: {} });
  await testEndpoint("https://www.wixapis.com/stores-reader/v1/collections/query", "POST", { query: {} });
}

run().catch(console.error);
