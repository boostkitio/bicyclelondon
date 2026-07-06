"use client";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { splitToTokens } from "./split-text";

/**
 * Word- or character-level masked reveal for large display headings (finer
 * than the per-line MaskReveal). Each token rises from within an overflow-hidden
 * box. With `scrub`, the reveal is tied to scroll position; otherwise it plays
 * once on enter. Fails open under reduced motion (full text, no animation).
 * Renders a real element via `as` (e.g. "h2") with tokens as inline spans.
 */
export function SplitReveal({
  text,
  by = "word",
  as = "div",
  className = "display text-[clamp(40px,8vw,120px)] leading-[0.95]",
  stagger = 0.05,
  scrub = false,
}: {
  text: string;
  by?: "word" | "char";
  as?: ElementType;
  className?: string;
  stagger?: number;
  scrub?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;
  const tokens = splitToTokens(text, by);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const spans = gsap.utils.toArray<HTMLElement>("[data-token] > span", ref.current!);
        gsap.from(spans, {
          yPercent: 115,
          duration: 0.8,
          ease: "power4.out",
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: scrub ? "bottom 55%" : undefined,
            scrub: scrub ? 0.5 : false,
            toggleActions: scrub ? undefined : "play none none reverse",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {tokens.map((t, i) =>
        t.space ? (
          <span key={i} style={{ whiteSpace: "pre" }}>
            {t.text}
          </span>
        ) : (
          <span key={i} data-token className="inline-block overflow-hidden align-bottom">
            <span className="inline-block">{t.text}</span>
          </span>
        ),
      )}
    </Tag>
  );
}
