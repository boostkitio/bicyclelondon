"use client";

import { ButtonLink } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-brand">
        Something went wrong
      </p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">
        A spanner in the spokes
      </h1>
      <p className="mt-5 max-w-md text-white/70">
        Sorry, that didn&rsquo;t load as it should. Try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-brand-ink"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="white" size="lg">
          Home
        </ButtonLink>
      </div>
    </main>
  );
}
