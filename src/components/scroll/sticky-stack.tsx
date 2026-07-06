"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { stackTransform } from "./stack-math";

/**
 * Cards that pin and stack: as you scroll the section, earlier cards recede
 * (scale/lift) while later cards settle on top. Reduced motion / mobile: the
 * cards render as an ordinary vertical flow (no pin, no transform).
 */
export function StickyStack({
  children,
  className = "",
}: {
  children: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = children.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", ref.current!);
        cards.forEach((c) => (c.style.position = "sticky"));
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            cards.forEach((c, i) => {
              const { scale, y } = stackTransform(i, count, self.progress);
              gsap.set(c, { scale, y });
            });
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          data-stack-card
          className="top-24 will-change-transform"
          style={{ transformOrigin: "center top" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
