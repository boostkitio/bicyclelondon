"use client";

import { useState } from "react";
import Image from "next/image";

export function Avatar({
  src,
  name,
  initials,
}: {
  src: string;
  name: string;
  initials: string;
}) {
  const [err, setErr] = useState(false);

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-navy">
      {!err ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold tracking-tight text-brand">
          {initials}
        </div>
      )}
    </div>
  );
}
