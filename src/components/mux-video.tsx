"use client";

import MuxPlayer from "@mux/mux-player-react";

export function MuxVideo({
  playbackId,
  title,
}: {
  playbackId: string;
  title?: string;
}) {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      metadata={{ video_title: title ?? "Bicycle London" }}
      accentColor="#00ff00"
      style={{ aspectRatio: "16 / 9", borderRadius: "1rem", overflow: "hidden" }}
    />
  );
}
