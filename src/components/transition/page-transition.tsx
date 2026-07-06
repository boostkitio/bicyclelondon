"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Brand curtain wipe on navigation. A fixed full-viewport panel sweeps up and
 * off whenever the pathname changes. It is a sibling of the page content (never
 * an ancestor), so its transform cannot become the containing block for pinned
 * (position: fixed) ScrollTrigger sections. Reduced motion: the panel is never
 * shown (matchMedia gate), so navigation is instant.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline()
          .set(ref.current, { yPercent: 0, display: "block" })
          .to(ref.current, { yPercent: -100, duration: 0.55, ease: "power4.inOut" })
          .set(ref.current, { display: "none" });
      });
      return () => mm.revert();
    },
    { dependencies: [pathname] },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[180] bg-brand"
      style={{ display: "none" }}
    />
  );
}
