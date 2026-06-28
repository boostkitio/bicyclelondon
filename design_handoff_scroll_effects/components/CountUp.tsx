'use client';
import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Counts up from 0 to `to` once, when it scrolls into view.
 * <CountUp to={215} suffix="+" />   <CountUp to={900} prefix="£" suffix="M" />
 */
export default function CountUp({
  to,
  prefix = '',
  suffix = '',
  duration = 1.6,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const obj = { v: 0 };
          gsap.to(obj, { v: to, duration, ease: 'power2.out', onUpdate: () => setVal(Math.round(obj.v)) });
        },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}
