import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { NewsletterSignup } from "@/components/forms/newsletter-signup";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allArticlesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ArticleCard } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Slipstream",
  description:
    "Slipstream is Bicycle’s take on what’s moving in media, marketing and culture. Insights, opinion and the occasional provocation.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function SlipstreamPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const articles = await sanityFetch<ArticleCard[]>({
    query: allArticlesQuery,
    tags: ["slipstreamArticle"],
  });

  const categories = Array.from(
    new Map(
      articles
        .filter((a) => a.category && a.categorySlug)
        .map((a) => [a.categorySlug, a.category as string]),
    ).entries(),
  );

  const filtered = category
    ? articles.filter((a) => a.categorySlug === category)
    : articles;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Slipstream"
        lead="Our take on what’s moving in media, marketing and culture."
      />

      <Section>
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Link
              href="/slipstream"
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition",
                !category ? "bg-navy text-white" : "bg-paper text-black/70 hover:bg-black/5",
              )}
            >
              All
            </Link>
            {categories.map(([slug, title]) => (
              <Link
                key={slug}
                href={`/slipstream?category=${slug}`}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition",
                  category === slug
                    ? "bg-navy text-white"
                    : "bg-paper text-black/70 hover:bg-black/5",
                )}
              >
                {title}
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-black/50">
            New thinking is on its way. Check back soon.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a._id}
                href={`/slipstream/${a.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-paper ring-1 ring-black/5 transition hover:ring-brand"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-navy">
                  {a.heroImage?.asset && (
                    <Image
                      src={urlFor(a.heroImage).width(700).height(467).url()}
                      alt={a.heroImage.alt || a.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {a.category && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink">
                      {a.category}
                    </p>
                  )}
                  <h2 className="mt-2 font-display text-xl font-bold uppercase leading-tight">
                    {a.title}
                  </h2>
                  {a.standfirst && (
                    <p className="mt-2 line-clamp-3 text-sm text-black/60">
                      {a.standfirst}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section tone="paper">
        <NewsletterSignup />
      </Section>
    </>
  );
}
