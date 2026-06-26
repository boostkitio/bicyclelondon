"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
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
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}
