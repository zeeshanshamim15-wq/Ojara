"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById, type Product } from "@/lib/mockData";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

type Intention = "Wealth" | "Protection" | "Peace";
type Style = "Raw Stones" | "Polished Gems" | "Wearable Amulets";

// Recommendation matrix — every intention × style resolves to a real product.
const MATCHES: Record<Intention, Record<Style, string>> = {
  Wealth: {
    "Raw Stones": "raw-pyrite-cluster",
    "Polished Gems": "green-jade-zibu-coin",
    "Wearable Amulets": "abundance-harmony-set",
  },
  Protection: {
    "Raw Stones": "golden-vastu-turtle",
    "Polished Gems": "tigers-eye-focus-stone",
    "Wearable Amulets": "evil-eye-bracelet",
  },
  Peace: {
    "Raw Stones": "chakra-crystal-tree",
    "Polished Gems": "tigers-eye-focus-stone",
    "Wearable Amulets": "evil-eye-bracelet",
  },
};

const intentions: { value: Intention; caption: string }[] = [
  { value: "Wealth", caption: "Abundance, drive, prosperity" },
  { value: "Protection", caption: "Shield your aura, ward off envy" },
  { value: "Peace", caption: "Calm, clarity, grounded focus" },
];

const styles: { value: Style; caption: string }[] = [
  { value: "Raw Stones", caption: "Untouched, natural energy" },
  { value: "Polished Gems", caption: "Refined, carried close" },
  { value: "Wearable Amulets", caption: "Worn as a daily talisman" },
];

export default function EnergyQuiz({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [intention, setIntention] = useState<Intention | null>(null);
  const [style, setStyle] = useState<Style | null>(null);

  // Lock scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const reset = () => {
    setStep(1);
    setIntention(null);
    setStyle(null);
  };

  const chooseIntention = (value: Intention) => {
    setIntention(value);
    setStep(2);
  };

  const chooseStyle = (value: Style) => {
    setStyle(value);
    setStep(3);
  };

  const match: Product | undefined =
    intention && style ? getProductById(MATCHES[intention][style]) : undefined;

  return (
    <div
      aria-hidden={!open}
      onClick={onClose}
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-midnight-navy/70 px-6 backdrop-blur-md transition-opacity duration-500 ease-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Find Your Stone quiz"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl bg-ivory shadow-2xl transition-all duration-500 ease-out ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close quiz"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 cursor-pointer rounded-full p-1 text-midnight-navy/70 transition-all duration-150 hover:text-midnight-navy active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-8">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                s === step
                  ? "w-8 bg-champagne-gold"
                  : s < step
                    ? "w-4 bg-champagne-gold/60"
                    : "w-4 bg-warm-grey/40"
              }`}
            />
          ))}
        </div>

        <div className="px-8 pb-10 pt-6 sm:px-10">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Find Your Stone
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <QuizStep title="What are you manifesting?">
              {intentions.map((option) => (
                <QuizOption
                  key={option.value}
                  label={option.value}
                  caption={option.caption}
                  onClick={() => chooseIntention(option.value)}
                />
              ))}
            </QuizStep>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <QuizStep title="What draws your eye?">
              {styles.map((option) => (
                <QuizOption
                  key={option.value}
                  label={option.value}
                  caption={option.caption}
                  onClick={() => chooseStyle(option.value)}
                />
              ))}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-2 cursor-pointer text-xs uppercase tracking-[0.2em] text-midnight-navy/70 transition-colors hover:text-midnight-navy active:scale-95"
              >
                ← Back
              </button>
            </QuizStep>
          )}

          {/* STEP 3 — result */}
          {step === 3 && match && (
            <div className="mt-8 text-center animate-fade-in-up">
              <h3 className="font-heading text-2xl text-midnight-navy sm:text-3xl">
                Your Perfect Match
              </h3>
              <p className="mt-2 text-sm text-midnight-navy/70">
                For {intention?.toLowerCase()}, worn as {style?.toLowerCase()}.
              </p>

              <div className="mx-auto mt-6 max-w-xs overflow-hidden rounded-2xl border border-champagne-gold/25 bg-sand/40">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={match.image}
                    alt={match.name}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-midnight-navy/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-champagne-gold backdrop-blur-sm">
                    {match.intention}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-heading text-lg text-midnight-navy">
                    {match.name}
                  </h4>
                  <p className="mt-1 text-sm text-midnight-navy/70">
                    {formatPrice(match.price)}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <AddToCartButton
                  product={match}
                  onAdded={onClose}
                  className="w-full cursor-pointer rounded-full bg-champagne-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-midnight-navy transition-all duration-150 hover:bg-champagne-gold/85 active:scale-95"
                >
                  Add to Bag
                </AddToCartButton>
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-5 cursor-pointer text-xs uppercase tracking-[0.2em] text-midnight-navy/70 transition-colors hover:text-midnight-navy active:scale-95"
              >
                ↺ Retake the quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizStep({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 animate-fade-in-up">
      <h3 className="text-center font-heading text-2xl text-midnight-navy sm:text-3xl">
        {title}
      </h3>
      <div className="mt-8 flex flex-col items-stretch gap-3">{children}</div>
    </div>
  );
}

function QuizOption({
  label,
  caption,
  onClick,
}: {
  label: string;
  caption: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-champagne-gold/25 bg-sand/40 px-6 py-5 text-left transition-all duration-150 hover:border-champagne-gold hover:bg-champagne-gold/15 active:scale-[0.98]"
    >
      <span>
        <span className="block font-heading text-lg tracking-wide text-midnight-navy">
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-midnight-navy/70">
          {caption}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="text-champagne-gold transition-transform duration-300 ease-out group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}
