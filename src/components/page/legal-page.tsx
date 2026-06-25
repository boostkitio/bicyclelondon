import { PageHero } from "./page-hero";
import { Section } from "@/components/ui/section";

export function LegalPage({
  title,
  summary,
  pdfHref,
}: {
  title: string;
  summary: string;
  pdfHref?: string;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-black/75">
          <p>{summary}</p>
          {pdfHref && (
            <p>
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-ink underline underline-offset-4"
              >
                Read the full {title} (PDF)
              </a>
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
