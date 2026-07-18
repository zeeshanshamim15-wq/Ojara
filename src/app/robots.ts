import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

// robots.txt. Search engines and AI crawlers are welcome on the public store;
// only server/API routes and the post-purchase confirmation page are off-limits
// (the cart and checkout are UI drawers/modals, not crawlable routes).
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/success"];

  // Named AI crawlers, explicitly allowed so the store is eligible for AI answers
  // and shopping surfaces. (The wildcard rule already permits them; this makes the
  // intent obvious and survives any future tightening of the wildcard.)
  const aiBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
