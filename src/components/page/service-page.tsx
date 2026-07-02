import Image from "next/image";
import { CtaBand } from "./cta-band";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { LogoWall } from "@/components/logo-wall";
import { MuxVideo } from "@/components/mux-video";
import { MuxBg } from "@/components/mux-bg";
import { BicycleEcosystem } from "@/components/bicycle-ecosystem";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceSchema } from "@/lib/schema";

export type ServicePoint = { title: string; body: string };
export type ServiceSection = { heading?: string; body: string[] };

export type ServiceContent = {
  eyebrow: string;
  title: string;
  // Sub-brand accent. Approximate values pending the exact brand hexes.
  accent?: string;
  heroImage?: string;
  heroVideoPlaybackId?: string;
  logo?: string;
  path: string;
  featureImage?: string;
  lead?: string[];
  points?: ServicePoint[];
  badges?: { src: string; alt: string }[];
  brands?: { heading: string; logos: { src: string; alt: string }[] };
  ecosystem?: boolean;
  videos?: { playbackId: string; title: string }[];
  sections?: ServiceSection[];
  cta?: { heading?: string; label?: string; href?: string };
};

export function ServicePage({ content }: { content: ServiceContent }) {
  const accent = content.accent ?? "#00d400";
  return (
    <div style={{ ["--accent" as string]: accent }}>
      <JsonLd
        data={serviceSchema({
          name: content.title,
          path: content.path,
          description: content.lead?.[0] || content.sections?.[0]?.body[0],
        })}
      />
      {/* Cinematic, colour-led hero: full-bleed film-still, the unit's colour
          glowing in, its logo lockup as the identity. */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-deep text-white">
        {content.heroVideoPlaybackId ? (
          <div className="absolute inset-0 opacity-90">
            <MuxBg
              playbackId={content.heroVideoPlaybackId}
              poster={content.heroImage}
            />
          </div>
        ) : content.heroImage ? (
          <Image
            src={content.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/55 to-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/25 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 bottom-[-6rem] h-[28rem] w-[28rem] rounded-full opacity-25 blur-[130px]"
          style={{ background: "var(--accent)" }}
        />
        <Container className="relative z-10 pb-20 pt-40 sm:pb-24">
          <p
            className="label mb-7 flex items-center gap-2.5"
            style={{ color: "var(--accent)" }}
          >
            <span
              className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            {content.eyebrow}
          </p>
          {content.logo ? (
            <>
              <Image
                src={content.logo}
                alt={content.title}
                width={560}
                height={168}
                priority
                className="h-24 w-auto max-w-[80vw] object-contain sm:h-32 lg:h-36"
              />
              <h1 className="sr-only">{content.title}</h1>
            </>
          ) : (
            <h1
              className="display text-5xl sm:text-6xl lg:text-7xl"
              style={{ color: "var(--accent)" }}
            >
              {content.title}
            </h1>
          )}
        </Container>
      </section>

      {(content.lead?.length || content.featureImage) && (
        <Section tone="white">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {content.lead?.length ? (
              <Reveal>
                <div className="space-y-6 text-lg leading-relaxed text-black/75">
                  {content.lead.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>
            ) : (
              <div />
            )}
            {content.featureImage && (
              <Reveal delay={120}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={content.featureImage}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      {content.points && content.points.length > 0 && (
        <Section tone="navy">
          <div className="grid gap-6 md:grid-cols-3">
            {content.points.map((pt, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="h-full rounded-3xl bg-white/[0.04] p-8 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                  <span
                    className="block h-1.5 w-10 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <h3 className="mt-6 font-display text-xl font-bold uppercase text-white">
                    {pt.title}
                  </h3>
                  <p className="mt-3 text-white/65">{pt.body}</p>
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

      {content.ecosystem && <BicycleEcosystem />}

      {content.brands && content.brands.logos.length > 0 && (
        <Section tone="paper">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-base font-medium text-black/55">
              {content.brands.heading}
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
            {content.brands.logos.map((b) => (
              <div key={b.src} className="group flex items-center justify-center">
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={220}
                  height={120}
                  className="h-20 w-auto max-w-full object-contain transition duration-300 ease-out group-hover:scale-105 sm:h-24"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.videos && content.videos.length > 0 && (
        <Section tone="navy">
          <Reveal>
            <h2 className="display inline-block text-3xl sm:text-4xl">
              Selected films
              <span
                className="mt-3 block h-1 w-16 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            </h2>
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
          <p className="label text-center text-black/40">
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
    </div>
  );
}
