"use client";
import { useRef, type ReactNode } from "react";
import Link from "next/link";

/**
 * Magnetic button — vanilla. The inner element drifts toward the cursor over a
 * padded hit-area and springs back on leave. The magnetic pull does nothing on
 * touch (no hover), which is correct.
 *
 * Renders a Next.js <Link> when `href` is set, otherwise a <button>. The moving
 * element is found by query (firstElementChild) so there's no dual-typed ref.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  strength = 0.4,
  className = "rounded-full bg-deep px-12 py-5 text-lg font-bold uppercase tracking-[0.02em] text-brand",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  strength?: number;
  className?: string;
}) {
  const areaRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const area = areaRef.current;
    const el = area?.firstElementChild as HTMLElement | null;
    if (!area || !el) return;
    const r = area.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength * 1.25}px)`;
  };
  const reset = () => {
    const el = areaRef.current?.firstElementChild as HTMLElement | null;
    if (el) el.style.transform = "translate(0,0)";
  };

  const shared = `inline-block cursor-pointer border-none text-center transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none ${className}`;

  return (
    <div ref={areaRef} onMouseMove={onMove} onMouseLeave={reset} className="inline-flex p-6">
      {href ? (
        <Link href={href} onClick={onClick} className={shared}>
          {children}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={shared}>
          {children}
        </button>
      )}
    </div>
  );
}
