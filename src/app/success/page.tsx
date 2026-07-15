import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | OJARA",
  robots: { index: false, follow: false },
};

// Order success. Server component; the orderId arrives as a search param from the
// checkout modal's redirect. (Params are a Promise in Next 16.)
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-champagne-gold/15 text-champagne-gold">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
        Order Confirmed
      </p>
      <h1 className="mt-6 font-heading text-3xl uppercase tracking-[0.15em] text-midnight-navy sm:text-4xl">
        Thank you ✦
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-midnight-navy/80">
        Your intention is on its way. We&apos;ve emailed your confirmation with the
        order details. Your pieces arrive cleansed, charged, and ready to place.
      </p>

      {orderId && (
        <p className="mt-6 rounded-full border border-midnight-navy/15 bg-sand/30 px-5 py-2 text-xs uppercase tracking-[0.2em] text-midnight-navy/70">
          Order reference:{" "}
          <span className="font-semibold text-midnight-navy">{orderId}</span>
        </p>
      )}

      <Link
        href="/"
        className="mt-10 cursor-pointer rounded-full bg-midnight-navy px-10 py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-champagne-gold transition-all hover:bg-midnight-navy/90 active:scale-95"
      >
        Continue shopping
      </Link>
    </div>
  );
}
