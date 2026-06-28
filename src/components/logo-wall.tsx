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
    <div className="marquee group relative overflow-hidden border-y border-black/10 py-7">
      {/* edge fades (match the paper section background) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28" />
      <div
        className="marquee-track flex w-max items-center gap-10 sm:gap-14"
        style={{ ["--marquee-duration" as string]: "48s" }}
      >
        {row.map((c, i) => (
          <div
            key={`${c._id}-${i}`}
            className="group/logo flex h-16 w-32 shrink-0 items-center justify-center sm:w-40"
          >
            {c.logo?.asset && (
              <Image
                src={urlFor(c.logo).height(112).fit("max").url()}
                alt={c.name}
                width={160}
                height={56}
                className="max-h-14 w-auto object-contain opacity-45 grayscale transition duration-300 ease-out group-hover/logo:-translate-y-0.5 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
