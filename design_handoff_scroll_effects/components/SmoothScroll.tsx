'use client';
import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

/**
 * App-wide smooth scroll (Lenis) synced with GSAP ScrollTrigger.
 *
 * Wrap your app once, in app/layout.tsx:
 *
 *   import SmoothScroll from '@/components/scroll/SmoothScroll';
 *   ...
 *   <body><SmoothScroll>{children}</SmoothScroll></body>
 *
 * Key points:
 *  - `autoRaf: false` — we drive Lenis from GSAP's single ticker instead of its
 *    own rAF, so smoothing and every ScrollTrigger update share one loop (no
 *    drift between the scrubbed pins and the smoothed scroll).
 *  - `lenis.on('scroll', ScrollTrigger.update)` keeps triggers in lockstep.
 *  - Reduced-motion users get native scrolling (Lenis is destroyed).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // ReactLenis sets ref.current = { lenis, ... }
  const lenisRef = useRef<{ lenis?: any } | null>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis.destroy();
      return;
    }

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const update = (time: number) => lenis.raf(time * 1000); // GSAP time is seconds
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Layout may shift after fonts/images — recompute pin distances.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef as any}
      options={{
        autoRaf: false,
        duration: 1.1,
        smoothWheel: true,
        // touch devices keep native scrolling by default — feels better on mobile
      }}
    >
      {children}
    </ReactLenis>
  );
}

/*
 * Anchor links / programmatic scroll:
 * Lenis intercepts scrolling, so use its scrollTo instead of hash jumps or
 * element.scrollIntoView():
 *
 *   import { useLenis } from 'lenis/react';
 *   const lenis = useLenis();              // inside any component under <SmoothScroll>
 *   lenis?.scrollTo('#contact', { offset: -80 });
 */
