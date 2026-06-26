"use client";
import { ReactLenis } from "lenis/react";
import type Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * App-wide smooth scroll (Lenis) synced with GSAP ScrollTrigger.
 * Wrapped once in the root layout.
 *
 *  - `autoRaf: false` — Lenis is driven from GSAP's single ticker, so smoothing
 *    and every ScrollTrigger update share one loop (no drift between the
 *    scrubbed pins and the smoothed scroll).
 *  - The ticker reads the Lenis instance from the ref each frame, so it works
 *    even though ReactLenis only creates the instance a render after mount.
 *  - Reduced-motion users get native scrolling: Lenis is never mounted (so it
 *    can't intercept the wheel), and consumers that scroll programmatically
 *    (ScrollToTop, Logo) fall back to window.scrollTo.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<{ lenis?: Lenis } | null>(null);
  const [enabled, setEnabled] = useState(true);

  // Decide native vs smooth from the reduced-motion preference (and react to changes).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onLenisScroll = () => ScrollTrigger.update();
    let scrollBound = false;
    const update = (time: number) => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (!scrollBound) {
        lenis.on("scroll", onLenisScroll); // bind once, as soon as it exists
        scrollBound = true;
      }
      lenis.raf(time * 1000); // GSAP time is seconds
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    // Layout may shift after fonts/images load — recompute pin distances.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off("scroll", onLenisScroll);
    };
  }, [enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef as never}
      options={{ autoRaf: false, duration: 1.1, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
