"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Fades + slides content in as it scrolls into view, and back out as it leaves,
 * so the animation replays each time the element enters the viewport (either
 * direction), not just once.
 *
 * Fails open: renders visible without JS, and seeds visibility from the
 * observer's first callback so above-the-fold content never flashes. Respects
 * reduced-motion (stays visible, no toggling).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    // The observer fires immediately on observe() with the initial
    // intersection state, so it both seeds visibility (no above-the-fold
    // flash) and drives subsequent reveals.
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

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
