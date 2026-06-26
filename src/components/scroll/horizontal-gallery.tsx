"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Pinned horizontal gallery — GSAP ScrollTrigger.
 *
 * Desktop + motion: pins the section and scrubs the track sideways by exactly
 * the overflow width (recomputed on resize via invalidateOnRefresh).
 *
 * Mobile / reduced-motion: native swipe scroller with scroll-snap. Give each
 * card `snap-start`. The section height collapses from 100vh to auto so it
 * doesn't eat a full screen.
 */
export function HorizontalGallery({
  children,
  heading,
}: {
  children: ReactNode;
  heading?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        root.current!.dataset.animated = "true";
        const getDist = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + 80);
        const tween = gsap.to(track.current, {
          x: () => -getDist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + getDist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          delete root.current!.dataset.animated;
          tween.scrollTrigger?.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="group/h relative overflow-hidden bg-deep py-16 text-white data-[animated=true]:h-screen data-[animated=true]:py-0"
    >
      <div className="flex flex-col justify-center group-data-[animated=true]/h:h-screen">
        {heading ? <div className="mb-9 px-5 sm:px-8">{heading}</div> : null}
        {/* Mobile: native horizontal scroll-snap. Desktop: GSAP drives x. */}
        <div className="overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] md:overflow-visible md:snap-none">
          <div ref={track} className="flex w-max gap-7 px-5 will-change-transform sm:px-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
