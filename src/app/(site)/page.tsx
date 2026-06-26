import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { LogoWall } from "@/components/logo-wall";
import { MuxBg } from "@/components/mux-bg";
import { StatsBand } from "@/components/stats";
import { TeamStrip } from "@/components/team-strip";
import { GsapHeroHeading } from "@/components/gsap-hero-heading";
import { Parallax } from "@/components/scroll/parallax";
import { Marquee } from "@/components/scroll/marquee";
import { MaskReveal } from "@/components/scroll/mask-reveal";
import { MagneticButton } from "@/components/scroll/magnetic-button";
import { SERVICES } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { featuredCaseStudiesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyCard } from "@/sanity/lib/types";

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

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-55">
          <MuxBg
            playbackId="gfa01575PqXznaj7ADl84pYVnD6SkVZdwKRwg83regoQ"
            poster="/images/hero.jpg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-navy via-navy/85 to-electric/20" />
        {/* Playful thought-bubble, a nod to the original hero */}
        <div className="animate-floaty pointer-events-none absolute right-[7%] top-28 z-10 hidden lg:block">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl shadow-2xl">
            🍕
          </div>
          <div className="ml-2 mt-2 h-3.5 w-3.5 rounded-full bg-white/90" />
          <div className="ml-0.5 mt-1.5 h-2.5 w-2.5 rounded-full bg-white/70" />
        </div>
        <Parallax speed={-0.1} className="relative z-10 w-full">
          <Container className="pb-24 pt-36">
            <Reveal>
              <p className="mb-6 max-w-xl text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Independent integrated media and creative agency
              </p>
            </Reveal>
            <GsapHeroHeading />
            <Reveal delay={160}>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/work" variant="primary" size="lg">
                  See our work
                </ButtonLink>
                <ButtonLink href="/contact-us" variant="white" size="lg">
                  Contact us
                </ButtonLink>
              </div>
            </Reveal>
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

      {/* And marquee — steady, constant-speed scroll */}
      <Marquee
        direction={-1}
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
      <section className="bg-navy px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <MaskReveal
          className="display text-center text-[clamp(34px,7vw,92px)] leading-[1.08]"
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ink">
              Meet Bicycle
            </p>
            <h2 className="display mt-4 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              The newest version of the{" "}
              <span className="text-brand-ink">oldest model</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">
              Media planning and buying is in our DNA. We provide integrated
              solutions for the modern media world, traversing brand &amp;
              performance and creative &amp; media, driving sustainable growth
              for our clients.
            </p>
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-black/5">
                <Parallax speed={0.1} className="absolute inset-x-0 -inset-y-[10%]">
                  <Image
                    src="/images/meet-bicycle.jpg"
                    alt="Inside Bicycle London"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </Parallax>
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
            { value: 40, label: "People in the Peloton" },
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
              className="shrink-0 text-sm font-semibold uppercase tracking-wide text-moss hover:text-brand-ink"
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
          <h2 className="display mx-auto max-w-3xl text-center text-2xl sm:text-3xl">
            Bringing things together for ambitious brands since 2021
          </h2>
        </Reveal>
        <div className="mt-12">
          <LogoWall />
        </div>
      </Section>

      {/* What we do — alternating image/text rows (no pin) */}
      <Section tone="navy">
        <Reveal>
          <h2 className="display text-4xl sm:text-5xl">What we do</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            We don&rsquo;t have to do everything for every client. But when it all
            comes together, something special happens.
          </p>
        </Reveal>
        <div className="mt-12 space-y-8 lg:space-y-10">
          {SERVICES.map((s, i) => (
            <Reveal key={s.href} delay={i * 60}>
              <Link
                href={s.href}
                className="group grid items-stretch gap-6 overflow-hidden rounded-3xl ring-1 ring-white/10 transition hover:ring-brand lg:grid-cols-2"
              >
                <div
                  className={`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-tr from-deep via-navy to-electric/40 p-10 lg:aspect-auto ${
                    i % 2 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={s.logo}
                    alt={s.label}
                    width={280}
                    height={84}
                    className="max-h-16 w-auto object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center px-8 pb-8 lg:py-12">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="display text-3xl sm:text-4xl">{s.label}</h3>
                  <p className="mt-3 max-w-md text-lg text-white/70">{s.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-brand transition group-hover:gap-2">
                    Read more →
                  </span>
                </div>
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
