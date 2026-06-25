import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyCard } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Famous, effective work for ambitious brands, built on the power of ‘and’. Selected case studies from Bicycle London.",
};

export default async function WorkPage() {
  const studies = await sanityFetch<CaseStudyCard[]>({
    query: allCaseStudiesQuery,
    tags: ["caseStudy"],
  });

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Our work"
        lead="Famous, effective work for ambitious brands. Built on the power of ‘and’."
      />

      <Section>
        {studies.length === 0 ? (
          <p className="py-12 text-center text-black/50">
            Case studies are on their way. Check back soon.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {studies.map((cs) => (
              <Link
                key={cs._id}
                href={`/work/${cs.slug}`}
                className="group block overflow-hidden rounded-3xl bg-paper ring-1 ring-black/5 transition hover:ring-brand"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                  {cs.heroImage?.asset && (
                    <Image
                      src={urlFor(cs.heroImage).width(900).height(560).url()}
                      alt={cs.heroImage.alt || cs.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  {cs.clientName && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink">
                      {cs.clientName}
                    </p>
                  )}
                  <h2 className="mt-1 font-display text-2xl font-bold uppercase">
                    {cs.title}
                  </h2>
                  {cs.standfirst && (
                    <p className="mt-2 line-clamp-2 text-black/60">
                      {cs.standfirst}
                    </p>
                  )}
                </div>
              </Link>
            ))}
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
