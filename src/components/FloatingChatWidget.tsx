"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "guide" | "user";
  text: string;
}

// Seeded so the window never opens empty. The welcome copy is intentionally
// bilingual-friendly — this UI is built to be hooked up to an autonomous AI
// Energy Guide (Hinglish chat + automated Vastu-consultation booking) later.
const WELCOME: Message =
  {
    role: "guide",
    text: "Namaste! Looking for the perfect crystal, or want to book a Vastu consultation? I can help.",
  };

// Dummy replies until the real Hinglish AI agent / booking system is wired in.
const DUMMY_REPLIES = [
  "Connecting you to an Energy Guide...",
  "Let me check the alignment for that stone.",
];

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest message (or the typing indicator) in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setDraft("");
    setIsTyping(true);

    // TODO: replace this simulated reply with the autonomous AI Energy Guide
    // (Hinglish chat + automated Vastu-consultation booking). The message list,
    // typing indicator, and input are all agent-ready.
    window.setTimeout(() => {
      const reply =
        DUMMY_REPLIES[Math.floor(Math.random() * DUMMY_REPLIES.length)];
      setMessages((prev) => [...prev, { role: "guide", text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[85] flex flex-col items-end print:hidden">
      {/* Slide-up chat window */}
      <div
        role="dialog"
        aria-label="Ojara Energy Guide chat"
        aria-hidden={!open}
        className={`mb-4 flex h-[28rem] w-[calc(100vw-3rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-3xl border border-champagne-gold/30 bg-ivory shadow-2xl transition-all duration-500 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-midnight-navy px-5 py-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-champagne-gold font-heading text-lg text-midnight-navy">
            O
          </span>
          <div className="flex-1">
            <p className="font-heading text-base tracking-wide text-champagne-gold">
              Ojara Energy Guide
            </p>
            <p className="flex items-center gap-1.5 text-xs text-ivory/60">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              Online now
            </p>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="rounded-full p-1 text-ivory/70 transition-colors hover:text-ivory"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto bg-sand/30 px-4 py-5"
        >
          {messages.map((message, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "guide"
                  ? "self-start rounded-bl-sm bg-ivory text-midnight-navy shadow-sm"
                  : "self-end rounded-br-sm bg-champagne-gold text-midnight-navy"
              }`}
            >
              {message.text}
            </div>
          ))}

          {/* Typing indicator while the guide "responds" */}
          {isTyping && (
            <div
              className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-ivory px-4 py-3.5 shadow-sm"
              aria-label="Energy Guide is typing"
            >
              <span className="h-2 w-2 animate-bounce rounded-full bg-midnight-navy/40 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-midnight-navy/40 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-midnight-navy/40" />
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={send}
          className="flex items-center gap-2 border-t border-warm-grey/40 bg-ivory px-3 py-3"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about a crystal or consultation…"
            aria-label="Message the Energy Guide"
            className="flex-1 rounded-full bg-sand/50 px-4 py-2.5 text-sm text-midnight-navy placeholder:text-warm-grey focus:outline-none focus:ring-2 focus:ring-champagne-gold/40"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-champagne-gold text-midnight-navy transition-transform duration-300 ease-out hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating action button */}
      <button
        type="button"
        aria-label={open ? "Close Energy Guide chat" : "Chat with an Energy Guide"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-0 self-end rounded-full bg-champagne-gold py-3 pl-5 pr-3 text-midnight-navy shadow-lg shadow-midnight-navy/25 outline-none ring-champagne-gold/40 transition-all duration-500 ease-out hover:shadow-xl focus-visible:ring-4"
      >
        {/* Label collapses when the window is open (icon becomes a close affordance) */}
        <span
          className={`overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-out ${
            open
              ? "max-w-0 opacity-0"
              : "max-w-0 opacity-0 group-hover:max-w-[16rem] group-hover:pr-3 group-hover:opacity-100 group-focus-visible:max-w-[16rem] group-focus-visible:pr-3 group-focus-visible:opacity-100"
          }`}
        >
          Chat with an Energy Guide
        </span>

        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-midnight-navy text-champagne-gold transition-transform duration-500 ease-out group-hover:scale-105">
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
              <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
