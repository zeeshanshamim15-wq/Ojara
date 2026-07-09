import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | OJARA",
  description:
    "Answers to common questions about OJARA crystals, orders, and care.",
};

const faqs: FaqItem[] = [
  {
    question: "Are your crystals genuine and ethically sourced?",
    answer:
      "Always. Every OJARA piece is a natural stone, sourced through trusted partners who honour fair, responsible mining practices. Each one is authenticated before it reaches you.",
  },
  {
    question: "What does it mean that pieces are 'cleansed and charged'?",
    answer:
      "Before shipping, each piece is cleared of residual energy and set with intention — traditionally through sage smoke, sound, or moonlight — so it arrives ready to work with you rather than carrying the energy of everyone who handled it before.",
  },
  {
    question: "How do I care for and recharge my crystal?",
    answer:
      "Cleanse it gently with sage smoke or a night of moonlight whenever it feels heavy or after intense use. Keep it away from prolonged direct sunlight and harsh water, as some stones are delicate.",
  },
  {
    question: "Will my piece look exactly like the photo?",
    answer:
      "Each stone is one of a kind. Colour, shape, and natural inclusions vary from piece to piece — the photograph represents the quality and character you'll receive, not an identical twin.",
  },
  {
    question: "How long will shipping take?",
    answer:
      "Domestic orders arrive within 3–7 business days and international orders within 7–21 business days. You'll receive tracking as soon as your order ships. See our Shipping & Returns page for full details.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer 30-day authentic returns. If your piece doesn't resonate, return it unused in its original packaging within 30 days for a refund or exchange.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Every order arrives thoughtfully wrapped as a gift by default — no extra step required. If you'd like a personal note included, add it at checkout.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-ivory">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          prefetch
          className="text-xs uppercase tracking-[0.2em] text-midnight-navy/60 transition-colors duration-300 ease-out hover:text-midnight-navy"
        >
          ← Back to OJARA
        </Link>

        <header className="mt-10 mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
            Support
          </span>
          <h1 className="mt-5 font-heading text-4xl text-midnight-navy sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-midnight-navy/70">
            Everything you need to know about our crystals, orders, and care. If
            your question isn&apos;t here, our Energy Guides are always happy to
            help.
          </p>
        </header>

        <FaqAccordion items={faqs} />

        <p className="mt-16 border-t border-champagne-gold/25 pt-8 text-center text-sm leading-7 text-midnight-navy/60">
          Still curious? Write to us at{" "}
          <a
            href="mailto:care@ojara.com"
            className="text-champagne-gold underline-offset-4 hover:underline"
          >
            care@ojara.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
