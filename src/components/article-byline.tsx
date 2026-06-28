import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Article } from "@/sanity/lib/types";

const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z";

function initials(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function ArticleByline({
  author,
  date,
}: {
  author: NonNullable<Article["author"]>;
  date?: string;
}) {
  const name = author.name ?? "Bicycle";
  const imgUrl = author.image?.asset
    ? urlFor(author.image).width(112).height(112).fit("crop").url()
    : null;
  const meta = [author.role, date].filter(Boolean).join(" · ");

  return (
    <div className="mb-10 flex items-center gap-4 border-b border-black/10 pb-8">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-navy ring-1 ring-black/5">
        {imgUrl ? (
          <Image src={imgUrl} alt={name} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-base font-bold text-brand">
            {initials(name)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {author.linkedin ? (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink transition hover:text-brand-ink"
            >
              {name}
            </a>
          ) : (
            <span className="font-semibold text-ink">{name}</span>
          )}
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className="text-black/35 transition hover:text-[#0a66c2]"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d={LINKEDIN_PATH} />
              </svg>
            </a>
          )}
        </div>
        {meta && <p className="mt-0.5 text-sm text-black/55">{meta}</p>}
      </div>
    </div>
  );
}
