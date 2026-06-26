"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function GsapHeroHeading() {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-line", {
          y: 44,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
        })
        .from(
          ".hero-and",
          { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(2)" },
          "-=0.35",
        );
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className="display text-6xl sm:text-7xl lg:text-[7.5rem]">
      <span className="hero-line block">Built on the</span>
      <span className="hero-line block">
        power of <span className="hero-and inline-block text-brand">and</span>
      </span>
    </h1>
  );
}
