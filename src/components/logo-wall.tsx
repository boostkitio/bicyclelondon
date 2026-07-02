import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { clientsWallQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { SanityImage } from "@/sanity/lib/types";

type WallClient = { _id: string; name: string; logo: SanityImage };

// A few logos have thin marks or extra whitespace, so the shared height cap
// renders them small. Give those more room so the wall reads evenly.
function logoSize(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("opentable") || n.includes("open table"))
    return "max-h-14 sm:max-h-[4.25rem]";
  if (n.includes("warner")) return "max-h-16 sm:max-h-[5rem]";
  if (n.includes("five guys")) return "max-h-12 sm:max-h-[3.75rem]";
  if (n.includes("joe")) return "max-h-16 sm:max-h-[5rem]";
  return "max-h-11 sm:max-h-14";
}

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
          className="group flex aspect-[3/2] items-center justify-center border-b border-r border-black/[0.08] p-5 transition-colors duration-300 hover:bg-white sm:p-7"
        >
          {c.logo?.asset && (
            <Image
              src={urlFor(c.logo).height(300).fit("max").url()}
              alt={c.name}
              width={200}
              height={90}
              className={cn(
                "w-auto max-w-full object-contain transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110",
                logoSize(c.name),
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
