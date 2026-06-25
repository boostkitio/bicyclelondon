import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { clientsWallQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";

type WallClient = { _id: string; name: string; logo: SanityImage };

export async function LogoWall() {
  const clients = await sanityFetch<WallClient[]>({
    query: clientsWallQuery,
    tags: ["client"],
  });
  if (clients.length === 0) return null;

  // Duplicate the row so the marquee loops seamlessly.
  const row = [...clients, ...clients];

  return (
    <div className="marquee group relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
      <div
        className="marquee-track flex w-max items-center gap-12 sm:gap-16"
        style={{ ["--marquee-duration" as string]: "55s" }}
      >
        {row.map((c, i) => (
          <div
            key={`${c._id}-${i}`}
            className="flex h-16 w-28 shrink-0 items-center justify-center sm:w-32"
          >
            {c.logo?.asset && (
              <Image
                src={urlFor(c.logo).height(96).fit("max").url()}
                alt={c.name}
                width={128}
                height={48}
                className="max-h-12 w-auto object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
