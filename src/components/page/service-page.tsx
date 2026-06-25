import Image from "next/image";
import { PageHero } from "./page-hero";
import { CtaBand } from "./cta-band";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { LogoWall } from "@/components/logo-wall";
import { MuxVideo } from "@/components/mux-video";

export type ServicePoint = { title: string; body: string };
export type ServiceSection = { heading?: string; body: string[] };

export type ServiceContent = {
  eyebrow: string;
  title: string;
  heroImage?: string;
  logo?: string;
  featureImage?: string;
  lead?: string[];
  points?: ServicePoint[];
  badges?: { src: string; alt: string }[];
  videos?: { playbackId: string; title: string }[];
  sections?: ServiceSection[];
  cta?: { heading?: string; label?: string; href?: string };
};

export function ServicePage({ content }: { content: ServiceContent }) {
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        image={content.heroImage}
        logo={content.logo}
      />

      {content.lead && content.lead.length > 0 && (
        <Section tone="white">
          <Reveal>
            <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-black/75">
              {content.lead.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {content.featureImage && (
        <Container className="pb-4">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
              <Image
                src={content.featureImage}
                alt=""
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      )}

      {content.points && content.points.length > 0 && (
        <Section tone="paper">
          <div className="grid gap-6 md:grid-cols-3">
            {content.points.map((pt, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="h-full rounded-3xl bg-white p-8 ring-1 ring-black/5">
                  <span className="font-display text-4xl font-extrabold text-brand-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold uppercase">
                    {pt.title}
                  </h3>
                  <p className="mt-3 text-black/65">{pt.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {content.badges && content.badges.length > 0 && (
        <Section tone="white" className="!pt-0">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {content.badges.map((b) => (
                <Image
                  key={b.src}
                  src={b.src}
                  alt={b.alt}
                  width={120}
                  height={80}
                  className="h-14 w-auto object-contain sm:h-16"
                />
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {content.videos && content.videos.length > 0 && (
        <Section tone="navy">
          <Reveal>
            <h2 className="display text-3xl sm:text-4xl">Selected films</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {content.videos.map((v) => (
              <Reveal key={v.playbackId}>
                <MuxVideo playbackId={v.playbackId} title={v.title} />
                <p className="mt-3 font-display text-sm font-bold uppercase">
                  {v.title}
                </p>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {content.sections?.map((s, i) => (
        <Section key={i} tone={i % 2 === 0 ? "white" : "paper"}>
          <Reveal>
            <div className="mx-auto max-w-3xl">
              {s.heading && (
                <h2 className="display text-3xl sm:text-4xl">{s.heading}</h2>
              )}
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-black/75">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>
      ))}

      <Section tone="white">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-black/40">
            Trusted by ambitious brands
          </p>
        </Reveal>
        <div className="mt-10">
          <LogoWall />
        </div>
      </Section>

      <CtaBand
        heading={content.cta?.heading}
        label={content.cta?.label}
        href={content.cta?.href}
      />
    </>
  );
}
