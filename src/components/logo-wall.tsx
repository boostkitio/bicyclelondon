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

  // Seamless grid: hairline dividers via left/top on the wrapper and
  // right/bottom on each cell, so there are no gaps between logos. Full
  // colour, lifting and scaling on hover. 2 → 3 → 5 columns.
  return (
    <div className="grid grid-cols-2 border-l border-t border-black/[0.08] sm:grid-cols-3 lg:grid-cols-5">
      {clients.map((c) => (
        <div
          key={c._id}
          className="group flex aspect-[3/2] items-center justify-center border-b border-r border-black/[0.08] p-6 transition-colors duration-300 hover:bg-white sm:p-8"
        >
          {c.logo?.asset && (
            <Image
              src={urlFor(c.logo).height(120).fit("max").url()}
              alt={c.name}
              width={180}
              height={70}
              className="max-h-11 w-auto object-contain transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 sm:max-h-14"
            />
          )}
        </div>
      ))}
    </div>
  );
}
