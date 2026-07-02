"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// The player (Media Chrome + hls.js) is a heavy chunk; load it only when the
// hero is near the viewport so it never blocks first paint or hydration.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

/**
 * Muted, looping, controls-free background video for hero sections.
 * Paints the poster immediately via next/image; the Mux player mounts on
 * top once the section approaches the viewport.
 */
export function MuxBg({
  playbackId,
  poster,
}: {
  playbackId: string;
  poster?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {shouldLoad && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={playbackId}
          autoPlay="muted"
          loop
          muted
          preload="none"
          nohotkeys
          envKey={process.env.NEXT_PUBLIC_MUX_ENV_KEY}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            "--controls": "none",
            "--media-object-fit": "cover",
          }}
        />
      )}
    </div>
  );
}
