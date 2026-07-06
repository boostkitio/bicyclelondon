"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { resolveCursorState, type CursorState } from "./cursor-label";

/**
 * Contextual custom cursor. A dot eases toward the pointer; over any element
 * carrying `data-cursor` it grows to a ring and can show a word. Disabled on
 * coarse pointers and under reduced motion (native cursor returns). The label
 * is decorative (aria-hidden) and never affects focus or tab order.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({ variant: "dot", label: "" });

  // Only enable on fine pointers with motion allowed. Checked on the client.
  useEffect(() => {
    if (reduced) return setEnabled(false);
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;
    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      // Throttle state resolution to one per frame.
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setState(resolveCursorState(document.elementFromPoint(e.clientX, e.clientY)));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const scale = state.variant === "dot" ? 1 : state.label ? 3.4 : 2.4;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: "transform" }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-brand text-[0.6rem] font-bold uppercase tracking-[0.14em] text-black transition-[width,height] duration-300 ease-out"
        style={{
          width: state.label ? "4.5rem" : "0.75rem",
          height: state.label ? "4.5rem" : "0.75rem",
          transform: state.label ? "none" : `scale(${scale})`,
        }}
      >
        {state.label}
      </div>
    </div>
  );
}
