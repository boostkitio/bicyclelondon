"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades + slides content in as it scrolls into view, and back out as it leaves
 * — so the animation replays each time the element enters the viewport (either
 * direction), not just once.
 *
 * Fails open: renders visible without JS, and seeds from the element's real
 * position on mount so above-the-fold content never flashes. Respects
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

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    // Seed from the current position so above-the-fold content doesn't flash.
    const r = el.getBoundingClientRect();
    setShown(r.top < window.innerHeight && r.bottom > 0);
    setArmed(true);

    const io = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = armed && !shown;

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
