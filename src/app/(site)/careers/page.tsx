import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/avatar";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allJobsQuery } from "@/sanity/lib/queries";
import { SITE } from "@/lib/site";
import type { JobCard } from "@/sanity/lib/types";

const moreLinks = [
  { href: "/careers/benefits", title: "Benefits", detail: "Pension, private healthcare, 26 days holiday and more." },
  { href: "/careers/values", title: "Mission & values", detail: "Drive, Balance and Freedom: what makes us Bicycle." },
  { href: "/careers/diversity", title: "Diversity & inclusion", detail: "An equal-opportunity employer committed to belonging." },
];

const peloton = [
  {
    href: "/careers/team/mark-pavlika",
    name: "Mark Pavlika",
    role: "Chief People & Purpose Officer",
    photo: "/team/mark-pavlika.png",
  },
  {
    href: "/careers/team/valeria-perticucci",
    name: "Valeria Perticucci",
    role: "Peloton Success Manager",
    photo: "/team/valeria-perticucci.png",
  },
];

const testimonials = [
  {
    quote:
      "As a grad, I was very nervous to come into my first full time role, all I can say is Bicycle has set the bar extremely high. So high that when I go home and talk about my work, my parents are jealous of the environment I get to call my office. The culture offers a warm, inclusive and ever changing atmosphere. Not a single day is the same and therefore there is plenty of space to learn and develop as an individual.",
    name: "Izzy Nott",
    role: "AV Account Executive",
  },
  {
    quote:
      "Bicycle is a co-operative, transparent place to work where everyone has visibility on our strategic and commercial goals. We're hugely ambitious, growing fast, and our breadth of services is seriously impressive for our age. Everyone learns a lot, as well as making friends for life!",
    name: "Alex Wood",
    role: "Business Director",
  },
  {
    quote:
      "Bicycle has a great work culture & vibrant environment which celebrates diversity and allows you to be yourself. It's great having the opportunity to work across an amazing mix of clients & alongside colleagues that inspire you every day.",
    name: "Louis Aidam",
    role: "Senior Account Executive",
  },
  {
    quote: "A small thing but it's nice to zip around town on one of the company's Brompton Bicycles.",
    name: "Bryan Hogg",
    role: "Strategy Director",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
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

      <Section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-black/50">
          What’s life at Bicycle like?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl bg-paper p-6 text-black/75 ring-1 ring-black/5"
            >
              <p className="italic leading-relaxed">“{t.quote}”</p>
              <footer className="mt-4 text-sm font-semibold not-italic text-black/60">
                {t.name}, {t.role}
              </footer>
            </blockquote>
          ))}
        </div>

        <h2 className="mt-14 font-display text-sm font-semibold uppercase tracking-widest text-black/50">
          Meet the Peloton
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {peloton.map((person) => (
            <Link
              key={person.href}
              href={person.href}
              className="group flex items-center gap-5 rounded-2xl bg-paper p-5 ring-1 ring-black/5 transition-colors hover:bg-white hover:ring-black/10"
            >
              <div className="w-16 shrink-0">
                <Avatar src={person.photo} name={person.name} initials={person.name[0]} />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-navy transition-colors group-hover:text-brand-ink">
                  {person.name}
                </span>
                <p className="mt-1 text-sm text-black/65">{person.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        heading="Don’t see your role? We’re always keen to meet good people."
        label="Email the team"
        href={`mailto:${SITE.jobsEmail}`}
      />
    </>
  );
}
