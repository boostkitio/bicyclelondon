import Image from "next/image";
import { TEAM, photoSlug } from "@/content/team";

// A scrolling strip of headshots for the homepage culture band.
export function TeamStrip() {
  const people = TEAM.filter(
    (m) => !["Baxter", "Luna", "Nelly"].includes(m.name),
  ).slice(0, 18);
  const row = [...people, ...people];

  return (
    <div className="marquee relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
      <div
        className="marquee-track flex w-max gap-5"
        style={{ ["--marquee-duration" as string]: "60s" }}
      >
        {row.map((m, i) => (
          <div
            key={`${m.name}-${i}`}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-black/5 sm:h-28 sm:w-28"
          >
            <Image
              src={`/team/${photoSlug(m.name)}.jpg`}
              alt={m.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
