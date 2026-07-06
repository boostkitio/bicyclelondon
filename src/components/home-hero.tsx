"use client";
import { useRef } from "react";
import { HeroScene } from "@/components/scroll/hero-scene";
import { HeroFusion } from "@/components/hero-fusion";

/** Client wrapper: connects HeroScene's scroll velocity to the wheel. */
export function HomeHero() {
  const velocityRef = useRef(0);
  return (
    <HeroScene onVelocity={(b) => (velocityRef.current = b)}>
      <HeroFusion velocityRef={velocityRef} />
    </HeroScene>
  );
}
