import { Section } from "@/components/ui/section";
import { MagneticButton } from "@/components/scroll/magnetic-button";

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
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <h2 className="display max-w-2xl text-3xl sm:text-4xl">{heading}</h2>
        <MagneticButton
          href={href}
          className="shrink-0 rounded-full bg-brand px-10 py-4 text-base font-bold uppercase tracking-wide text-black"
        >
          {label}
        </MagneticButton>
      </div>
    </Section>
  );
}
