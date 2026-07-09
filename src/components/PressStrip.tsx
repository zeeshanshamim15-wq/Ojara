const PUBLICATIONS = ["VOGUE", "HARPER'S BAZAAR", "ELLE", "TATLER"];

export default function PressStrip() {
  return (
    <section className="bg-champagne-gold py-8 text-midnight-navy sm:py-10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-midnight-navy/70">
          As Featured In
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:mt-6 sm:gap-x-14">
          {PUBLICATIONS.map((name) => (
            <span
              key={name}
              className="font-heading text-lg tracking-[0.15em] sm:text-2xl sm:tracking-[0.2em]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
