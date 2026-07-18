import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Canonical production host. Keep in sync with PRODUCTION_SITE_URL in
// src/lib/commerce/config.ts.
const CANONICAL_HOST = "www.ojara.co.in";

// Force the production *.vercel.app URL (e.g. ojara-rho.vercel.app) to the real
// domain, so visitors and search engines only ever land on ojara.co.in.
//
// Deliberately narrow to avoid breaking anything:
//   • only when VERCEL_ENV === "production" — preview/branch deploys (which also
//     use *.vercel.app) keep working untouched,
//   • only for *.vercel.app hosts — requests already on the custom domain fall
//     straight through, so there's no redirect loop.
export function middleware(req: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") return NextResponse.next();

  const host = req.headers.get("host") || "";
  if (!host.endsWith(".vercel.app")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Run on everything except Next internals and static asset requests.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
