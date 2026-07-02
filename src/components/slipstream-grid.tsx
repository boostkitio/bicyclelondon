"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ArticleCard } from "@/sanity/lib/types";

/**
 * Category chips + an editorial article index: the first (latest) piece runs
 * large as a featured lead, the rest below in a grid. Filtered client-side
 * from the URL's ?category= param so the whole route stays static.
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

  const [lead, ...rest] = filtered;

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-12 flex flex-wrap gap-2">
          <Link
            href="/slipstream"
            scroll={false}
            className={cn(
              "label rounded-full px-4 py-2 transition",
              !category ? "bg-navy text-white" : "bg-paper text-black/60 hover:bg-black/5",
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
                "label rounded-full px-4 py-2 transition",
                category === slug
                  ? "bg-navy text-white"
                  : "bg-paper text-black/60 hover:bg-black/5",
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
        <>
          {lead && (
            <Reveal>
              <Link
                href={`/slipstream/${lead.slug}`}
                className="group mb-16 grid items-center gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-14"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-navy">
                  {lead.heroImage?.asset ? (
                    <Image
                      src={urlFor(lead.heroImage).width(1100).height(690).url()}
                      alt={lead.heroImage.alt || lead.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy to-electric p-8">
                      <span className="text-center font-display text-3xl font-extrabold uppercase leading-tight text-brand">
                        {lead.category || "Slipstream"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="label flex items-center gap-2.5 text-brand-ink">
                    <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-ink" />
                    Latest{lead.category ? ` · ${lead.category}` : ""}
                  </p>
                  <h2 className="display mt-5 text-3xl leading-[0.98] transition-colors group-hover:text-brand-ink sm:text-4xl lg:text-5xl">
                    {lead.title}
                  </h2>
                  {lead.standfirst && (
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-black/65">
                      {lead.standfirst}
                    </p>
                  )}
                  <span className="label mt-8 inline-flex items-center gap-1.5 text-navy transition-all group-hover:gap-3 group-hover:text-brand-ink">
                    Read the piece <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
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
                        <p className="label text-brand-ink">{a.category}</p>
                      )}
                      <h2 className="mt-2.5 font-display text-xl font-bold uppercase leading-tight">
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
      )}
    </>
  );
}
