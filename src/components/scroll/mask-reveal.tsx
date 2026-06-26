"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Line-by-line mask reveal — GSAP ScrollTrigger.
 * Each line lives in an overflow-hidden box; the inner span animates up from
 * 110% with a stagger on enter. The hidden start is set in useLayoutEffect (via
 * useGSAP), so there's no flash before scroll.
 *
 * Line wrappers are spans (phrasing content) so the component can render as a
 * real heading via `as="h1"` without invalid markup. Named MaskReveal to sit
 * alongside the lighter, fail-open `Reveal` (which stays default for body copy).
 */
export function MaskReveal({
  lines,
  as = "div",
  stagger = 0.09,
  className = "display text-[clamp(40px,7vw,104px)] leading-[1.02]",
}: {
  lines: ReactNode[];
  as?: ElementType;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      const spans = gsap.utils.toArray<HTMLElement>("[data-line] > span", ref.current!);
      gsap.from(spans, {
        yPercent: 110,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          end: "bottom top",
          // Replay on every enter, reset on every leave (both scroll directions).
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-line className="block overflow-hidden">
          <span className="inline-block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
