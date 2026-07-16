import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isValidEmail, normalizeEmail } from "@/lib/validateEmail";
import {
  clientIp,
  isHoneypotFilled,
  isRateLimited,
  isSameOrigin,
} from "@/lib/apiGuard";
import { SUPPORT_EMAIL, BRAND_NAME } from "@/lib/commerce/config";
import { brandMarkHtml, logoAttachments } from "@/lib/emailBrand";

// Newsletter sign-up. Net-new (not in the Viora bundle) but built on the same
// abuse-guard + nodemailer foundation as the contact route: notifies our support
// inbox so the list can be maintained. When Wix is live this is where a Wix CRM
// contact-create call would additionally slot in (Phase 2).
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);

    // Honeypot → silent success (see contact route).
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true });
    }
    if (!isSameOrigin(req)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (isRateLimited(`newsletter:${clientIp(req)}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.error("GMAIL_USER or GMAIL_APP_PASSWORD missing from env.");
      return NextResponse.json(
        { error: "Sign-up is temporarily unavailable." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    const safe = email.replace(/[\r\n]+/g, " ").trim();
    await transporter.sendMail({
      from: `"${BRAND_NAME} Website" <${gmailUser}>`,
      to: SUPPORT_EMAIL,
      subject: `New Inner Circle sign-up: ${safe}`,
      text: `New newsletter subscriber: ${safe}`,
      html: `<div style="background:#f7f3eb;padding:24px 0;font-family:Arial,sans-serif;color:#1a2338;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #eadfca;border-radius:14px;padding:28px;">
          <div style="text-align:center;padding-bottom:12px;">${brandMarkHtml(110)}</div>
          <h2 style="color:#071a47;text-align:center;margin:8px 0 16px;">New Inner Circle sign-up</h2>
          <p style="font-size:16px;text-align:center;">✦ <strong>${safe}</strong></p>
        </div>
      </div>`,
      attachments: logoAttachments(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Newsletter sign-up failed:", err);
    return NextResponse.json(
      { error: "Failed to sign up. Please try again later." },
      { status: 500 },
    );
  }
}
