"use client";
import { useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * "What we do" — GSAP ScrollTrigger.
 *
 * Desktop + motion: two columns; the left media column is pinned for the length
 * of the right column, and the active media swaps as each block crosses center.
 *
 * Mobile / reduced-motion: a single stacked column — each service's media sits
 * directly above its text. No pinning, no second column. (Rendered as a
 * separate `md:hidden` block so the GSAP refs never touch a display:none tree.)
 */
export function StickyServices({
  media,
  blocks,
}: {
  media: ReactNode[];
  blocks: ReactNode[];
}) {
  const root = useRef<HTMLElement>(null);
  const mediaCol = useRef<HTMLDivElement>(null);
  const rightCol = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: rightCol.current,
          start: "top top",
          end: "bottom bottom",
          pin: mediaCol.current,
          pinSpacing: false,
        });
        gsap.utils.toArray<HTMLElement>("[data-block]", rightCol.current!).forEach((b, i) => {
          ScrollTrigger.create({
            trigger: b,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-navy text-white">
      {/* Desktop: pinned two-column */}
      <div className="mx-auto hidden max-w-[1400px] items-start md:grid md:grid-cols-2">
        <div ref={mediaCol} className="flex h-screen items-center px-12">
          <div className="relative aspect-[4/5] max-h-[72vh] w-full overflow-hidden rounded-lg">
            {media.map((m, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
        <div ref={rightCol} className="px-12 py-[14vh]">
          {blocks.map((b, i) => (
            <div key={i} data-block className="flex min-h-[64vh] flex-col justify-center">
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked media + text per service */}
      <div className="flex flex-col gap-16 px-5 py-16 sm:px-8 md:hidden">
        {blocks.map((b, i) => (
          <div key={i}>
            <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-lg">{media[i]}</div>
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}
