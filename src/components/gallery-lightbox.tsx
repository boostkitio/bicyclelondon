"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";

/**
 * Case-study gallery grid whose images open in a full-screen lightbox.
 * Keyboard: Esc closes, arrow keys move between images. The backdrop and
 * the close button also close it; body scroll locks while open (same
 * pattern as the mobile menu in site-header).
 */
export function GalleryLightbox({
  images,
  title,
}: {
  images: SanityImage[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const count = images.length;

  // Portal target is only available in the browser.
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) => (cur === null ? cur : (cur + dir + count) % count)),
    [count],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open !== null ? images[open] : null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {images.map((img, i) => (
          <Reveal key={i} delay={(i % 2) * 80}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View image ${i + 1} of ${count}: ${img.alt || title}`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-paper text-left"
            >
              <Image
                src={urlFor(img).width(1000).height(700).url()}
                alt={img.alt || title}
                width={1000}
                height={700}
                sizes="(max-width: 640px) 100vw, 512px"
                className="h-auto w-full transition duration-500 group-hover:scale-105"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {mounted &&
        current &&
        open !== null &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || `${title} image ${open + 1} of ${count}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4 sm:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-brand hover:text-black"
          >
            ×
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand hover:text-black sm:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand hover:text-black sm:right-6"
              >
                →
              </button>
            </>
          )}

          <figure
            className="max-h-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlFor(current).width(1800).fit("max").url()}
              alt={current.alt || title}
              width={1800}
              height={1200}
              sizes="100vw"
              className="max-h-[82vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between text-sm text-white/70">
              <span>{current.alt || title}</span>
              {count > 1 && (
                <span className="tabular-nums">
                  {open + 1} / {count}
                </span>
              )}
            </figcaption>
          </figure>
        </div>,
          document.body,
        )}
    </>
  );
}
