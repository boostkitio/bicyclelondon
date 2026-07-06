"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ArticleCard } from "@/sanity/lib/types";

// Broken editorial rhythm for the article index: lopsided pairs whose big side
// alternates, then an equal pair, with staggered drops. Rows resolve to 7+5,
// 5+7, 6+6 so nothing lines up into a uniform card grid. Loops for any count.
const VARIANTS = [
  { span: "md:col-span-7", aspect: "aspect-[16/10]", drop: "", big: true },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", drop: "md:mt-16", big: false },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", drop: "", big: false },
  { span: "md:col-span-7", aspect: "aspect-[16/10]", drop: "md:mt-16", big: true },
  { span: "md:col-span-6", aspect: "aspect-[3/2]", drop: "", big: false },
  { span: "md:col-span-6", aspect: "aspect-[3/2]", drop: "md:mt-16", big: false },
] as const;

/**
 * Category chips + an editorial article index: the latest piece runs as a
 * full-bleed showcase with its title and standfirst over the image, the rest
 * below in a broken, staggered grid. Filtered client-side from the URL's
 * ?category= param so the whole route stays static.
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
                data-cursor="View"
                className="group relative mb-16 block overflow-hidden rounded-[2rem] bg-navy lg:mb-24"
              >
                <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9]">
                  {lead.heroImage?.asset ? (
                    <Image
                      src={urlFor(lead.heroImage).width(1800).url()}
                      alt={lead.heroImage.alt || lead.title}
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-electric" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                  <p className="label flex items-center gap-2.5 text-brand">
                    <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                    Latest{lead.category ? ` · ${lead.category}` : ""}
                  </p>
                  <h2 className="display mt-4 max-w-3xl text-4xl leading-[0.92] text-white transition-colors group-hover:text-brand sm:text-5xl lg:text-6xl">
                    {lead.title}
                  </h2>
                  {lead.standfirst && (
                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
                      {lead.standfirst}
                    </p>
                  )}
                  <span className="label mt-6 inline-flex items-center gap-2 text-brand transition-all group-hover:gap-3">
                    Read the piece <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 items-start gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-16">
              {rest.map((a, i) => {
                const v = VARIANTS[i % VARIANTS.length];
                return (
                  <Reveal
                    key={a._id}
                    delay={i * 60}
                    className={cn(v.span, v.drop)}
                  >
                    <Link
                      href={`/slipstream/${a.slug}`}
                      data-cursor="View"
                      className="group block"
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-[1.5rem] bg-navy",
                          v.aspect,
                        )}
                      >
                        {a.heroImage?.asset ? (
                          <Image
                            src={urlFor(a.heroImage).width(1100).url()}
                            alt={a.heroImage.alt || a.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy to-electric p-6">
                            <span className="text-center font-display text-2xl font-extrabold uppercase leading-tight text-brand">
                              {a.category || "Slipstream"}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/10" />
                      </div>

                      <div className="mt-5">
                        {(a.category || a.issue != null) && (
                          <div className="label flex items-center gap-3 text-black/45">
                            {a.category && (
                              <span className="text-brand-ink">{a.category}</span>
                            )}
                            {a.category && a.issue != null && (
                              <span className="h-px w-6 bg-black/20" />
                            )}
                            {a.issue != null && (
                              <span>Issue {String(a.issue).padStart(2, "0")}</span>
                            )}
                          </div>
                        )}
                        <h3
                          className={cn(
                            "display mt-2.5 leading-[0.95] text-ink transition-colors group-hover:text-brand-ink",
                            v.big ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
                          )}
                        >
                          {a.title}
                        </h3>
                        {a.standfirst && (
                          <p className="mt-3 line-clamp-3 max-w-md text-base leading-relaxed text-black/60">
                            {a.standfirst}
                          </p>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
