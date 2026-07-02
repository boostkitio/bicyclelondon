import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  alternates: { canonical: "/careers/values" },
  title: "Mission & Values",
  description:
    "Our mission is to leave the industry better than we found it. Our values, Drive, Balance and Freedom, are what makes us Bicycle.",
};

const values = [
  {
    title: "Drive",
    detail:
      "Drive is what propels us towards our business goals. People with drive move things forward. They help us reach our targets and explore new possibilities. Nobody comes here to sit still. We encourage all staff to ask 'where next?', and everyone has their turn at the front of the peloton. Drive gets us up the biggest hills and helps us overcome our biggest business challenges, and allows us to enjoy the ride on the other side. Pushing through the pedals is hard work, but the view at the top is wonderful.",
  },
  {
    title: "Balance",
    detail:
      "Balance keeps us safe and upright and fixed on our targets. With balance, we move forward quickly and safely; without it, we crash. Cultural balance: we attract people from all walks and encourage diversity in all aspects of our work, keeping our outlook fresh, relevant and exciting to us and our clients. Work-life balance: we never work so hard we hit the wall. We are at our brilliant best when we are happy and rested and have the space to do our thing. When we work with balance, it's hard to knock us off course.",
  },
  {
    title: "Freedom",
    detail:
      "Drive and balance mean nothing without freedom. We have clear business goals, but there's more than one road to success. Everyone at Bicycle has the freedom to challenge management, clients and colleagues; the freedom to explore new ways of doing things; the freedom to express themselves through their work. Whether you stand on your pedals or sit firmly in the saddle, you have the freedom to move your career forward in a way that suits you.",
  },
];

export default function ValuesPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Our mission & values"
        lead="What makes us Bicycle."
      />

      <Section>
        <div className="max-w-3xl">
          <h2 className="label text-black/45">
            Our mission
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/75">
            To leave the industry better than we found it. To create famous
            and impactful work that you want to tell your mum about. To make a
            living and have fun doing it.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="label text-black/45">
          Bicycle values
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title}>
              <h3 className="font-display text-2xl font-bold uppercase text-navy">
                {value.title}
              </h3>
              <p className="mt-4 leading-relaxed text-black/75">
                {value.detail}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand
        heading="Sound like you? See our open roles."
        label="View open roles"
        href="/careers"
      />
    </>
  );
}
