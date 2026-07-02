import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { PortableText } from "@/components/portable-text";
import { ArticleByline } from "@/components/article-byline";
import { NewsletterSignup } from "@/components/forms/newsletter-signup";
import { JsonLd } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import { articleBySlugQuery, articleSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { articleSchema, breadcrumb } from "@/lib/schema";
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
  const img = a.seo?.ogImage?.asset
    ? urlFor(a.seo.ogImage).width(1200).height(630).url()
    : a.heroImage?.asset
      ? urlFor(a.heroImage).width(1200).height(630).url()
      : undefined;
  return {
    title: a.seo?.metaTitle || a.title,
    description: a.seo?.metaDescription || a.standfirst,
    alternates: { canonical: `/slipstream/${a.slug}` },
    ...(a.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      url: `/slipstream/${a.slug}`,
      title: a.title,
      description: a.standfirst,
      images: img ? [img] : undefined,
    },
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
      <JsonLd
        data={articleSchema({
          title: a.title,
          slug: a.slug,
          standfirst: a.standfirst,
          publishedAt: a.publishedAt,
          authorName: a.author?.name,
          image: heroUrl,
        })}
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Slipstream", path: "/slipstream" },
          { name: a.title, path: `/slipstream/${a.slug}` },
        ])}
      />
      <PageHero
        eyebrow={a.category?.title || "Slipstream"}
        title={a.title}
        lead={a.standfirst}
        image={heroUrl}
      />

      <Section>
        <article className="mx-auto max-w-3xl">
          <Link
            href="/slipstream"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-ink transition hover:text-ink"
          >
            <span
              aria-hidden
              className="transition-transform group-hover:-translate-x-1"
            >
              ←
            </span>
            Back to Slipstream
          </Link>
          {a.author ? (
            <ArticleByline author={a.author} date={date} />
          ) : (
            date && <p className="mb-8 text-sm text-black/50">{date}</p>
          )}
          <PortableText value={a.body} />
        </article>
      </Section>

      <Section tone="paper">
        <div className="mx-auto max-w-3xl">
          <NewsletterSignup />
        </div>
      </Section>

      <CtaBand
        heading="Got a brief, a question, or just want to chat?"
        label="Chat to us"
        href="/contact-us"
      />
    </>
  );
}
