import { cn } from "@/lib/utils";
import { Container } from "./container";

type Tone = "white" | "paper" | "navy" | "brand";

const tones: Record<Tone, string> = {
  white: "bg-white text-ink",
  paper: "bg-paper text-ink",
  navy: "bg-navy text-white",
  brand: "bg-brand text-black",
};

export function Section({
  tone = "white",
  className,
  containerClassName,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-16 sm:py-24", tones[tone], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
