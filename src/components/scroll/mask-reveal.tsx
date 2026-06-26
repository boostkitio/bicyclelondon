"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Line-by-line mask reveal — GSAP ScrollTrigger.
 * Each line lives in an overflow-hidden box; the inner span animates up from
 * 110% with a stagger on enter. The hidden start is set in useLayoutEffect (via
 * useGSAP), so there's no flash before scroll.
 *
 * Named MaskReveal to sit alongside the lighter, fail-open `Reveal` component
 * (which stays the default for body content). Use this for big display headings.
 */
export function MaskReveal({
  lines,
  stagger = 0.09,
  className = "display text-[clamp(40px,7vw,104px)] leading-[1.02]",
}: {
  lines: ReactNode[];
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const spans = gsap.utils.toArray<HTMLElement>("[data-line] > span", ref.current!);
      gsap.from(spans, {
        yPercent: 110,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} data-line className="overflow-hidden">
          <span className="inline-block">{line}</span>
        </div>
      ))}
    </div>
  );
}
