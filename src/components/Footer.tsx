import Link from "next/link";
import Image from "next/image";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

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
      { label: "Contact", href: "mailto:care@ojara.com" },
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
              Sacred crystals and spiritual objects, charged to shift your
              energy every day.
            </p>
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

        <div className="mt-14 border-t border-champagne-gold/30 pt-6 text-xs tracking-[0.15em] text-champagne-gold/85">
          © {new Date().getFullYear()} Ojara. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
