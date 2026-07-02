import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { PortableText } from "@/components/portable-text";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { sanityFetch } from "@/sanity/lib/fetch";
import { jobBySlugQuery, jobSlugsQuery } from "@/sanity/lib/queries";
import { SITE } from "@/lib/site";
import { breadcrumb } from "@/lib/schema";
import type { Job } from "@/sanity/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: jobSlugsQuery,
    revalidate: 3600,
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await sanityFetch<Job | null>({
    query: jobBySlugQuery,
    params: { slug },
  });
  if (!job) return {};
  const description =
    job.seo?.metaDescription ||
    job.summary ||
    `Apply for the ${job.title} role at Bicycle London.`;
  return {
    title: job.seo?.metaTitle || `${job.title} | Careers`,
    description,
    alternates: { canonical: `/careers/${job.slug}` },
    ...(job.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await sanityFetch<Job | null>({
    query: jobBySlugQuery,
    params: { slug },
    tags: ["job"],
  });
  if (!job) notFound();

  const applyEmail = job.applyEmail || SITE.jobsEmail;
  const description =
    job.summary || `Apply for the ${job.title} role at Bicycle London.`;
  const meta = [
    job.location,
    job.employmentType?.replace("_", "-").toLowerCase(),
    job.salary,
  ].filter(Boolean);

  const jobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    identifier: {
      "@type": "PropertyValue",
      name: SITE.name,
      value: job.slug,
    },
    datePosted: job.postedAt,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE.name,
      sameAs: SITE.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.line1,
        addressLocality: SITE.address.city,
        postalCode: SITE.address.postcode,
        addressCountry: "GB",
      },
    },
  };

  return (
    <>
      <JsonLd data={jobPosting} />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
          { name: job.title, path: `/careers/${job.slug}` },
        ])}
      />
      <PageHero eyebrow={job.team || "Careers"} title={job.title} lead={job.summary} />

      <Section>
        <div className="mx-auto max-w-3xl">
          {meta.length > 0 && (
            <ul className="mb-10 flex flex-wrap gap-2">
              {meta.map((m) => (
                <li
                  key={m}
                  className="rounded-full bg-paper px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-black/70"
                >
                  {m}
                </li>
              ))}
            </ul>
          )}

          <PortableText value={job.body} />

          <div className="mt-12 rounded-3xl bg-paper p-8">
            <h2 className="display text-2xl">How to apply</h2>
            <p className="mt-2 text-black/65">
              {job.teamtailorUrl
                ? "Apply through our careers portal and we'll be in touch."
                : "Send your CV and a few lines on why you’re a fit."}
            </p>
            <div className="mt-5">
              {job.teamtailorUrl ? (
                <ButtonLink
                  href={job.teamtailorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                >
                  Apply for this role
                </ButtonLink>
              ) : (
                <ButtonLink
                  href={`mailto:${applyEmail}?subject=${encodeURIComponent(
                    `Application: ${job.title}`,
                  )}`}
                  variant="primary"
                  size="lg"
                >
                  Apply for this role
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        heading="Not quite the right role? We’re always keen to meet good people."
        label="Email the team"
        href={`mailto:${SITE.jobsEmail}`}
      />
    </>
  );
}
