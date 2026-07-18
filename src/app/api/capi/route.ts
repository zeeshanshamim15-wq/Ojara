import { NextResponse } from "next/server";
import crypto from "crypto";

// ============================================================================
// Meta Conversions API (server-side pixel).
//
// The access token NEVER touches the browser — the frontend calls this route
// (see src/lib/analytics/capi.ts) and we forward a hashed, server-signed event
// to Meta's Graph API. Pair each event with the browser Pixel (fired via GTM)
// using the SAME event_id so Meta de-duplicates them.
//
// Env (see .env): META_PIXEL_ID, META_CAPI_ACCESS_TOKEN, optional
// META_TEST_EVENT_CODE (shows events in Meta's Test Events tab while wiring up).
// If either required var is missing the route is a safe no-op, so the frontend
// can call it in any environment without erroring.
// ============================================================================

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const API_VERSION = "v21.0";

// Meta wants user identifiers SHA-256 hashed, lower-cased and trimmed first.
const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

const hashed = (value?: string) =>
  value && value.trim() ? [sha256(value)] : undefined;

type CapiRequestBody = {
  eventName?: string;
  eventId?: string;
  eventSourceUrl?: string;
  actionSource?: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    fbp?: string;
    fbc?: string;
  };
  // Non-PII: value, currency, content_ids, contents, num_items, etc.
  customData?: Record<string, unknown>;
};

export async function POST(req: Request) {
  // No keys yet → succeed silently so callers never see an error.
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, skipped: true }, { status: 200 });
  }

  const body = (await req.json().catch(() => ({}))) as CapiRequestBody;
  const { eventName, eventId, eventSourceUrl, actionSource, userData = {}, customData = {} } =
    body;

  if (!eventName) {
    return NextResponse.json({ error: "eventName is required." }, { status: 400 });
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  const user_data = {
    em: hashed(userData.email),
    ph: hashed(userData.phone?.replace(/\D/g, "")),
    fn: hashed(userData.firstName),
    ln: hashed(userData.lastName),
    client_ip_address: clientIp,
    client_user_agent: userAgent,
    fbp: userData.fbp,
    fbc: userData.fbc,
  };

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: actionSource || "website",
        user_data,
        custom_data: customData,
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Meta CAPI rejected event:", eventName, data);
      // 200 so a tracking failure never surfaces as a broken user action.
      return NextResponse.json({ ok: false, error: data }, { status: 200 });
    }
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("Meta CAPI request failed:", err);
    return NextResponse.json({ ok: false, error: "request_failed" }, { status: 200 });
  }
}
