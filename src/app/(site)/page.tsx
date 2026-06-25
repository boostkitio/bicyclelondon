import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/site";

const ANDS: [string, string][] = [
  ["Media", "Creative"],
  ["Art", "Science"],
  ["Brand", "Performance"],
  ["Data", "Digital"],
  ["Man", "Machine"],
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(1,0,255,0.5),transparent_60%)]" />
        <Container className="relative z-10 pt-28 pb-20">
          <p className="mb-6 max-w-xl text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Independent integrated media and creative agency
          </p>
          <h1 className="display text-6xl sm:text-7xl lg:text-8xl">
            Built on the
            <br />
            power of <span className="text-brand">and</span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/work" variant="primary" size="lg">
              See our work
            </ButtonLink>
            <ButtonLink href="/contact-us" variant="white" size="lg">
              Contact us
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* And ticker */}
      <Section tone="brand" className="py-10">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
          {ANDS.map(([a, b], i) => (
            <span
              key={i}
              className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
            >
              {a} <span className="text-white">&amp;</span> {b}
              {i < ANDS.length - 1 && (
                <span className="mx-3 text-black/30">/</span>
              )}
            </span>
          ))}
        </div>
      </Section>

      {/* Meet Bicycle */}
      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display text-4xl sm:text-5xl">Meet Bicycle</h2>
            <p className="mt-6 text-lg leading-relaxed text-black/70">
              Media planning and buying is in our DNA, but we like to think of
              ourselves as &lsquo;the newest version of the oldest model&rsquo;.
              We provide integrated solutions for the modern media world,
              traversing brand &amp; performance and creative &amp; media, driving
              sustainable growth for our clients.
            </p>
            <div className="mt-8">
              <ButtonLink href="/bicycle" variant="outline">
                Read more
              </ButtonLink>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-paper" />
        </div>
      </Section>

      {/* Services */}
      <Section tone="paper">
        <h2 className="display text-4xl sm:text-5xl">What we do</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-3xl bg-white p-8 ring-1 ring-black/5 transition hover:ring-brand"
            >
              <h3 className="font-display text-2xl font-extrabold uppercase">
                {s.label}
              </h3>
              <p className="mt-3 text-black/60">{s.blurb}</p>
              <span className="mt-6 inline-block text-sm font-semibold uppercase tracking-wide text-moss group-hover:text-brand-ink">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section tone="navy">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <h2 className="display max-w-2xl text-3xl sm:text-4xl">
            Want to understand how the power of &lsquo;and&rsquo; can
            revolutionise your marketing?
          </h2>
          <ButtonLink href="/contact-us" variant="primary" size="lg">
            Contact us
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
