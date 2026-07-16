import { existsSync } from "node:fs";
import { join } from "node:path";
import { BRAND_NAME } from "./commerce/config";

// Shared branding for every outbound email (order confirmation, contact enquiry,
// newsletter sign-up) so the mark can't drift between them.
//
// The logo ships as an inline CID attachment, never as <img src="https://...">:
// SITE_URL is localhost in dev (mail clients can't fetch it), and even in prod
// Gmail proxies/blocks remote images by default. A CID part always renders.

export const LOGO_CID = "ojara-logo";
export const LOGO_PATH = join(process.cwd(), "public", "logo.png");
export const logoExists = () => existsSync(LOGO_PATH);

const NAVY = "#071A47";

/** Text fallback used when public/logo.png is missing. */
const wordmark = `<div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:8px;color:${NAVY};font-weight:bold;">✦ ${BRAND_NAME}</div>`;

/**
 * The brand mark for the top of an email body.
 * @param width rendered px width; keep small — these are inboxes, not pages.
 */
export const brandMarkHtml = (width = 132) =>
  logoExists()
    ? `<img src="cid:${LOGO_CID}" width="${width}" alt="${BRAND_NAME}" style="display:block;margin:0 auto;width:${width}px;max-width:60%;height:auto;border:0;outline:none;text-decoration:none;" />`
    : wordmark;

/**
 * Attachments array for nodemailer. `cid` must match the src="cid:…" above, and
 * contentDisposition:"inline" stops clients listing it as a download.
 * Returns [] when the file is missing, so sends never fail over branding.
 */
export const logoAttachments = () =>
  logoExists()
    ? [
        {
          filename: "ojara-logo.png",
          path: LOGO_PATH,
          cid: LOGO_CID,
          contentDisposition: "inline" as const,
        },
      ]
    : [];
