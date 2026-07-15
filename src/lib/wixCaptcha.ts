// reCAPTCHA Enterprise helpers for the Wix auth flow.
//
// The migration bundle imports this module from its login flow but never shipped
// the source, so it is reconstructed here from its four call sites:
//   - LOGIN    → getInvisibleCaptchaToken(siteKey, "login")
//   - REGISTER → renderVisibleCaptcha() / getVisibleCaptchaResponse() / resetVisibleCaptcha()
//
// Site keys are NOT env vars — they come off the Wix SDK itself
// (wixClient.auth.captchaVisibleSiteKey / .captchaInvisibleSiteKey).
//
// The script is loaded with `render=explicit` so a single load serves both the
// visible checkbox key and the invisible key. The auth flow treats a thrown
// "RECAPTCHA_LOAD_FAILED" as "ad-blocker / offline", so keep that exact string.

type RecaptchaWidgetParams = {
  sitekey: string;
  size?: "invisible" | "normal" | "compact";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
};

type RecaptchaApi = {
  ready: (cb: () => void) => void;
  render: (container: HTMLElement, params: RecaptchaWidgetParams) => number;
  execute: (widgetId: number, options?: { action?: string }) => void | Promise<string>;
  getResponse: (widgetId: number) => string;
  reset: (widgetId: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: { enterprise?: RecaptchaApi };
  }
}

const SCRIPT_ID = "wix-recaptcha-enterprise";
const SCRIPT_SRC =
  "https://www.google.com/recaptcha/enterprise.js?render=explicit";

const LOAD_FAILED = "RECAPTCHA_LOAD_FAILED";
// An invisible challenge that never calls back would otherwise hang the login
// button forever; the auth flow has its own 25s timeout, so stay under it.
const EXECUTE_TIMEOUT_MS = 20000;

let loadPromise: Promise<RecaptchaApi> | null = null;

const loadRecaptcha = (): Promise<RecaptchaApi> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error(LOAD_FAILED));
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<RecaptchaApi>((resolve, reject) => {
    const fail = () => {
      // Let a later attempt retry from scratch (the user may disable the blocker).
      loadPromise = null;
      reject(new Error(LOAD_FAILED));
    };

    const whenReady = () => {
      const api = window.grecaptcha?.enterprise;
      if (!api) return fail();
      api.ready(() => resolve(api));
    };

    if (window.grecaptcha?.enterprise) return whenReady();

    const existing = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", whenReady, { once: true });
      existing.addEventListener("error", fail, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", whenReady, { once: true });
    script.addEventListener("error", fail, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
};

// One hidden invisible widget per site key, reused across attempts.
const invisibleWidgets = new Map<string, number>();

const getInvisibleWidget = async (
  api: RecaptchaApi,
  siteKey: string,
  onToken: (token: string) => void,
  onError: () => void,
): Promise<number> => {
  const existing = invisibleWidgets.get(siteKey);
  if (existing !== undefined) return existing;

  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);

  const widgetId = api.render(container, {
    sitekey: siteKey,
    size: "invisible",
    // Re-read through refs so the widget (rendered once) always resolves the
    // *current* execute() call rather than the first one.
    callback: (token: string) => onToken(token),
    "error-callback": () => onError(),
  });

  invisibleWidgets.set(siteKey, widgetId);
  return widgetId;
};

// Holds the resolver for the in-flight execute() on a given widget.
const pending = new Map<
  number,
  { resolve: (token: string) => void; reject: (err: Error) => void }
>();

const settle = (widgetId: number, token: string | null) => {
  const p = pending.get(widgetId);
  if (!p) return;
  pending.delete(widgetId);
  if (token) p.resolve(token);
  else p.reject(new Error("RECAPTCHA_EXECUTE_FAILED"));
};

/**
 * Invisible reCAPTCHA — used by LOGIN, where there is no checkbox for the user
 * to solve. Resolves with a single-use token.
 */
export const getInvisibleCaptchaToken = async (
  siteKey: string,
  action: string,
): Promise<string> => {
  const api = await loadRecaptcha();

  const widgetId = await getInvisibleWidget(
    api,
    siteKey,
    (token) => settle(widgetId, token),
    () => settle(widgetId, null),
  );

  // Tokens are single-use: clear any stale response before asking for a new one.
  api.reset(widgetId);

  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(widgetId);
      reject(new Error("RECAPTCHA_EXECUTE_TIMEOUT"));
    }, EXECUTE_TIMEOUT_MS);

    pending.set(widgetId, {
      resolve: (token) => {
        clearTimeout(timer);
        resolve(token);
      },
      reject: (err) => {
        clearTimeout(timer);
        reject(err);
      },
    });

    try {
      // Enterprise returns a thenable for invisible widgets in some versions and
      // fires the render callback in others. Support both; whichever lands first
      // settles the promise, and settle() is idempotent.
      const result = api.execute(widgetId, { action });
      if (result && typeof (result as Promise<string>).then === "function") {
        (result as Promise<string>)
          .then((token) => settle(widgetId, token))
          .catch(() => settle(widgetId, null));
      }
    } catch {
      settle(widgetId, null);
    }
  });
};

/**
 * Visible "I'm not a robot" checkbox — used by REGISTER, and only once Wix
 * answers with missingCaptchaToken / invalidCaptchaToken.
 */
export const renderVisibleCaptcha = async (
  container: HTMLElement,
  siteKey: string,
): Promise<number> => {
  const api = await loadRecaptcha();

  // Re-rendering into a populated container throws; make render idempotent.
  if (container.childElementCount > 0) container.innerHTML = "";

  return api.render(container, { sitekey: siteKey, size: "normal" });
};

export const getVisibleCaptchaResponse = (widgetId: number): string => {
  try {
    return window.grecaptcha?.enterprise?.getResponse(widgetId) || "";
  } catch {
    return "";
  }
};

export const resetVisibleCaptcha = (widgetId: number): void => {
  try {
    window.grecaptcha?.enterprise?.reset(widgetId);
  } catch {}
};
