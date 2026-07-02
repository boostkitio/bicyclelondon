import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { collectionPageSchema } from "@/lib/schema";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyCard } from "@/sanity/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description:
    "Famous, effective work for ambitious brands, built on the power of ‘and’. Selected case studies from Bicycle London.",
};

export default async function WorkPage() {
  const studies = await sanityFetch<CaseStudyCard[]>({
    query: allCaseStudiesQuery,
    tags: ["caseStudy"],
  });

  const total = String(studies.length).padStart(2, "0");

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Bicycle London case studies",
          path: "/work",
          description:
            "Selected case studies from Bicycle London covering media planning, creative strategy, performance marketing and integrated campaigns.",
          items: studies.map((cs) => ({
            name: cs.title,
            path: `/work/${cs.slug}`,
            description: cs.standfirst,
          })),
        })}
      />
      <PageHero
        eyebrow="Selected work · 2021–2026"
        title="Famous, effective work"
        lead="For ambitious brands. Built on the power of ‘and’."
      />

      <Section>
        {studies.length === 0 ? (
          <p className="py-12 text-center text-black/50">
            Case studies are on their way. Check back soon.
          </p>
        ) : (
          <div className="space-y-24 lg:space-y-32">
            {studies.map((cs, i) => {
              const flipped = i % 2 === 1;
              return (
                <Reveal key={cs._id}>
                  <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
                    <Link
                      href={`/work/${cs.slug}`}
                      className={`relative block overflow-hidden rounded-[2rem] bg-navy lg:col-span-7 ${
                        flipped ? "lg:order-2" : ""
                      }`}
                    >
                      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                        {cs.heroImage?.asset && (
                          <Image
                            src={urlFor(cs.heroImage).width(1200).height(750).url()}
                            alt={cs.heroImage.alt || cs.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        )}
                        {/* subtle wash so the label chip below stays legible on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                      </div>
                    </Link>

                    <div className="lg:col-span-5">
                      <div className="label mb-5 flex items-center gap-3 text-black/45">
                        <span className="text-brand-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-8 bg-black/15" />
                        <span>{total}</span>
                        {cs.clientName && (
                          <span className="text-black/70">· {cs.clientName}</span>
                        )}
                      </div>

                      <Link href={`/work/${cs.slug}`}>
                        <h2 className="display text-4xl leading-[0.95] transition-colors group-hover:text-brand-ink sm:text-5xl lg:text-[3.4rem]">
                          {cs.title}
                        </h2>
                      </Link>

                      {cs.standfirst && (
                        <p className="mt-5 max-w-md text-lg leading-relaxed text-black/65">
                          {cs.standfirst}
                        </p>
                      )}

                      {cs.services && cs.services.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {cs.services.map((s) => (
                            <li
                              key={s}
                              className="label rounded-full bg-paper px-3.5 py-1.5 text-black/60 ring-1 ring-black/5"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}

                      <Link
                        href={`/work/${cs.slug}`}
                        className="label mt-8 inline-flex items-center gap-1.5 text-navy transition-all group-hover:gap-3 group-hover:text-brand-ink"
                      >
                        View case <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </Section>

      <CtaBand
        heading="Want to understand how the power of ‘and’ can revolutionise your marketing?"
        label="Start a project"
      />
    </>
  );
}
