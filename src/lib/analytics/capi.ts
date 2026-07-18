// Client-side tracking helper.
//
// `trackEvent` does two things for one conversion:
//   1. pushes the event onto window.dataLayer so GTM (and the browser Meta Pixel
//      configured inside GTM) can fire it, and
//   2. POSTs the same event — with a shared eventId — to /api/capi so the
//      server-side Meta Conversions API fires it too. Meta de-duplicates the two
//      by eventId, which improves match quality without double-counting.
//
// Everything here is fire-and-forget and wrapped so a tracking failure can never
// break an actual user action (add to cart, checkout, etc.).

export type TrackUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
};

export type TrackOptions = {
  /** Non-PII commerce data: value, currency, content_ids, contents, num_items… */
  customData?: Record<string, unknown>;
  userData?: TrackUserData;
  /** Provide to force a specific id; otherwise one is generated. */
  eventId?: string;
};

type DataLayerWindow = Window & {
  dataLayer?: Record<string, unknown>[];
};

const genEventId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// Read a cookie by name (used for Meta's _fbp / _fbc first-party cookies).
const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

/**
 * Track a conversion event across GTM (client) and Meta CAPI (server).
 * Returns the eventId used, so a caller could correlate if needed.
 */
export function trackEvent(
  eventName: string,
  options: TrackOptions = {},
): string {
  const eventId = options.eventId || genEventId();

  if (typeof window === "undefined") return eventId;

  try {
    // 1. GTM / client pixel.
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      eventId,
      ...options.customData,
    });
  } catch {
    // ignore — never block the user action
  }

  try {
    // 2. Server-side CAPI. Fire-and-forget; keepalive lets it survive navigation
    // (e.g. Purchase firing right before a redirect to the success page).
    const payload = {
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      actionSource: "website",
      userData: {
        ...options.userData,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      },
      customData: options.customData || {},
    };
    void fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore — tracking must never throw into the caller
  }

  return eventId;
}
