// Manifestation Stories — UGC social proof styled as an editorial spread rather
// than a review grid. Cinzel (font-heading) carries the quotes; Montserrat
// (font-sans) grounds the names. Laid out as a CSS masonry via columns so the
// quotes stagger like a magazine feature.
interface Story {
  quote: string;
  name: string;
  location: string;
}

const stories: Story[] = [
  {
    quote:
      "The Pyrite cluster completely shifted the energy of my workspace. Abundance flows differently now.",
    name: "Amara O.",
    location: "Lagos",
  },
  {
    quote:
      "I hung the Evil Eye by my front door and, honestly, the house just feels lighter. Protected.",
    name: "Selin K.",
    location: "Istanbul",
  },
  {
    quote:
      "My Chakra tree sits by the window. Every morning it catches the light and I catch my breath.",
    name: "Priya N.",
    location: "London",
  },
  {
    quote:
      "The Tiger's Eye lives in my pocket now. On the hard days it steadies me before a single word is spoken.",
    name: "Marcus D.",
    location: "Brooklyn",
  },
  {
    quote:
      "I bought the Jade coin on a whim. Two weeks later the opportunity I'd been waiting on finally opened.",
    name: "Chloé R.",
    location: "Paris",
  },
  {
    quote:
      "It arrived already cleansed and wrapped like a gift. You can feel the intention before you even unbox it.",
    name: "Isabela M.",
    location: "Lisbon",
  },
];

export default function ManifestationStories() {
  return (
    <section id="stories" className="scroll-mt-24 border-y border-champagne-gold/30 bg-ivory px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Manifestation Stories
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl uppercase tracking-[0.15em] text-midnight-navy sm:text-4xl">
            Energy, in their own words
          </h2>
        </div>

        <div className="mt-14 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {stories.map((story) => (
            <figure
              key={story.name}
              className="break-inside-avoid rounded-2xl border border-champagne-gold/30 bg-sand/40 p-8 transition-all duration-500 ease-out hover:border-champagne-gold/50 hover:bg-sand/70"
            >
              <span
                aria-hidden="true"
                className="font-heading text-4xl leading-none text-champagne-gold"
              >
                &ldquo;
              </span>
              <blockquote className="mt-3 font-heading text-lg leading-8 text-midnight-navy">
                {story.quote}
              </blockquote>
              <figcaption className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-midnight-navy/85">
                {story.name}
                <span className="text-champagne-gold font-semibold"> · {story.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
