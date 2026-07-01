import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allJobsQuery } from "@/sanity/lib/queries";
import { SITE } from "@/lib/site";
import type { JobCard } from "@/sanity/lib/types";

const moreLinks = [
  { href: "/careers/benefits", title: "Benefits", detail: "Pension, private healthcare, 26 days holiday and more." },
  { href: "/careers/values", title: "Mission & values", detail: "Drive, Balance and Freedom: what makes us Bicycle." },
  { href: "/careers/diversity", title: "Diversity & inclusion", detail: "An equal-opportunity employer committed to belonging." },
];

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Ride on the Peloton. Bicycle is an open-minded, collaborative, ideas-driven agency where world-class creativity comes without prima donnas. See our open roles.",
};

const awards = ["Workplace of the Year", "Agency of the Year", "IPA CPD Gold"];

export default async function CareersPage() {
  const jobs = await sanityFetch<JobCard[]>({
    query: allJobsQuery,
    tags: ["job"],
  });

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Ride on the Peloton"
        lead="Welcome to the fastest-growing agency in the UK."
        image="/images/heroes/peloton.jpg"
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-black/75">
          <p>
            We are an open-minded, collaborative, ideas-driven agency where
            world-class creativity comes without prima donnas. And where there’s
            as much commitment to personal well-being as to career development.
          </p>
          <p>
            If your talent comes without ego, if you play well with others, and
            if you’re ready to make us better, we’d love to hear from you.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-black/50">
            Open roles
          </h2>
          {jobs.length === 0 ? (
            <p className="mt-4 text-black/70">
              We don’t have any open roles right now, but we’re always keen to
              meet good people. Send your CV to{" "}
              <a
                href={`mailto:${SITE.jobsEmail}`}
                className="font-semibold text-brand-ink underline underline-offset-4"
              >
                {SITE.jobsEmail}
              </a>
              .
            </p>
          ) : (
            <ul className="mt-6 border-t border-black/10">
              {jobs.map((job) => (
                <li key={job._id} className="border-b border-black/10">
                  <Link
                    href={`/careers/${job.slug}`}
                    className="group flex items-center justify-between gap-4 px-2 py-6 transition-colors hover:bg-paper sm:px-4"
                  >
                    <span>
                      <span className="block font-display text-2xl font-bold uppercase leading-tight transition-colors group-hover:text-brand-ink sm:text-3xl">
                        {job.title}
                      </span>
                      <span className="mt-1.5 block text-sm font-semibold uppercase tracking-wide text-black/45">
                        {[job.team, job.location].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl text-brand-ink transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          {moreLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block rounded-2xl bg-paper p-6 ring-1 ring-black/5 transition-colors hover:bg-white hover:ring-black/10"
            >
              <span className="font-display text-lg font-bold uppercase text-navy transition-colors group-hover:text-brand-ink">
                {item.title}
              </span>
              <p className="mt-2 text-sm text-black/65">{item.detail}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="display text-3xl sm:text-4xl">Why work with us?</h2>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Image
            src="/images/bcorp.png"
            alt="Certified B Corporation"
            width={70}
            height={116}
            className="h-20 w-auto"
          />
          <div className="flex flex-wrap gap-3">
            {awards.map((a) => (
              <span
                key={a}
                className="rounded-full bg-white px-5 py-2 font-display text-sm font-semibold uppercase tracking-wide text-navy ring-1 ring-black/5"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
        <blockquote className="mt-10 max-w-3xl border-l-4 border-brand pl-6 text-lg italic text-black/75">
          “Bicycle London’s IPA Gold submission is a testament to their visionary
          approach to professional growth and operational excellence. Their
          strategic integration of CPD into every aspect of their business not
          only demonstrates an exemplary learning culture, but showcases tangible
          results.”
          <footer className="mt-3 text-sm not-italic text-black/55">
            Georgina Bramall, Marketing Strategy Director, giffgaff &amp; Chair of
            Judges, IPA CPD Gold
          </footer>
        </blockquote>
      </Section>

      <CtaBand
        heading="Don’t see your role? We’re always keen to meet good people."
        label="Email the team"
        href={`mailto:${SITE.jobsEmail}`}
      />
    </>
  );
}
