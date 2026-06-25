"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand-ink focus:ring-2 focus:ring-brand/40";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setError("");

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-paper p-8 text-center">
        <p className="font-display text-2xl font-bold uppercase text-brand-ink">
          Thanks, message sent
        </p>
        <p className="mt-3 text-black/70">
          We’ll be in touch shortly. In the meantime, feel free to keep exploring.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot: hidden from users, catches bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="enquiryType" className="mb-1.5 block text-sm font-semibold">
          What’s it about?
        </label>
        <select id="enquiryType" name="enquiryType" className={inputClass} defaultValue="New business">
          <option>New business</option>
          <option>General enquiry</option>
          <option>Careers</option>
          <option>Press</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
            Name
          </label>
          <input id="name" name="name" required className={inputClass} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm font-semibold">
          Company <span className="font-normal text-black/40">(optional)</span>
        </label>
        <input id="company" name="company" className={inputClass} autoComplete="organization" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-brand-ink disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
