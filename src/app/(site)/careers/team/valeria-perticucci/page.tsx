import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/avatar";

export const metadata: Metadata = {
  title: "Valeria Perticucci, Peloton Success Manager",
  description:
    "\"I'm an international mess\" - that's how I like to introduce myself. Valeria's story, from our People team.",
};

export default function ValeriaPerticucciPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers · Meet the Peloton"
        title="Valeria Perticucci"
        lead="Peloton Success Manager, People Team"
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-[220px_1fr]">
          <div className="w-40 md:w-full">
            <Avatar
              src="/team/valeria-perticucci.png"
              name="Valeria Perticucci"
              initials="VP"
            />
          </div>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-black/75">
            <p>
              &ldquo;I&apos;m an international mess&rdquo; &ndash; that&apos;s
              how I like to introduce myself. A proud Third Culture Kid,
              I&apos;ve lived across Germany, the UK, the Netherlands,
              Luxembourg and the US, shaped by a Belgian mother and an Italian
              and American father. I&apos;m the eldest of four, which means
              I&apos;ve always been the sensible one &ndash; reserved,
              studious and quietly observant.
            </p>
            <p>
              After studying Psychology &amp; Biology at the University of
              Exeter (with a year abroad at Texas State), I started my career
              in early careers during the pandemic, helping others navigate
              the chaos of early adulthood. I&apos;ve worked mostly in tech,
              supporting career-switchers and first-timers, before joining
              Bicycle in September. Media is still a new playground for me.
            </p>
            <p>
              I&apos;m an introverted extrovert who discovered at uni that my
              love for going out was really a love for music. Festivals are
              my happy place (especially electronic ones), though I&apos;ve
              got a soft spot for R&amp;B and soul too. Most of my annual
              leave is spent chasing music across borders.
            </p>
            <p>
              Running has become my anchor, a space where I find discipline,
              clarity and movement. If someone ever asks me &lsquo;when do you
              feel most alive&rsquo;, I&apos;ll say race day. I can easily run
              a half marathon with zero headphones, just full vibes.
            </p>
            <p>
              I&apos;m passionate about psychology, self-development and,
              lately, spirituality and wellness. I prefer deep conversations
              over small talk, and I&apos;ve had my own journey with anxiety,
              depression and SAD &ndash; so if I seem extra sunny in summer,
              now you know why.
            </p>
            <p className="font-semibold text-black/60">
              Val / Valpal / Valeria x
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        heading="Like the sound of the Peloton? See our open roles."
        label="View open roles"
        href="/careers"
      />
    </>
  );
}
