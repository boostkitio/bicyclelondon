"use client";

import { useEffect, useRef, useState } from "react";

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  count?: boolean; // set false to show as-is (e.g. a year)
};

function StatItem({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(stat.count === false ? stat.value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || stat.count === false) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(stat.value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(stat.value * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stat]);

  return (
    <div ref={ref}>
      <div className="display text-5xl sm:text-6xl">
        {stat.prefix}
        {stat.count === false ? n : n.toLocaleString("en-GB")}
        {stat.suffix}
      </div>
      <div className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/60">
        {stat.label}
      </div>
    </div>
  );
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <StatItem key={i} stat={s} />
      ))}
    </div>
  );
}
