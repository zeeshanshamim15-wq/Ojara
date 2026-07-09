import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="border-y border-champagne-gold/20 bg-midnight-navy text-ivory">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
        {/* Tall crystal image */}
        <div className="relative min-h-[28rem] lg:min-h-[42rem]">
          <Image
            src="https://images.unsplash.com/photo-1651841607023-9bc357ea63a2?auto=format&fit=crop&w=1000&q=80"
            alt="A crystal point beside a candle on a quiet altar"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Editorial copy */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-14 sm:py-20 lg:px-20">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Our Philosophy
          </span>

          <h2 className="mt-8 font-heading text-4xl uppercase leading-[1.35] tracking-[0.15em] sm:text-5xl sm:tracking-[0.2em]">
            The Essence
            <br />
            of Ojas
          </h2>

          <div className="mt-10 space-y-6 text-base leading-8 text-ivory/75">
            <p>
              In ancient wisdom, <span className="text-champagne-gold">Ojas</span>{" "}
              is the vital essence — the quiet energy and radiance that lives
              within, the source of vitality, protection, and calm.
            </p>
            <p>
              Every OJARA piece is chosen and charged to work with that energy.
              From raw crystals to sacred talismans, each object becomes a tool
              to attract abundance, shield your aura, and magnify your intent.
            </p>
            <p>
              Not decoration for its own sake — but energy, made intentional.
            </p>
          </div>

          <p className="mt-12 font-heading text-lg uppercase tracking-[0.35em] text-champagne-gold">
            Magnify Your Intention
          </p>
        </div>
      </div>
    </section>
  );
}
