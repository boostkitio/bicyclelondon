"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** A reading-progress bar that fills as you scroll through the element with id=targetId. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
      const st = ScrollTrigger.create({
        trigger: target,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => gsap.set(ref.current, { scaleX: self.progress }),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  });
  return (
    <div ref={ref} aria-hidden className="fixed left-0 top-0 z-[140] h-[3px] w-full bg-brand" style={{ transform: "scaleX(0)" }} />
  );
}
