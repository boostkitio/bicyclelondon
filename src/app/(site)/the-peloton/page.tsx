import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { Avatar } from "@/components/avatar";
import { TEAM, initials, photoSrc } from "@/content/team";

export const metadata: Metadata = {
  alternates: { canonical: "/the-peloton" },
  title: "The Peloton",
  description:
    "Meet the Peloton, the curious, intelligent and lovely people behind Bicycle. A fast-growing, 100% independent media and creative agency.",
};

export default function PelotonPage() {
  return (
    <>
      <PageHero
        eyebrow="Our people"
        title="The Peloton"
        lead="The curious, intelligent and lovely people who make Bicycle."
        image="/images/heroes/peloton.jpg"
      />
      <Section>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 80}>
              <div className="group">
                <Avatar
                  src={photoSrc(m.name)}
                  name={m.name}
                  initials={initials(m.name)}
                />
                <h2 className="mt-3 font-display text-base font-bold uppercase leading-tight">
                  {m.name}
                </h2>
                <p className="mt-0.5 text-sm text-black/60">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand
        heading="Like the look of us? We’re always after good people."
        label="See open roles"
        href="/careers"
      />
    </>
  );
}
