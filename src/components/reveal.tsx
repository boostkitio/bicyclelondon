"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// A decelerating ease (easeOutExpo-ish) that settles softly, like the Wix reveal.
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Reveals content as it scrolls into view, and hides again as it leaves, so the
 * animation replays each time the element enters the viewport.
 *
 * Two modes:
 *  - default: a fade + rise (safe anywhere, never clips overflowing children).
 *  - mask: the content slides up from behind a masked line (overflow-hidden
 *    wrapper + full-height translate). Use for text / headings where nothing is
 *    meant to break the frame.
 *
 * Fails open (renders visible without JS, seeds visibility from the observer's
 * first callback so above-the-fold content never flashes) and respects
 * reduced-motion (stays visible, no toggling).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  mask = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  mask?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setArmed(true);
        setShown(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const hidden = !reduced && armed && !shown;

  if (mask) {
    return (
      <div ref={ref} className={cn("overflow-hidden", className)}>
        <div
          style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: EASE }}
          className={cn(
            "transition-[transform,opacity] duration-[900ms] motion-reduce:transition-none",
            hidden ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: EASE }}
      className={cn(
        "transition-[transform,opacity] duration-[820ms] motion-reduce:transition-none",
        hidden ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
