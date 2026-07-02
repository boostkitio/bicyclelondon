"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A statement that "reads" as you scroll: each word lifts from a dim tone to
 * the element's full colour, word by word, scrubbed to scroll position.
 * Fails open (full colour, no split) under reduced motion.
 */
export function ScrollFillText({
  children,
  as: Tag = "p",
  className = "",
  dim = "rgba(11,15,38,0.16)",
}: {
  children: string;
  as?: ElementType;
  className?: string;
  dim?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const parts = children.split(/(\s+)/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll<HTMLElement>("[data-fill-word]");
      const full = getComputedStyle(el).color;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(words, { color: dim });
        gsap.to(words, {
          color: full,
          ease: "none",
          stagger: 0.6,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 58%",
            scrub: 0.5,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {parts.map((part, i) =>
        /\S/.test(part) ? (
          <span key={i} data-fill-word>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </Tag>
  );
}
