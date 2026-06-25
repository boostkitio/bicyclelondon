import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-brand">
        404
      </p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">
        You&rsquo;ve taken a wrong turn
      </h1>
      <p className="mt-5 max-w-md text-white/70">
        The page you&rsquo;re after has moved or never existed. Let&rsquo;s get
        you back on the road.
      </p>
      <div className="mt-8">
        <ButtonLink href="/" variant="primary" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </main>
  );
}
