import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pelotonQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { initials } from "@/content/team";
import type { PelotonMember } from "@/sanity/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/the-peloton" },
  title: "The Peloton",
  description:
    "Meet the Peloton, the curious, intelligent and lovely people behind Bicycle. A fast-growing, 100% independent media and creative agency.",
};

function MemberCard({ m }: { m: PelotonMember }) {
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-navy">
        {m.photo?.asset && (
          <Image
            src={urlFor(m.photo).width(500).height(500).url()}
            alt={m.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {m.hoverPhoto?.asset && (
          <Image
            src={urlFor(m.hoverPhoto).width(500).height(500).url()}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        {!m.photo?.asset && (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold tracking-tight text-brand">
            {initials(m.name)}
          </div>
        )}
        {m.linkedin && (
          <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-md bg-white/90 text-navy opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zM10 8.98h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.06 0 4.81 2.67 4.81 6.14v6.28h-4v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67h-4v-12z" />
            </svg>
          </span>
        )}
      </div>
      <h2 className="mt-3 font-display text-base font-bold uppercase leading-tight transition-colors group-hover:text-brand-ink">
        {m.name}
      </h2>
      <p className="mt-0.5 text-sm text-black/60">{m.role}</p>
    </div>
  );
}

export default async function PelotonPage() {
  const people = await sanityFetch<PelotonMember[]>({
    query: pelotonQuery,
    tags: ["pelotonMember"],
  });

  return (
    <>
      <PageHero
        eyebrow="Our people"
        title="The Peloton"
        lead="The curious, intelligent and lovely people who make Bicycle."
        image="/images/heroes/peloton.jpg"
        videoPlaybackId="tcxmmQH34tp5Y78V9XE4Gdq5AmIkQPEH00Pavn4FDJts"
      />
      <Section>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {people.map((m, i) => (
            <Reveal key={m._id} delay={(i % 4) * 80}>
              {m.linkedin ? (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  data-cursor="View"
                >
                  <MemberCard m={m} />
                </a>
              ) : (
                <MemberCard m={m} />
              )}
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand
        heading="Like the look of us? We’re always after good people."
        label="See open roles"
        href="/careers"
      />
    </>
  );
}
