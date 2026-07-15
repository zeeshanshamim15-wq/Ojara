// Rejects obviously-broken addresses BEFORE we send. The goal is NOT to prove a
// mailbox exists — only the mail server can know that — but every message sent to
// a bad address still counts against Gmail's daily quota and then bounces. A burst
// of bounces is what trips "You have reached a limit for sending mail". (Bundle §9)

export const normalizeEmail = (raw: unknown): string =>
  (typeof raw === "string" ? raw : "").trim().toLowerCase();

export const isValidEmail = (raw: unknown): boolean => {
  const email = normalizeEmail(raw);
  if (!email || email.length > 254) return false;

  const at = email.indexOf("@");
  // Exactly one "@", not first or last char.
  if (at <= 0 || at !== email.lastIndexOf("@") || at === email.length - 1)
    return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (/\s/.test(email)) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes(".."))
    return false;

  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.includes("..") ||
    !/^[a-z0-9.-]+$/.test(domain) ||
    !/\.[a-z]{2,}$/.test(domain) // needs a real TLD
  )
    return false;

  return true;
};
