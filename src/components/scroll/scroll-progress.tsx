"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Thin brand line at the very top, scaled by scroll progress. Rides
 * ScrollTrigger (same loop as Lenis). Reduced motion: matchMedia simply never
 * adds the trigger, so the bar stays at 0 width and is visually inert.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(ref.current, { scaleX: self.progress }),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  });
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed left-0 top-0 z-[150] h-[3px] w-full bg-brand"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
