"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// The pairs Bicycle fuses. The ticker performs them; the ampersand is the
// pivot they all turn on.
const PAIRS: [string, string][] = [
  ["Media", "Creative"],
  ["Art", "Science"],
  ["Man", "Machine"],
  ["Brand", "Performance"],
  ["Data", "Digital"],
];

/**
 * Hero centrepiece. "Built on the power of &", where the ampersand sits inside
 * a slowly turning wheel (the two ideas the brand is named for: the fusing
 * "and", and cycling). A mono ticker underneath performs the pairs the agency
 * fuses. Reduced motion: wheel and ticker hold still on the first pair.
 */
export function HeroFusion() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The wheel turns; the ampersand breathes.
        gsap.to(".hero-wheel", {
          rotation: 360,
          transformOrigin: "50% 50%",
          repeat: -1,
          duration: 26,
          ease: "none",
        });
        gsap.to(".hero-amp-glyph", {
          scale: 1.05,
          transformOrigin: "50% 55%",
          repeat: -1,
          yoyo: true,
          duration: 2.6,
          ease: "sine.inOut",
        });

        // Entrance: the headline lines rise in, then the wheel settles.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-line", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.1 })
          .from(".hero-amp", { scale: 0.3, opacity: 0, duration: 0.7, ease: "back.out(1.7)" }, "-=0.4")
          .from(".hero-tick", { opacity: 0, y: 12, duration: 0.6 }, "-=0.2");

        // Ticker: cross-fade each pair.
        const items = gsap.utils.toArray<HTMLElement>(".hero-pair");
        const tl = gsap.timeline({ repeat: -1 });
        items.forEach((item, i) => {
          tl.set(items, { opacity: 0, position: "absolute" }, 0);
          tl.to(item, { opacity: 1, duration: 0.5, ease: "power2.out" }, i * 1.9)
            .to(item, { opacity: 0, duration: 0.5, ease: "power2.in" }, i * 1.9 + 1.5);
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-pair", { position: "absolute", opacity: 0 });
        gsap.set(".hero-pair:first-child", { opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <h1 className="display text-white [font-size:clamp(2.75rem,8.5vw,8.5rem)] leading-[0.92]">
        <span className="block overflow-hidden">
          <span className="hero-line block">Built on the</span>
        </span>
        <span className="block overflow-hidden">
          <span className="hero-line flex items-center gap-[0.18em]">
            Power of
            {/* Ampersand-in-a-wheel: the signature mark */}
            <span
              className="hero-amp relative inline-flex items-center justify-center"
              style={{ width: "1.15em", height: "1.15em" }}
              aria-hidden
            >
              <svg
                className="hero-wheel absolute inset-0 h-full w-full text-electric"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="2" opacity="0.65" />
                <circle cx="50" cy="50" r="47" stroke="var(--color-brand)" strokeWidth="2" strokeDasharray="8 292" opacity="0.9" />
                {[0, 45, 90, 135].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="6"
                    x2="50"
                    y2="94"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.18"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
                <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.7" />
              </svg>
              <span className="hero-amp-glyph relative text-brand">&amp;</span>
            </span>
          </span>
        </span>
      </h1>

      <div className="hero-tick mt-7 flex h-6 items-center">
        <span className="label mr-3 text-brand" aria-hidden>
          ▸
        </span>
        <span className="relative block" aria-hidden>
          {PAIRS.map(([a, b]) => (
            <span
              key={a}
              className="hero-pair label whitespace-nowrap text-white/85 [font-size:0.85rem] [letter-spacing:0.14em]"
            >
              {a} <span className="text-brand">&amp;</span> {b}
            </span>
          ))}
        </span>
        <span className="sr-only">
          Media and creative, art and science, man and machine, brand and
          performance, data and digital.
        </span>
      </div>
    </div>
  );
}
