import { PageHero } from "./page-hero";
import { CtaBand } from "./cta-band";
import { Section } from "@/components/ui/section";

export type ServicePoint = { title: string; body: string };
export type ServiceSection = { heading?: string; body: string[] };

export type ServiceContent = {
  eyebrow: string;
  title: string;
  heroImage?: string;
  logo?: string;
  lead?: string[];
  points?: ServicePoint[];
  sections?: ServiceSection[];
  cta?: { heading?: string; label?: string; href?: string };
};

export function ServicePage({ content }: { content: ServiceContent }) {
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        image={content.heroImage}
        logo={content.logo}
      />

      {content.lead && content.lead.length > 0 && (
        <Section tone="white">
          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-black/75">
            {content.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>
      )}

      {content.points && content.points.length > 0 && (
        <Section tone="paper" className={content.lead ? "!pt-0" : undefined}>
          <div className="grid gap-6 md:grid-cols-3">
            {content.points.map((pt, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white p-8 ring-1 ring-black/5"
              >
                <span className="font-display text-4xl font-extrabold text-brand-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">
                  {pt.title}
                </h3>
                <p className="mt-3 text-black/65">{pt.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.sections?.map((s, i) => (
        <Section key={i} tone={i % 2 === 0 ? "white" : "paper"}>
          <div className="mx-auto max-w-3xl">
            {s.heading && (
              <h2 className="display text-3xl sm:text-4xl">{s.heading}</h2>
            )}
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-black/75">
              {s.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </div>
        </Section>
      ))}

      <CtaBand
        heading={content.cta?.heading}
        label={content.cta?.label}
        href={content.cta?.href}
      />
    </>
  );
}
