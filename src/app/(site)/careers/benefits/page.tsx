import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Benefits",
  description:
    "Pension, private healthcare, 26 days holiday plus a Christmas shutdown, a dog-friendly office, training budget and more. What it's like to work at Bicycle.",
};

const groups = [
  {
    title: "Benefits",
    items: [
      "Auto Enrolment Pension Scheme",
      "Death in Service at 4x times salary",
      "Discretionary annual performance-based bonus scheme of up to 8.33% of salary",
      "Opt-in Private Healthcare",
    ],
  },
  {
    title: "Time off",
    items: [
      "26 days annual holiday",
      "3 extra days off between the Christmas period (27th December to 1st January), on standby in the unlikely event a client needs assistance",
      "2 days off a year for volunteering with our 3 chosen charities: XO Bikes, Breast Cancer Now and Demelza",
      "2-week working-abroad allowance",
      "After two complete years, one extra day's holiday accrues each year as a Service Award, up to a maximum of 30 days",
    ],
  },
  {
    title: "Culture",
    items: [
      "Dog-friendly office",
      "Loaded breakfast bar and bar",
      "Monthly Culture Days celebrating our cultural differences",
      "Monthly massages and manicures/pedicures",
      "Socials organised by the Culture Club",
      "Subsidised 5-a-side football",
    ],
  },
  {
    title: "Development",
    items: [
      "Healthy training budget to support personal development",
      "Free Audible membership",
      "Regular Snack & Learns",
    ],
  },
  {
    title: "Other perks",
    items: [
      "Financial incentive for successful new-business leads",
      "Annual away day",
      "Cycle to Work scheme (of course)",
      "Recycle to Work scheme with XO Bikes: recycled and refurbished donated bikes, with all profits going towards training and hiring prison leavers",
      "Brompton bikes available for getting to and from meetings around town",
      "£1,000 referral fee for introducing a new starter to Bicycle",
      "Access to Mental Health First Aiders",
      "Salary sacrifice childcare vouchers",
    ],
  },
];

export default function BenefitsPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Bicycle benefits"
        lead="Do your life's best work here. With the whole world watching."
      />

      <Section>
        <div className="grid gap-10 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-black/50">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-black/75">
                    <span aria-hidden className="mt-1 text-brand-ink">
                      &bull;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        heading="Like the sound of it? See our open roles."
        label="View open roles"
        href="/careers"
      />
    </>
  );
}
