"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Steady auto-scrolling marquee — vanilla rAF, constant speed (no scroll-velocity
 * boost). Two identical copies of `items` loop seamlessly by wrapping the X
 * offset at half the track width. Style the strip with `className`.
 */
export function Marquee({
  items,
  baseSpeed = 1.1,
  direction = -1,
  className = "",
}: {
  items: ReactNode[];
  baseSpeed?: number;
  direction?: 1 | -1;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pos = 0,
      half = set.offsetWidth,
      raf = 0;
    const measure = () => {
      half = set.offsetWidth;
    };
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    const tick = () => {
      pos += baseSpeed * direction;
      if (pos <= -half) pos += half;
      if (pos > 0) pos -= half;
      track.style.transform = `translate3d(${pos}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [baseSpeed, direction]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="inline-flex whitespace-nowrap will-change-transform">
        <div ref={setRef} className="inline-flex">
          {items}
        </div>
        <div className="inline-flex" aria-hidden>
          {items}
        </div>
      </div>
    </div>
  );
}
