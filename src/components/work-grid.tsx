import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { CaseStudyCard } from "@/sanity/lib/types";

type Tone = "light" | "dark";

// A repeating five-slot rhythm. Lopsided pairs whose big side alternates, with
// staggered vertical drops, then a full-bleed feature. Rows resolve to 7+5,
// 5+7, 12 — so nothing lines up into tidy corporate blocks, but it never leaves
// an orphaned gap. Modulo keeps it working for any number of studies.
const VARIANTS = [
  { span: "md:col-span-7", aspect: "aspect-[4/3]", drop: "", feature: true },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", drop: "md:mt-24", feature: false },
  { span: "md:col-span-5", aspect: "aspect-[5/4]", drop: "", feature: false },
  { span: "md:col-span-7", aspect: "aspect-[16/10]", drop: "md:mt-20", feature: false },
  { span: "md:col-span-12", aspect: "aspect-[16/9]", drop: "", feature: true },
] as const;

const TONES: Record<
  Tone,
  { meta: string; accent: string; title: string; lead: string; tag: string }
> = {
  light: {
    meta: "text-black/45",
    accent: "text-brand-ink",
    title: "text-ink group-hover:text-brand-ink",
    lead: "text-black/60",
    tag: "bg-paper text-black/55 ring-1 ring-black/5",
  },
  dark: {
    meta: "text-white/45",
    accent: "text-brand",
    title: "text-white group-hover:text-brand",
    lead: "text-white/60",
    tag: "bg-white/5 text-white/70 ring-1 ring-white/10",
  },
};

export function WorkGrid({
  studies,
  tone = "light",
}: {
  studies: CaseStudyCard[];
  tone?: Tone;
}) {
  const total = String(studies.length).padStart(2, "0");
  const t = TONES[tone];

  return (
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-16">
      {studies.map((cs, i) => {
        const v = VARIANTS[i % VARIANTS.length];
        const n = String(i + 1).padStart(2, "0");
        return (
          <Reveal
            key={cs._id}
            delay={(i % 2) * 90}
            className={cn(v.span, v.drop)}
          >
            <Link href={`/work/${cs.slug}`} className="group block">
              <div
                className={cn(
                  "relative overflow-hidden rounded-[1.75rem] bg-navy",
                  v.aspect,
                )}
              >
                {cs.heroImage?.asset && (
                  <Image
                    src={urlFor(cs.heroImage)
                      .width(v.feature ? 1400 : 900)
                      .url()}
                    alt={cs.heroImage.alt || cs.title}
                    fill
                    sizes={
                      v.feature
                        ? "(max-width: 768px) 100vw, 66vw"
                        : "(max-width: 768px) 100vw, 42vw"
                    }
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                  />
                )}
                {/* scrim so the index numeral stays legible over any image */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy/55 to-transparent" />
                <span className="absolute left-5 top-3.5 font-display text-2xl font-extrabold text-white/90 sm:text-3xl">
                  {n}
                </span>
                {/* brand wash + arrow on hover */}
                <div className="absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/15" />
                <span
                  aria-hidden
                  className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-brand text-lg text-black opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  →
                </span>
              </div>

              <div className="mt-5">
                <div className={cn("label flex items-center gap-3", t.meta)}>
                  <span className={t.accent}>{n}</span>
                  <span className="h-px w-6 bg-current opacity-30" />
                  <span>{total}</span>
                  {cs.clientName && (
                    <span className="opacity-80">· {cs.clientName}</span>
                  )}
                </div>

                <h3
                  className={cn(
                    "display mt-3 leading-[0.92] transition-colors",
                    v.feature
                      ? "text-3xl sm:text-4xl lg:text-5xl"
                      : "text-2xl sm:text-3xl",
                    t.title,
                  )}
                >
                  {cs.title}
                </h3>

                {v.feature && cs.standfirst && (
                  <p className={cn("mt-3 max-w-md text-base leading-relaxed", t.lead)}>
                    {cs.standfirst}
                  </p>
                )}

                {cs.services && cs.services.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {cs.services.slice(0, v.feature ? 4 : 2).map((s) => (
                      <li
                        key={s}
                        className={cn("label rounded-full px-3 py-1", t.tag)}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
