"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Frontend-only for now — wire to a real provider later.
    setEmail("");
    setSubmitted(true);
    toast.success("✦ Welcome to the Inner Circle. Your journey begins.");
  };

  return (
    <section className="border-y border-champagne-gold/20 bg-sand px-6 pb-28 pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
          Newsletter
        </span>
        <h2 className="mt-6 text-3xl uppercase tracking-[0.15em] text-midnight-navy sm:text-4xl">
          Join the Inner Circle
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-midnight-navy/60">
          Early access to new collections, private releases, and the stories
          behind each stone.
        </p>

        {submitted ? (
          <p className="mt-12 font-heading text-lg uppercase tracking-[0.25em] text-champagne-gold">
            Welcome to the circle.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 flex max-w-md flex-col items-stretch gap-6 sm:flex-row sm:items-end"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="flex-1 border-b border-champagne-gold bg-transparent px-1 py-3 text-center text-sm tracking-wide text-midnight-navy placeholder:text-warm-grey focus:border-midnight-navy focus:outline-none sm:text-left"
            />
            <button
              type="submit"
              className="rounded-full bg-midnight-navy px-10 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-champagne-gold transition-colors hover:bg-midnight-navy/90"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
