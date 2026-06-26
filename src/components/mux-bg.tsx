"use client";

import MuxPlayer from "@mux/mux-player-react";

/**
 * Muted, looping, controls-free background video for hero sections.
 */
export function MuxBg({
  playbackId,
  poster,
}: {
  playbackId: string;
  poster?: string;
}) {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      autoPlay="muted"
      loop
      muted
      preload="auto"
      nohotkeys
      poster={poster}
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
  );
}
