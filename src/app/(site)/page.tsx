import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/grain";
import { MuxBg } from "@/components/mux-bg";
import { ScrollFillText } from "@/components/scroll/scroll-fill-text";
import { CardArrow } from "@/components/card-arrow";
import { LogoWall } from "@/components/logo-wall";
import { StatsBand } from "@/components/stats";
import { TeamStrip } from "@/components/team-strip";
import { HeroFusion } from "@/components/hero-fusion";
import { Parallax } from "@/components/scroll/parallax";
import { Marquee } from "@/components/scroll/marquee";
import { MaskReveal } from "@/components/scroll/mask-reveal";
import { MagneticButton } from "@/components/scroll/magnetic-button";
import { SERVICES } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { featuredCaseStudiesQuery, testimonialsQuery } from "@/sanity/lib/queries";
import { Testimonials } from "@/components/testimonials";
import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyCard, Testimonial } from "@/sanity/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const ANDS: [string, string][] = [
  ["Media", "Creative"],
  ["Art", "Science"],
  ["Brand", "Performance"],
  ["Data", "Digital"],
  ["Man", "Machine"],
];

export default async function HomePage() {
  const featured = await sanityFetch<CaseStudyCard[]>({
    query: featuredCaseStudiesQuery,
    tags: ["caseStudy"],
  });
  const testimonials = await sanityFetch<Testimonial[]>({
    query: testimonialsQuery,
    tags: ["testimonial"],
  });

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-90">
          <MuxBg
            playbackId="LYb6h3tgB02iK4jDAAbbuQ7I00F00Vj018vNnxaML3EOR3I"
            poster="/images/hero.jpg"
          />
        </div>
        {/* Dark enough under the headline to stay readable, clear on the right
            so the film shows through like the original. */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        <Parallax speed={-0.1} className="relative z-10 w-full">
          <Container className="pb-24 pt-36">
            <p className="label mb-7 flex items-center gap-2.5 text-white/75">
              <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-brand" />
              Independent · integrated · media &amp; creative
            </p>
            <HeroFusion />
            <div className="-ml-6 mt-10 flex flex-wrap items-center">
              <MagneticButton
                href="/work"
                className="rounded-full bg-brand px-9 py-4 font-display text-base font-bold uppercase tracking-wide text-black"
              >
                See our work
              </MagneticButton>
              <MagneticButton
                href="/contact-us"
                strength={0.3}
                className="rounded-full bg-white px-9 py-4 font-display text-base font-bold uppercase tracking-wide text-ink"
              >
                Start a project
              </MagneticButton>
            </div>
          </Container>
        </Parallax>
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-brand">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="animate-floaty"
          >
            <path d="M12 4v16M6 14l6 6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {/* And marquee — cruises steadily, surges with scroll velocity */}
      <Marquee
        direction={-1}
        velocity
        className="bg-brand py-5 text-black"
        items={[...ANDS, ...ANDS, ...ANDS].flatMap(([a, b], i) => [
          <span
            key={`w${i}`}
            className="font-display px-7 text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
          >
            {a} <span className="text-white">&amp;</span> {b}
          </span>,
          <span key={`s${i}`} className="text-2xl font-extrabold text-black/30">
            /
          </span>,
        ])}
      />

      {/* Power of AND — static stacked statement (no scroll hijack) */}
      <section className="relative overflow-hidden bg-navy px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <Grain />
        <MaskReveal
          className="relative display text-center text-[clamp(34px,7vw,92px)] leading-[1.08]"
          lines={ANDS.map(([a, b]) => (
            <>
              {a} <span className="text-brand">&amp;</span> {b}
            </>
          ))}
        />
      </section>

      {/* Meet Bicycle */}
      <Section className="overflow-hidden">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="label flex items-center gap-2.5 text-brand-ink">
              <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-ink" />
              Meet Bicycle
            </p>
            <h2 className="display mt-5 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              The newest version of the{" "}
              <span className="text-brand-ink">oldest model</span>
            </h2>
            <ScrollFillText
              as="p"
              className="mt-6 max-w-md text-lg leading-relaxed text-navy"
            >
              Media planning and buying is in our DNA. We provide integrated
              solutions for the modern media world, traversing brand &
              performance and creative & media, driving sustainable growth for
              our clients.
            </ScrollFillText>
            <div className="mt-8">
              <ButtonLink href="/bicycle" variant="outline">
                Read more
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative">
              {/* offset green accent block peeking behind the image */}
              <div
                className="absolute -right-3 -top-3 hidden h-full w-full rounded-[2rem] bg-brand sm:block"
                aria-hidden
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-navy ring-1 ring-black/5">
                <MuxBg
                  playbackId="WDsLxmnXnnOWsnrHXkXDz8wyYCxOdLX9KcN8BuGGm1g"
                  poster="/images/work-hero-poster.jpg"
                />
              </div>
              {/* playful rotated badge breaking the frame */}
              <div className="absolute -bottom-5 left-6 rotate-[-5deg] rounded-full bg-navy px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-brand shadow-xl">
                Independent since 2021
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Stats */}
      <Section tone="navy">
        <StatsBand
          stats={[
            { value: 63, label: "People in the Peloton" },
            { value: 40, prefix: "$", suffix: "m+", label: "International media handled" },
            { value: 100, suffix: "%", label: "Independent" },
            { value: 2021, count: false, label: "Founded" },
          ]}
        />
      </Section>

      {/* Culture */}
      <Section tone="white">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="display text-3xl sm:text-4xl">The Peloton</h2>
              <p className="mt-3 max-w-xl text-black/60">
                Curious, intelligent and lovely people who want to create
                incredible work on interesting brands.
              </p>
            </div>
            <Link
              href="/the-peloton"
              className="shrink-0 text-sm font-semibold uppercase tracking-wide text-navy hover:text-brand-ink"
            >
              Meet the team →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10">
          <TeamStrip />
        </div>
      </Section>

      {/* Logo wall */}
      <Section tone="paper">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="label mb-4 inline-flex items-center gap-2.5 text-navy/55">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-ink animate-pulse-dot" />
              In good company
            </span>
            <h2 className="display text-2xl sm:text-3xl">
              Bringing things together for ambitious brands since 2021
            </h2>
          </div>
        </Reveal>
        <div className="mt-12">
          <LogoWall />
        </div>
      </Section>

      {/* What we do — big-type index, each unit in its own sub-brand colour */}
      <Section tone="navy">
        <Reveal>
          <h2 className="display text-4xl sm:text-5xl">What we do</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            We don&rsquo;t have to do everything for every client. But when it all
            comes together, something special happens.
          </p>
        </Reveal>
        <div className="mt-14 border-t border-white/12">
          {SERVICES.map((s, i) => (
            <Reveal key={s.href} delay={i * 50}>
              <Link
                href={s.href}
                className="group relative flex items-center gap-5 overflow-hidden border-b border-white/12 py-8 sm:gap-8 sm:py-11"
                style={{ ["--accent" as string]: s.accent }}
              >
                {/* the unit's colour washes in on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.09]"
                  style={{ background: "var(--accent)" }}
                />
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-1.5 origin-top scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
                  style={{ background: "var(--accent)" }}
                />
                <div className="relative flex-1 pl-5 sm:pl-9">
                  <div className="label mb-2.5" style={{ color: "var(--accent)" }}>
                    {s.blurb}
                  </div>
                  <h3 className="display text-[clamp(1.75rem,7vw,2.5rem)] leading-[0.9] transition-colors duration-300 group-hover:[color:var(--accent)] sm:text-6xl lg:text-[5rem]">
                    {s.label}
                  </h3>
                </div>
                <Image
                  src={s.logo}
                  alt=""
                  width={220}
                  height={66}
                  className="relative hidden h-9 w-auto max-w-[8.5rem] shrink-0 object-contain opacity-55 transition duration-500 group-hover:opacity-100 sm:block lg:h-11"
                />
                <span
                  aria-hidden
                  className="relative shrink-0 pr-1 text-3xl transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl"
                  style={{ color: "var(--accent)" }}
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Selected work — grid (no pin) */}
      {featured.length > 0 && (
        <Section tone="navy" className="!pt-0">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <h2 className="display text-4xl sm:text-5xl">Selected work</h2>
              <Link
                href="/work"
                className="shrink-0 text-sm font-semibold uppercase tracking-wide text-brand hover:text-white"
              >
                All work →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featured.map((cs, i) => (
              <Reveal key={cs._id} delay={i * 70}>
                <Link href={`/work/${cs.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
                    {cs.heroImage?.asset && (
                      <Image
                        src={urlFor(cs.heroImage).width(700).height(525).url()}
                        alt={cs.heroImage.alt || cs.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <CardArrow />
                  </div>
                  {cs.clientName && (
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand">
                      {cs.clientName}
                    </p>
                  )}
                  <h3 className="mt-1 font-display text-xl font-bold uppercase">
                    {cs.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Testimonials — stacked cards */}
      {testimonials.length > 0 && (
        <Section tone="paper">
          <Reveal className="mb-12 text-center">
            <p className="label mb-4 justify-center text-brand-ink">
              In their words
            </p>
            <h2 className="display text-4xl sm:text-5xl">
              The people we ride with
            </h2>
          </Reveal>
          <Testimonials items={testimonials} />
        </Section>
      )}

      {/* CTA — magnetic */}
      <section className="overflow-hidden bg-brand px-5 py-24 text-center text-black sm:px-8 sm:py-32">
        <h2 className="display mx-auto max-w-4xl text-4xl sm:text-6xl">
          Let&rsquo;s build something &amp;
        </h2>
        <div className="mt-10">
          <MagneticButton href="/contact-us">Start a project</MagneticButton>
        </div>
      </section>
    </>
  );
}
