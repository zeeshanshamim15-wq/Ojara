"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Mode = "signin" | "create";

export default function AccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("signin");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only for now — wire to a real auth provider later.
    toast.success(
      mode === "signin" ? "✦ Welcome back" : "✦ Your journey begins",
      { description: "Accounts are coming soon." },
    );
    onClose();
  };

  const isSignIn = mode === "signin";

  return (
    <div
      aria-hidden={!open}
      onClick={onClose}
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-midnight-navy/60 px-6 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isSignIn ? "Sign in" : "Create account"}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl bg-ivory p-8 shadow-2xl transition-all duration-300 ease-out sm:p-10 ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-champagne-gold">
              OJARA
            </span>
            <h2 className="mt-3 font-heading text-3xl text-midnight-navy">
              {isSignIn ? "Welcome Back" : "Join OJARA"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-midnight-navy/60 transition-colors hover:text-midnight-navy"
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
        </div>

        <p className="mt-3 text-sm leading-6 text-midnight-navy/60">
          {isSignIn
            ? "Sign in to follow your intentions and orders."
            : "Create an account to begin your ritual with OJARA."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {!isSignIn && (
            <Field label="Full Name" type="text" placeholder="Your name" />
          )}
          <Field label="Email" type="email" placeholder="you@email.com" />
          <Field label="Password" type="password" placeholder="••••••••" />

          <button
            type="submit"
            className="w-full rounded-full bg-champagne-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-midnight-navy transition-colors duration-300 ease-out hover:bg-champagne-gold/85"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-midnight-navy/60">
          {isSignIn ? "New to OJARA?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(isSignIn ? "create" : "signin")}
            className="text-champagne-gold underline-offset-4 transition-colors hover:underline"
          >
            {isSignIn ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-midnight-navy/60">
        {label}
      </span>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-warm-grey/50 bg-white/50 px-4 py-3 text-sm text-midnight-navy placeholder:text-warm-grey focus:border-champagne-gold focus:outline-none focus:ring-2 focus:ring-champagne-gold/30"
      />
    </label>
  );
}
