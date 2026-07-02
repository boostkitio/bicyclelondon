import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/page/cta-band";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PortableText } from "@/components/portable-text";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { MuxVideo } from "@/components/mux-video";
import { CountUp } from "@/components/count-up";
import { MaskReveal } from "@/components/scroll/mask-reveal";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import { caseStudyBySlugQuery, caseStudySlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { breadcrumb } from "@/lib/schema";
import type { CaseStudy } from "@/sanity/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: caseStudySlugsQuery,
    revalidate: 3600,
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await sanityFetch<CaseStudy | null>({
    query: caseStudyBySlugQuery,
    params: { slug },
  });
  if (!cs) return {};
  const img = cs.seo?.ogImage?.asset
    ? urlFor(cs.seo.ogImage).width(1200).height(630).url()
    : cs.heroImage?.asset
      ? urlFor(cs.heroImage).width(1200).height(630).url()
      : undefined;
  return {
    title: cs.seo?.metaTitle || `${cs.title} | Work`,
    description: cs.seo?.metaDescription || cs.standfirst,
    alternates: { canonical: `/work/${cs.slug}` },
    ...(cs.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      url: `/work/${cs.slug}`,
      title: cs.title,
      description: cs.standfirst,
      images: img ? [img] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await sanityFetch<CaseStudy | null>({
    query: caseStudyBySlugQuery,
    params: { slug },
    tags: ["caseStudy"],
  });
  if (!cs) notFound();

  const heroUrl = cs.heroImage?.asset
    ? urlFor(cs.heroImage).width(2000).height(1120).url()
    : undefined;
  const client = cs.client?.name || cs.clientName;

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: cs.title, path: `/work/${cs.slug}` },
        ])}
      />

      {/* Hero — image-led, the campaign does the talking */}
      <section className="relative isolate flex min-h-[80vh] items-end overflow-hidden bg-navy text-white">
        {heroUrl ? (
          <>
            <Image
              src={heroUrl}
              alt={cs.heroImage?.alt || cs.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/65 to-navy/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-navy to-electric/30" />
        )}
        <Container className="relative z-10 pb-16 pt-44">
          {client && client !== cs.title && (
            <p className="label mb-5 flex items-center gap-2.5 text-brand">
              <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              {client}
            </p>
          )}
          <MaskReveal
            as="h1"
            className="display max-w-4xl text-5xl sm:text-6xl lg:text-7xl"
            lines={[cs.title]}
          />
          {cs.standfirst && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              {cs.standfirst}
            </p>
          )}
          {cs.services && cs.services.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {cs.services.map((s) => (
                <li
                  key={s}
                  className="label rounded-full border border-white/30 px-4 py-1.5 text-white/85"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* Results — bold proof, the first thing after the campaign */}
      {cs.results && cs.results.length > 0 && (
        <section className="bg-brand text-black">
          <Container className="py-12 sm:py-16">
            <div className="grid gap-10 sm:grid-cols-3">
              {cs.results.map((r, i) => {
                // Pull a leading integer out so it can count up; decimals/units
                // ride along in the suffix and still render correctly.
                const m = /^([^\d]*)(\d[\d,]*)(.*)$/.exec(r.metric ?? "");
                return (
                  <div key={i} className="border-t-2 border-black/25 pt-5">
                    <p className="display text-5xl leading-none sm:text-6xl lg:text-7xl">
                      {m ? (
                        <CountUp
                          to={parseInt(m[2].replace(/,/g, ""), 10)}
                          prefix={m[1]}
                          suffix={m[3]}
                        />
                      ) : (
                        r.metric
                      )}
                    </p>
                    <p className="label mt-4 text-black/70">{r.label}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* The story — editorial long-read */}
      <Section>
        <div className="mx-auto max-w-2xl">
          <PortableText value={cs.body} />
        </div>

        {cs.videoPlaybackId && (
          <Reveal className="mx-auto mt-16 max-w-5xl">
            <MuxVideo playbackId={cs.videoPlaybackId} title={cs.title} />
          </Reveal>
        )}

        {cs.gallery && cs.gallery.length > 0 && (
          <div className="mx-auto mt-20 max-w-5xl">
            <h2 className="display mb-8 text-2xl sm:text-3xl">The work</h2>
            <GalleryLightbox
              images={cs.gallery.filter((img) => img.asset)}
              title={cs.title}
            />
          </div>
        )}

        <div className="mx-auto mt-16 max-w-5xl">
          <Link
            href="/work"
            className="label inline-flex items-center gap-2 text-navy transition hover:gap-3 hover:text-brand-ink"
          >
            <span aria-hidden>←</span> All work
          </Link>
        </div>
      </Section>

      <CtaBand label="Start a project" />
    </>
  );
}
