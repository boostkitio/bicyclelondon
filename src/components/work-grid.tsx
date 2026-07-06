import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { CaseStudyCard } from "@/sanity/lib/types";

type Tone = "light" | "dark";

// A repeating five-slot rhythm. Lopsided pairs whose big side alternates, with
// staggered vertical drops, then a full-bleed feature whose title + intro sit
// over the image. Rows resolve to 7+5, 5+7, 12 — nothing lines up into tidy
// corporate blocks, and it never leaves an orphaned gap. Modulo keeps it working
// for any number of studies.
const VARIANTS = [
  { span: "md:col-span-7", aspect: "aspect-[4/3]", drop: "", kind: "lg" },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", drop: "md:mt-24", kind: "sm" },
  { span: "md:col-span-5", aspect: "aspect-[5/4]", drop: "", kind: "sm" },
  { span: "md:col-span-7", aspect: "aspect-[16/10]", drop: "md:mt-20", kind: "lg" },
  {
    span: "md:col-span-12",
    aspect: "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9]",
    drop: "",
    kind: "feature",
  },
] as const;

const TONES: Record<
  Tone,
  { meta: string; accent: string; rule: string; title: string; lead: string; tag: string }
> = {
  light: {
    meta: "text-black/45",
    accent: "text-brand-ink",
    rule: "bg-black/20",
    title: "text-ink group-hover:text-brand-ink",
    lead: "text-black/60",
    tag: "bg-paper text-black/55 ring-1 ring-black/5",
  },
  dark: {
    meta: "text-white/50",
    accent: "text-brand",
    rule: "bg-white/25",
    title: "text-white group-hover:text-brand",
    lead: "text-white/65",
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
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-20">
      {studies.map((cs, i) => {
        const v = VARIANTS[i % VARIANTS.length];
        const n = String(i + 1).padStart(2, "0");
        const feature = v.kind === "feature";

        return (
          <Reveal key={cs._id} delay={(i % 2) * 90} className={cn(v.span, v.drop)}>
            <Link
              href={`/work/${cs.slug}`}
              className="group block"
              data-cursor="View"
            >
              {feature ? (
                // Full-bleed showcase — number, huge title and intro over the image.
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[2rem] bg-navy",
                    v.aspect,
                  )}
                >
                  {cs.heroImage?.asset && (
                    <Image
                      src={urlFor(cs.heroImage).width(1800).url()}
                      alt={cs.heroImage.alt || cs.title}
                      fill
                      sizes="100vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
                  <div className="absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/10" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                    <div className="label flex items-center gap-3 text-white/70">
                      <span className="text-brand">{n}</span>
                      <span className="h-px w-8 bg-white/30" />
                      <span>{total}</span>
                      {cs.clientName && <span>· {cs.clientName}</span>}
                    </div>
                    <h3 className="display mt-4 text-5xl leading-[0.88] text-white transition-colors group-hover:text-brand sm:text-6xl lg:text-7xl">
                      {cs.title}
                    </h3>
                    {cs.standfirst && (
                      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
                        {cs.standfirst}
                      </p>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {cs.services && cs.services.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                          {cs.services.slice(0, 4).map((s) => (
                            <li
                              key={s}
                              className="label rounded-full bg-white/10 px-3 py-1 text-white/80 ring-1 ring-white/15"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                      <span className="label inline-flex items-center gap-2 text-brand transition-all group-hover:gap-3">
                        View case study <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-[1.75rem] bg-navy",
                      v.aspect,
                    )}
                  >
                    {cs.heroImage?.asset && (
                      <Image
                        src={urlFor(cs.heroImage)
                          .width(v.kind === "lg" ? 1200 : 900)
                          .url()}
                        alt={cs.heroImage.alt || cs.title}
                        fill
                        sizes={
                          v.kind === "lg"
                            ? "(max-width: 768px) 100vw, 58vw"
                            : "(max-width: 768px) 100vw, 42vw"
                        }
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                      />
                    )}
                    {/* scrim so the index numeral stays legible over any image */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy/60 to-transparent" />
                    <span className="absolute left-6 top-4 font-display text-4xl font-extrabold text-white sm:text-5xl">
                      {n}
                    </span>
                    <div className="absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/10" />
                    {/* green 'View case' bar wipes up on hover */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-brand px-5 py-3.5 text-black transition-transform duration-500 ease-out group-hover:translate-y-0">
                      <span className="label flex items-center justify-between">
                        View case study <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className={cn("label flex items-center gap-3", t.meta)}>
                      <span className={t.accent}>{n}</span>
                      <span className={cn("h-px w-6", t.rule)} />
                      <span>{total}</span>
                      {cs.clientName && (
                        <span className="opacity-80">· {cs.clientName}</span>
                      )}
                    </div>

                    <h3
                      className={cn(
                        "display mt-3 leading-[0.9] transition-colors",
                        v.kind === "lg"
                          ? "text-4xl sm:text-5xl lg:text-6xl"
                          : "text-3xl sm:text-4xl",
                        t.title,
                      )}
                    >
                      {cs.title}
                    </h3>

                    {cs.standfirst && (
                      <p
                        className={cn(
                          "mt-3 leading-relaxed",
                          v.kind === "lg"
                            ? "max-w-xl text-lg"
                            : "max-w-md text-base",
                          t.lead,
                        )}
                      >
                        {cs.standfirst}
                      </p>
                    )}

                    {cs.services && cs.services.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {cs.services.slice(0, v.kind === "lg" ? 4 : 3).map((s) => (
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
                </>
              )}
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
