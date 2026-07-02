"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Steady auto-scrolling marquee — vanilla rAF. Two identical copies of `items`
 * loop seamlessly by wrapping the X offset at half the track width. With
 * `velocity`, the strip surges in proportion to how fast the page is being
 * scrolled, then eases back to its constant cruise. Style the strip with
 * `className`. The rAF loop only runs while the strip is on-screen and the
 * tab is visible; `pos` persists across pauses so it resumes seamlessly.
 */
export function Marquee({
  items,
  baseSpeed = 1.1,
  direction = -1,
  velocity = false,
  className = "",
}: {
  items: ReactNode[];
  baseSpeed?: number;
  direction?: 1 | -1;
  velocity?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const boost = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const set = setRef.current;
    if (!wrap || !track || !set) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pos = 0,
      half = set.offsetWidth,
      raf = 0;
    let onScreen = false;
    let running = false;
    const measure = () => {
      half = set.offsetWidth;
    };
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    // Scroll-velocity surge: accumulate from how far the page jumps each event,
    // capped, then bleed off every frame so it always settles back to cruise.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      boost.current = Math.min(
        boost.current + Math.min(Math.abs(y - lastY), 80) * 0.22,
        16,
      );
      lastY = y;
    };
    if (velocity) window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      if (!running) return;
      pos += (baseSpeed + boost.current) * direction;
      boost.current *= 0.9;
      if (pos <= -half) pos += half;
      if (pos > 0) pos -= half;
      track.style.transform = `translate3d(${pos}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      setRunning(onScreen && !document.hidden);
    });
    io.observe(wrap);
    const onVisibility = () => setRunning(onScreen && !document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", measure);
      if (velocity) window.removeEventListener("scroll", onScroll);
    };
  }, [baseSpeed, direction, velocity]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
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
