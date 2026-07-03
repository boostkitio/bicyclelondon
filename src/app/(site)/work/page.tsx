import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Grain } from "@/components/grain";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/page/cta-band";
import { WorkGrid } from "@/components/work-grid";
import { Parallax } from "@/components/scroll/parallax";
import { MaskReveal } from "@/components/scroll/mask-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { collectionPageSchema } from "@/lib/schema";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
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

      {/* Editorial hero — oversized, asymmetric, breaks to two lines */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Grain />
        <Parallax speed={-0.06} className="relative z-10">
          <Container className="pb-14 pt-36 sm:pb-20 sm:pt-40">
            <p className="label mb-7 flex items-center gap-2.5 text-brand">
              <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              Selected work · 2021–2026
            </p>
            <MaskReveal
              as="h1"
              className="display text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.86]"
              lines={[
                "Famous,",
                <>
                  effective <span className="text-brand">work</span>
                </>,
              ]}
            />
            <div className="mt-9 flex flex-col gap-6 border-t border-white/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lg leading-relaxed text-white/75">
                For ambitious brands. Built on the power of ‘and’.
              </p>
              <p className="label shrink-0 text-white/45">
                {total} selected projects
              </p>
            </div>
          </Container>
        </Parallax>
      </section>

      <Section tone="white">
        {studies.length === 0 ? (
          <p className="py-12 text-center text-black/50">
            Case studies are on their way. Check back soon.
          </p>
        ) : (
          <WorkGrid studies={studies} tone="light" />
        )}
      </Section>

      <CtaBand
        heading="Want to understand how the power of ‘and’ can revolutionise your marketing?"
        label="Start a project"
      />
    </>
  );
}
