// Renders a JSON-LD structured-data block. Server component — the script is in
// the initial HTML so search engines and AI crawlers read it without running JS.
//
// `id` keeps React keys stable and makes the tags easy to spot in view-source.
export default function JsonLd({
  id,
  data,
}: {
  id?: string;
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Structured data is trusted, server-built JSON — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
