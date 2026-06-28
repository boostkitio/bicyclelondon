"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Word({ children }: { children: ReactNode }) {
  return <span className="hero-word mr-[0.24em] inline-block">{children}</span>;
}

export function GsapHeroHeading() {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".hero-word", {
          yPercent: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
        })
        .from(
          ".hero-and",
          { scale: 0.4, opacity: 0, duration: 0.6, ease: "back.out(2)" },
          "-=0.35",
        )
        .from(
          ".hero-underline",
          { scaleX: 0, duration: 0.7, ease: "power3.inOut" },
          "-=0.2",
        );
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className="display text-6xl leading-[0.95] sm:text-7xl lg:text-[7.5rem]">
      <span className="block">
        <Word>Built</Word>
        <Word>on</Word>
        <Word>the</Word>
      </span>
      <span className="block">
        <Word>power</Word>
        <Word>of</Word>
        <span className="relative inline-block">
          <span className="hero-and inline-block text-brand">and</span>
          <span className="hero-underline absolute -bottom-[0.06em] left-0 h-[0.07em] w-full origin-left rounded-full bg-brand" />
        </span>
      </span>
    </h1>
  );
}
