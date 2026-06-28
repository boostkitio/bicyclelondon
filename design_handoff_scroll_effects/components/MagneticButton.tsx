'use client';
import { useRef, type ReactNode } from 'react';

/**
 * Magnetic button — vanilla + Tailwind. The button drifts toward the cursor
 * over a padded hit-area and springs back on leave.
 * Disabled by media query on touch / reduced-motion (no hover there anyway).
 */
export default function MagneticButton({
  children,
  strength = 0.4,
  className = 'rounded-[60px] bg-deep px-14 py-6 font-display text-xl font-extrabold uppercase tracking-[0.02em] text-acid',
  onClick,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const area = areaRef.current;
    const btn = btnRef.current;
    if (!area || !btn) return;
    const r = area.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate(${x * strength}px, ${y * strength * 1.25}px)`;
  };
  const reset = () => { if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)'; };

  return (
    <div ref={areaRef} onMouseMove={onMove} onMouseLeave={reset} className="inline-flex p-8">
      <button
        ref={btnRef}
        onClick={onClick}
        className={`cursor-pointer border-none transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)] ${className}`}
      >
        {children}
      </button>
    </div>
  );
}
