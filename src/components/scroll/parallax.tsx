"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Parallax layer — GSAP ScrollTrigger (scrubbed).
 * `speed` 0..1 = drift relative to scroll (negative = drifts up). Auto-disabled
 * for reduced-motion. Pass layout via `className`.
 */
export function Parallax({
  speed = 0.18,
  children,
  className = "",
}: {
  speed?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const amount = speed * 600;
        gsap.fromTo(
          ref.current,
          { y: -amount / 2 },
          {
            y: amount / 2,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
