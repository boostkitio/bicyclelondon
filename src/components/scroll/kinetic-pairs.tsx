"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Pair = [string, string];

/**
 * Pinned "Power of AND" sequence — GSAP ScrollTrigger.
 *
 * Desktop + motion: the section pins for `pairs.length × 100vh`, a scrubbed
 * timeline flies each pair in→hold→out, and it snaps to each revealed pair.
 *
 * Mobile / reduced-motion: NO pinning. The pairs render as a simple stacked
 * list (they're `relative` by default; the `group-data-[animated]` variants
 * only switch them to the absolute overlay once the desktop timeline is live).
 */
export function KineticPairs({ pairs }: { pairs: Pair[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // Switch CSS into "overlay" mode (see group-data variants below).
        root.current!.dataset.animated = "true";

        const items = gsap.utils.toArray<HTMLElement>("[data-pair]", root.current!);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + items.length * window.innerHeight,
            pin: true,
            scrub: 1,
            snap: { snapTo: "labels", duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power1.inOut" },
            invalidateOnRefresh: true,
          },
        });
        items.forEach((el, i) => {
          const l = el.querySelector('[data-kw="l"]');
          const r = el.querySelector('[data-kw="r"]');
          tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
            .fromTo(l, { xPercent: -70 }, { xPercent: 0, duration: 0.4 }, "<")
            .fromTo(r, { xPercent: 70 }, { xPercent: 0, duration: 0.4 }, "<")
            .addLabel("show" + i)
            .to({}, { duration: 0.3 })
            .to(el, { autoAlpha: 0, duration: 0.4 })
            .to(l, { xPercent: -70, duration: 0.4 }, "<")
            .to(r, { xPercent: 70, duration: 0.4 }, "<");
        });

        return () => {
          delete root.current!.dataset.animated;
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="group/k relative bg-navy py-24 text-white data-[animated=true]:h-screen data-[animated=true]:py-0"
    >
      <div className="flex flex-col items-center justify-center gap-[10vh] px-6 group-data-[animated=true]/k:h-screen group-data-[animated=true]/k:gap-0 group-data-[animated=true]/k:overflow-hidden">
        {pairs.map(([a, b], i) => (
          <div
            key={i}
            data-pair
            className="display relative flex items-center justify-center gap-[0.18em] whitespace-nowrap text-[clamp(34px,8vw,128px)] group-data-[animated=true]/k:absolute group-data-[animated=true]/k:inset-0"
          >
            <span data-kw="l" className="inline-block">
              {a}
            </span>
            <span className="font-normal text-brand">&amp;</span>
            <span data-kw="r" className="inline-block">
              {b}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
