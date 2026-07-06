"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { initials } from "@/content/team";
import type { Testimonial } from "@/sanity/lib/types";

const VISIBLE = 3; // front card + this many fanned behind it

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const n = items.length;

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + n) % n),
    [n],
  );

  useEffect(() => {
    if (n <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(id);
  }, [n, paused, go]);

  if (n === 0) return null;

  return (
    <div
      className="mx-auto max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative h-[26rem] select-none [perspective:1400px] focus:outline-none sm:h-[24rem]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials, use the left and right arrow keys to navigate"
        tabIndex={0}
        data-cursor="Drag"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          }
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          if (Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
          drag.current = null;
        }}
        onPointerLeave={() => (drag.current = null)}
      >
        {items.map((t, i) => {
          const offset = (i - active + n) % n;
          const shown = offset <= VISIBLE;
          const o = Math.min(offset, VISIBLE);
          return (
            <article
              key={t._id}
              aria-hidden={offset !== 0}
              className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_24px_60px_-24px_rgba(11,15,38,0.35)] ring-1 ring-black/[0.06] transition-all duration-500 ease-out sm:p-10"
              style={{
                transform: `translateX(${o * 26}px) translateY(${o * 6}px) scale(${1 - o * 0.05}) rotate(${o * 2.5}deg)`,
                opacity: shown ? 1 : 0,
                zIndex: n - offset,
                pointerEvents: offset === 0 ? "auto" : "none",
              }}
            >
              <p className="font-display text-3xl leading-none text-brand">“</p>
              <blockquote className="-mt-4 text-xl font-medium leading-snug text-navy sm:text-2xl lg:text-[1.75rem]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-sm font-bold text-brand">
                  {t.photo?.asset ? (
                    <Image
                      src={urlFor(t.photo).width(88).height(88).url()}
                      alt={t.authorName}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(t.authorName)
                  )}
                </span>
                <span className="leading-tight">
                  <cite className="block font-display text-sm font-bold uppercase not-italic text-navy">
                    {t.authorName}
                  </cite>
                  <span className="text-sm text-black/55">
                    {[t.authorRole, t.company].filter(Boolean).join(", ")}
                  </span>
                </span>
              </figcaption>
            </article>
          );
        })}
      </div>

      {n > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
            {items.map((t, i) => (
              <button
                key={t._id}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-7 bg-brand" : "w-1.5 bg-black/15 hover:bg-black/30"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 transition hover:bg-navy hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 transition hover:bg-navy hover:text-white"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
