import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { JsonLd } from "@/components/seo/json-ld";
import { NewsletterSignup } from "@/components/forms/newsletter-signup";
import { SlipstreamGrid } from "@/components/slipstream-grid";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allArticlesQuery } from "@/sanity/lib/queries";
import { collectionPageSchema } from "@/lib/schema";
import type { ArticleCard } from "@/sanity/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/slipstream" },
  title: "Slipstream",
  description:
    "Slipstream is Bicycle’s take on what’s moving in media, marketing and culture. Insights, opinion and the occasional provocation.",
};

export default async function SlipstreamPage() {
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
  ) as [string, string][];

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Slipstream by Bicycle London",
          path: "/slipstream",
          description:
            "Bicycle London's take on what is moving in media, marketing and culture.",
          items: articles.map((article) => ({
            name: article.title,
            path: `/slipstream/${article.slug}`,
            description: article.standfirst,
          })),
        })}
      />
      <PageHero
        eyebrow="Insights"
        title="Slipstream"
        lead="Our take on what’s moving in media, marketing and culture."
      />

      <Section>
        <Suspense fallback={null}>
          <SlipstreamGrid articles={articles} categories={categories} />
        </Suspense>
      </Section>

      <Section tone="paper">
        <NewsletterSignup />
      </Section>
    </>
  );
}
