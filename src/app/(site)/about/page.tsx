import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { StatsBand } from "@/components/stats";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/scroll/parallax";

export const metadata: Metadata = {
  title: "About",
  description:
    "Founded in 2021, Bicycle is a fast-growing, 100% independent media and creative agency on a mission to leave the industry better than we found it.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="How it started"
        image="/images/heroes/about.jpg"
        videoPlaybackId="qXNeM1PbOwPYNR1uNZlaO01yGv5t2BJpYosjXoPHNkNk"
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-xl leading-relaxed text-black/80">
            Bicycle was founded in 2021 by four people who believed that a better
            type of media and comms agency wasn’t just possible, but needed.
          </p>
          <p className="mt-8 font-display text-sm font-semibold uppercase tracking-widest text-brand-ink">
            We set out:
          </p>
          <ul className="mt-4 space-y-4 text-lg text-black/75">
            <li className="border-l-2 border-brand pl-5">
              To leave the industry better than we found it.
            </li>
            <li className="border-l-2 border-brand pl-5">
              To create famous and impactful work, that you want to tell your mum
              about.
            </li>
            <li className="border-l-2 border-brand pl-5">
              And to make a living, and have fun doing it.
            </li>
          </ul>
        </div>
      </Section>

      <Container className="pb-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Parallax speed={0.16} className="absolute inset-x-0 -inset-y-[10%]">
            <Image
              src="/images/about-team.jpg"
              alt="The Bicycle team"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </Parallax>
        </div>
      </Container>

      <Section tone="paper">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <h2 className="display text-3xl sm:text-4xl">
              We believe that the bigger the gaps, the worse the work
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-black/75">
              That’s why we’re built on the power of ‘and’: creative &amp; media,
              brand strategy and performance, art and science, data and
              creativity, man and machine.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="display text-2xl sm:text-3xl">
            Three years on, Bicycle is now one of the fastest-growing agencies in
            the UK, with a headcount of 40.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-black/75">
            Our headquarters are in Clerkenwell, London and we have fully global
            capabilities in-house. We’re home to curious, intelligent and lovely
            people who want to create incredible work on interesting brands. We
            are 100% independent, with no external investment whatsoever. And
            we’re going to change what you thought it was possible for a modern
            agency to be.
          </p>
          <div className="mt-8">
            <ButtonLink href="/the-peloton" variant="outline">
              Meet the Peloton
            </ButtonLink>
          </div>
        </div>
      </Section>

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

      <CtaBand />
    </>
  );
}
