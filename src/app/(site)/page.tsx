import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/page/cta-band";
import { Reveal } from "@/components/reveal";
import { LogoWall } from "@/components/logo-wall";
import { MuxBg } from "@/components/mux-bg";
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
        <Container className="relative z-10 pb-24 pt-36">
          <Reveal>
            <p className="mb-6 max-w-xl text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Independent integrated media and creative agency
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display text-6xl sm:text-7xl lg:text-[7.5rem]">
              Built on the
              <br />
              power of <span className="text-brand">and</span>
            </h1>
          </Reveal>
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

      {/* And marquee */}
      <div className="marquee group overflow-hidden bg-brand py-5 text-black">
        <div
          className="marquee-track flex w-max items-center gap-2"
          style={{ ["--marquee-duration" as string]: "30s" }}
        >
          {[...ANDS, ...ANDS, ...ANDS].map(([a, b], i) => (
            <span
              key={i}
              className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
            >
              {a} <span className="text-white">&amp;</span> {b}
              <span className="mx-6 text-black/30">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Meet Bicycle */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="display text-4xl sm:text-5xl">Meet Bicycle</h2>
              <p className="mt-6 text-lg leading-relaxed text-black/70">
                Media planning and buying is in our DNA, but we like to think of
                ourselves as &lsquo;the newest version of the oldest model&rsquo;.
                We provide integrated solutions for the modern media world,
                traversing brand &amp; performance and creative &amp; media,
                driving sustainable growth for our clients.
              </p>
              <div className="mt-8">
                <ButtonLink href="/bicycle" variant="outline">
                  Read more
                </ButtonLink>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/meet-bicycle.jpg"
                alt="Inside Bicycle London"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
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

      {/* Services */}
      <Section>
        <Reveal>
          <h2 className="display text-4xl sm:text-5xl">What we do</h2>
          <p className="mt-4 max-w-2xl text-lg text-black/60">
            We don&rsquo;t have to do everything for every client. But when it all
            comes together, something special happens.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.href} delay={i * 70}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-3xl bg-paper p-8 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:ring-brand"
              >
                <h3 className="font-display text-2xl font-extrabold uppercase">
                  {s.label}
                </h3>
                <p className="mt-3 flex-1 text-black/60">{s.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-moss transition group-hover:gap-2 group-hover:text-brand-ink">
                  Read more →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Selected work */}
      {featured.length > 0 && (
        <Section tone="navy">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-4xl sm:text-5xl">Selected work</h2>
            <Link
              href="/work"
              className="shrink-0 text-sm font-semibold uppercase tracking-wide text-brand hover:text-white"
            >
              All work →
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featured.map((cs) => (
              <Link key={cs._id} href={`/work/${cs.slug}`} className="group block">
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
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
