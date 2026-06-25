import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { PortableText } from "@/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { articleBySlugQuery, articleSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SITE } from "@/lib/site";
import type { Article } from "@/sanity/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: articleSlugsQuery,
    revalidate: 3600,
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await sanityFetch<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
  });
  if (!a) return {};
  return {
    title: a.seo?.metaTitle || a.title,
    description: a.seo?.metaDescription || a.standfirst,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await sanityFetch<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
    tags: ["slipstreamArticle"],
  });
  if (!a) notFound();

  const heroUrl = a.heroImage?.asset
    ? urlFor(a.heroImage).width(1905).height(900).url()
    : undefined;

  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <>
      <PageHero
        eyebrow={a.category?.title || "Slipstream"}
        title={a.title}
        lead={a.standfirst}
        image={heroUrl}
      />

      <Section>
        <article className="mx-auto max-w-3xl">
          {(a.author?.name || date) && (
            <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/50">
              {a.author?.name && (
                <span className="font-semibold text-ink">{a.author.name}</span>
              )}
              {a.author?.role && <span>· {a.author.role}</span>}
              {date && <span>· {date}</span>}
            </div>
          )}
          <PortableText value={a.body} />
        </article>
      </Section>

      <CtaBand
        heading="Enjoyed this? Get the Slipstream in your inbox."
        label="Subscribe"
        href={SITE.social.substack}
      />
    </>
  );
}
