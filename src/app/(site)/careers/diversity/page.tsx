import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/careers/diversity" },
  title: "Diversity & Inclusion",
  description:
    "Bicycle is an equal opportunity employer committed to a workplace where everyone can bring their whole self to work, with neurodiversity training and interview adjustments available.",
};

export default function DiversityPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Diversity & inclusion"
        lead="Do your life's best work here. With the whole world watching."
      />

      <Section>
        <Reveal className="max-w-3xl space-y-6 text-lg leading-relaxed text-black/75">
          <h2 className="label text-black/45">
            Diversity &amp; representation
          </h2>
          <p>
            Our success relies on the diverse perspectives of our workforce
            and, aside from simply being the right thing to do, we believe
            that fostering an inclusive culture where all talent can thrive
            makes our company stronger and helps drive invention in the work
            we do for our clients. We also believe it enables a greater idea
            exchange that fuels innovation and best reflects diverse consumer
            experiences.
          </p>
          <p>
            Bicycle is an equal opportunity employer and is committed to
            providing a space where everyone can bring their whole self to
            work. We actively promote and welcome applications from
            individuals who identify with groups currently underrepresented in
            the advertising industry.
          </p>
          <p>
            We strive for everyone to feel like they belong by removing any
            potential discrimination in the way that candidates and our
            employees are treated.
          </p>
          <p>
            At Bicycle we invest in neurodiversity training for our HR team
            and hiring managers, and understand how some applicants may
            thrive better in the interview process with certain adjustments.
            Please let our People team know at{" "}
            <a
              href={`mailto:${SITE.jobsEmail}`}
              className="font-semibold text-brand-ink underline underline-offset-4"
            >
              {SITE.jobsEmail}
            </a>{" "}
            if you require additional support or adjustments to ensure you
            have the best possible chance in your interview.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        heading="Ready to apply? See our open roles."
        label="View open roles"
        href="/careers"
      />
    </>
  );
}
