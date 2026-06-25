"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Keeps Substack as the source of truth for the newsletter. On submit we hand
 * the reader to the Substack subscribe page with their email pre-filled.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const base = SITE.social.substack.replace(/\/$/, "");
    const url = `${base}/subscribe?just_signed_up=true&email=${encodeURIComponent(email)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-3xl bg-navy p-8 text-white sm:p-10">
      <h2 className="display text-2xl sm:text-3xl">Get the Slipstream</h2>
      <p className="mt-3 max-w-md text-white/70">
        Our take on what’s moving in media and culture, straight to your inbox.
        Powered by Substack.
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/40 outline-none focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-brand px-7 py-3 font-display text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-brand-ink"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
