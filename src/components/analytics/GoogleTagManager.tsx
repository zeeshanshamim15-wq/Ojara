import Script from "next/script";

// Google Tag Manager base install.
//
// GA4, Microsoft Clarity, and the Meta Pixel are all configured *inside* the GTM
// dashboard — this component only loads the container, so nothing here needs to
// change when you add those tags later.
//
// The container id comes from NEXT_PUBLIC_GTM_ID (see .env). If it's unset the
// component renders nothing, so local/dev builds stay clean and the site never
// ships a broken GTM snippet.

type Props = {
  /** GTM container id, e.g. "GTM-XXXXXXX". Defaults to NEXT_PUBLIC_GTM_ID. */
  gtmId?: string;
};

const resolveId = (gtmId?: string) =>
  (gtmId || process.env.NEXT_PUBLIC_GTM_ID || "").trim();

/**
 * The GTM loader script. Place inside <body> in the root layout. Uses
 * `afterInteractive` so it loads early without blocking hydration.
 */
export default function GoogleTagManager({ gtmId }: Props) {
  const id = resolveId(gtmId);
  if (!id) return null;

  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

/**
 * The <noscript> fallback iframe. Must be the first thing inside <body> per GTM's
 * install guide, so it's a separate export the layout can position at the top.
 */
export function GoogleTagManagerNoScript({ gtmId }: Props) {
  const id = resolveId(gtmId);
  if (!id) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
