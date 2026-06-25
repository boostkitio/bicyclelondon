import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand({
  heading = "Want to understand how the power of ‘and’ can revolutionise your marketing?",
  href = "/contact-us",
  label = "Contact us",
}: {
  heading?: string;
  href?: string;
  label?: string;
}) {
  return (
    <Section tone="navy">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <h2 className="display max-w-2xl text-3xl sm:text-4xl">{heading}</h2>
        <ButtonLink href={href} variant="primary" size="lg" className="shrink-0">
          {label}
        </ButtonLink>
      </div>
    </Section>
  );
}
