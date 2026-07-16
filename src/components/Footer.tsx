import Link from "next/link";
import Image from "next/image";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

// TODO(owner): swap the Facebook href once the real page url arrives — it is a
// placeholder today and deliberately does NOT link out.
const socials: { label: string; href: string | null; icon: string }[] = [
  {
    label: "OJARA on Instagram",
    href: "https://www.instagram.com/ojara.india",
    icon: "/instagram.png",
  },
  { label: "OJARA on Facebook", href: null, icon: "/facebook.png" },
];

// Payment methods we actually accept: Razorpay covers cards/UPI/RuPay, plus COD.
// (public/paypal.png exists but PayPal is not offered — showing it would promise
// a checkout option that doesn't exist.)
const payments: { label: string; src: string }[] = [
  { label: "Visa", src: "/visa.png" },
  { label: "Mastercard", src: "/mastercard.png" },
  { label: "UPI", src: "/upi.png" },
  { label: "RuPay", src: "/rupay.png" },
  { label: "Cash on Delivery", src: "/cash-on-delivery.png" },
];

const columns: FooterColumn[] = [
  {
    title: "The Brand",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Collection", href: "/#collection" },
      { label: "Manifestation Stories", href: "/#stories" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-champagne-gold/30 bg-midnight-navy text-champagne-gold">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            {/* Brand mark — client gem art (bg removed) — beside the wordmark */}
            <div className="flex items-center gap-3">
              <Image
                alt="Ojara"
                className="object-contain"
                height={40}
                width={36}
                src="/logo.png"
              />
              <p className="font-heading text-2xl uppercase tracking-[0.3em]">
                Ojara
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-champagne-gold/90">
              Magnetic crystal bracelets, charged to shift your energy every day.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne-gold/40 transition-all duration-150 hover:border-champagne-gold hover:bg-champagne-gold/10 active:scale-95"
                  >
                    <Image src={s.icon} alt="" width={18} height={18} className="object-contain" />
                  </a>
                ) : (
                  // No url yet — render it inert rather than linking to "#",
                  // which would look live and go nowhere.
                  <span
                    key={s.label}
                    aria-label={`${s.label} (coming soon)`}
                    title="Coming soon"
                    className="flex h-9 w-9 cursor-default items-center justify-center rounded-full border border-champagne-gold/20 opacity-40"
                  >
                    <Image src={s.icon} alt="" width={18} height={18} className="object-contain" />
                  </span>
                ),
              )}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs uppercase tracking-[0.3em] text-champagne-gold/90">
                {column.title}
              </p>
              <ul className="mt-5 flex flex-col gap-3 text-sm tracking-[0.15em] text-champagne-gold/95">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch
                      className="cursor-pointer transition-all duration-150 ease-out hover:text-ivory active:scale-95"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-center gap-6 border-t border-champagne-gold/30 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs tracking-[0.15em] text-champagne-gold/85">
            © {new Date().getFullYear()} Ojara. All rights reserved.
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-3 sm:gap-4">
            {payments.map((p) => (
              <Image
                key={p.label}
                src={p.src}
                alt={p.label}
                width={44}
                height={26}
                className="h-6 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
