"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Same deferral as MuxBg: film grids can mount several players at once, so
// each one waits until it nears the viewport before pulling in the chunk.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

export function MuxVideo({
  playbackId,
  title,
}: {
  playbackId: string;
  title?: string;
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
    <div
      ref={ref}
      className="bg-navy/10"
      style={{ aspectRatio: "16 / 9", borderRadius: "1rem", overflow: "hidden" }}
    >
      {shouldLoad && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={playbackId}
          metadata={{ video_title: title ?? "Bicycle London" }}
          envKey={process.env.NEXT_PUBLIC_MUX_ENV_KEY}
          accentColor="#00ff00"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
