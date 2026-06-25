import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { PortableText } from "@/components/portable-text";
import { MuxVideo } from "@/components/mux-video";
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
  const img = cs.heroImage?.asset
    ? urlFor(cs.heroImage).width(1200).height(630).url()
    : undefined;
  return {
    title: cs.seo?.metaTitle || `${cs.title} | Work`,
    description: cs.seo?.metaDescription || cs.standfirst,
    openGraph: {
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
    ? urlFor(cs.heroImage).width(1905).height(900).url()
    : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: cs.title, path: `/work/${cs.slug}` },
        ])}
      />
      <PageHero
        eyebrow={cs.client?.name || cs.clientName}
        title={cs.title}
        lead={cs.standfirst}
        image={heroUrl}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {cs.services && cs.services.length > 0 && (
            <ul className="mb-10 flex flex-wrap gap-2">
              {cs.services.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-paper px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-black/70"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}

          {cs.results && cs.results.length > 0 && (
            <div className="mb-12 grid gap-6 rounded-3xl bg-navy p-8 text-white sm:grid-cols-3">
              {cs.results.map((r, i) => (
                <div key={i}>
                  <p className="font-display text-4xl font-extrabold text-brand">
                    {r.metric}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{r.label}</p>
                </div>
              ))}
            </div>
          )}

          <PortableText value={cs.body} />
        </div>

        {cs.videoPlaybackId && (
          <div className="mx-auto mt-14 max-w-5xl">
            <MuxVideo playbackId={cs.videoPlaybackId} title={cs.title} />
          </div>
        )}

        {cs.gallery && cs.gallery.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl">
            <p className="mb-6 text-center font-display text-sm font-semibold uppercase tracking-widest text-black/40">
              The work
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {cs.gallery.map((img, i) =>
                img.asset ? (
                  <div
                    key={i}
                    className="group overflow-hidden rounded-2xl bg-paper"
                  >
                    <Image
                      src={urlFor(img).width(1000).height(700).url()}
                      alt={img.alt || cs.title}
                      width={1000}
                      height={700}
                      className="h-auto w-full transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )}
      </Section>

      <CtaBand label="Start a project" />
    </>
  );
}
