import Image from "next/image";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// Verified spiritual-wellness stills, with an asymmetrical row-span layout.
const shots = [
  { id: "photo-1658915294986-ecae46200c99", alt: "A candle and healing crystals on a linen flatlay", span: "row-span-2" },
  { id: "photo-1618721025639-9affb7d96901", alt: "Sacred smudge smoke rising in a cleansing ritual", span: "row-span-3" },
  { id: "photo-1652536160742-9f46c4a1a838", alt: "A blue evil eye amulet against a pale wall", span: "row-span-3" },
  { id: "photo-1632980205460-e490e885e848", alt: "A glowing raw amethyst crystal cluster", span: "row-span-2" },
];

export default function LifestyleGallery() {
  return (
    <section className="border-y border-champagne-gold/20 bg-ivory px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center sm:mb-14">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            The Ritual
          </span>
          <h2 className="mt-5 text-3xl uppercase tracking-[0.15em] text-midnight-navy sm:text-4xl">
            Rituals &amp; Sacred Energy
          </h2>
        </div>

        <div className="grid auto-rows-[7rem] grid-cols-2 gap-3 sm:auto-rows-[10rem] sm:gap-4 lg:grid-cols-4">
          {shots.map((shot) => (
            <figure
              key={shot.id}
              className={`group relative overflow-hidden rounded-xl bg-sand ${shot.span}`}
            >
              <Image
                src={img(shot.id)}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
