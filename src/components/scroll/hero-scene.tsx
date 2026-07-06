"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { accumulateBoost } from "./velocity";

/**
 * A hero region that reports a decaying scroll-velocity "boost" to its children
 * so signature elements (e.g. the ampersand wheel) can react to scroll speed.
 * The boost accumulates from wheel/scroll movement and bleeds off every frame.
 * Reduced motion / coarse pointer: children render statically, onVelocity is
 * never called. The subtle headline parallax is applied by the caller via the
 * existing Parallax component; HeroScene only supplies velocity.
 */
export function HeroScene({
  children,
  className = "",
  onVelocity,
}: {
  children: ReactNode;
  className?: string;
  onVelocity?: (boost: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const boost = useRef(0);

  useEffect(() => {
    if (!onVelocity) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      let lastY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        boost.current = accumulateBoost(boost.current, y - lastY);
        lastY = y;
      };
      const tick = () => {
        boost.current *= 0.9;
        onVelocity(boost.current);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      gsap.ticker.add(tick);
      return () => {
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(tick);
      };
    });
    return () => mm.revert();
  }, [onVelocity]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
