"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Counts up from 0 to `to` once, when it scrolls into view. Pure
 * IntersectionObserver + rAF (no GSAP needed), respects reduced motion.
 * <CountUp to={215} prefix="+" suffix="%" />
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (!entry.isIntersecting) {
          setN(0); // reset so it re-counts next time it scrolls into view
          return;
        }
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, reduced]);

  const shown = reduced ? to : n;

  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}
