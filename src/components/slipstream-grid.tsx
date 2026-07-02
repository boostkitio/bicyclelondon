"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ArticleCard } from "@/sanity/lib/types";

/**
 * Category chips + article grid, filtered client-side from the URL's
 * ?category= param. Keeping searchParams out of the server component lets
 * the whole /slipstream route render statically.
 */
export function SlipstreamGrid({
  articles,
  categories,
}: {
  articles: ArticleCard[];
  categories: [string, string][];
}) {
  const category = useSearchParams().get("category");

  const filtered = category
    ? articles.filter((a) => a.categorySlug === category)
    : articles;

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/slipstream"
            scroll={false}
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
              scroll={false}
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
        <div className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Reveal key={a._id} delay={(i % 3) * 80} className="flex">
            <Link
              href={`/slipstream/${a.slug}`}
              className="group flex flex-1 flex-col overflow-hidden rounded-3xl bg-paper ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10 hover:ring-brand"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-navy">
                {a.heroImage?.asset ? (
                  <Image
                    src={urlFor(a.heroImage).width(700).height(467).url()}
                    alt={a.heroImage.alt || a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy to-electric p-6 transition duration-500 group-hover:scale-105">
                    <span className="text-center font-display text-2xl font-extrabold uppercase leading-tight text-brand">
                      {a.category || "Slipstream"}
                    </span>
                  </div>
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
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
