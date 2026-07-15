// Abuse protection shared by every public endpoint that sends mail (contact,
// newsletter). Without it, a crawler hammering a form burns the daily Gmail quota
// and gets the account locked. Deliberately best-effort; needs no external store.
// (Bundle §11)
//
// 1. Honeypot    — reject requests where a hidden field was filled (bots do).
// 2. Same-origin — reject requests not sent from our own site (curl / scripts).
// 3. Rate limit  — per-IP throttle within a warm serverless instance.

/** Hidden field name the real forms MUST render (always empty for humans). */
export const HONEYPOT_FIELD = "company";

export const isHoneypotFilled = (body: Record<string, unknown>): boolean => {
  const v = body?.[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
};

const hostOf = (value: string | null): string | null => {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
};

/**
 * True when the request looks like it came from our own site's form. A browser
 * fetch POST always sends an Origin whose host matches ours; bot/script hits are
 * usually cross-origin or send neither Origin nor Referer. Only a CLEAR mismatch
 * is blocked, so legitimate submissions always pass.
 */
export const isSameOrigin = (req: Request): boolean => {
  const selfHost = hostOf(`https://${req.headers.get("host") || ""}`);
  const originHost = hostOf(req.headers.get("origin"));
  const refererHost = hostOf(req.headers.get("referer"));

  if (!originHost && !refererHost) return false; // no browser context at all
  if (originHost && selfHost && originHost !== selfHost) return false;
  if (!originHost && refererHost && selfHost && refererHost !== selfHost)
    return false;
  return true;
};

export const clientIp = (req: Request): string =>
  (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

// Module-level store. Resets on cold start and is per-instance, but still throttles
// a burst hitting the same warm lambda — enough to stop a bot draining the quota.
const hits = new Map<string, number[]>();

export const isRateLimited = (
  key: string,
  max = 5,
  windowMs = 10 * 60 * 1000,
): boolean => {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    // opportunistic cleanup so the map can't grow unbounded
    Array.from(hits.entries()).forEach(([k, v]) => {
      if (v.every((t: number) => now - t >= windowMs)) hits.delete(k);
    });
  }
  return recent.length > max;
};
