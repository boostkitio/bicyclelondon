import Image from "next/image";
import { TEAM, photoSlug } from "@/content/team";

// Two woven rows of headshots that drift in opposite directions. At rest the
// faces sit in greyscale; on hover one lights up to full colour with an
// acid-green ring and its name + role, so the strip rewards a closer look.
const PEOPLE = TEAM.filter((m) => !["Baxter", "Luna", "Nelly"].includes(m.name));

function Face({ name, role }: { name: string; role: string }) {
  return (
    <figure className="group/face relative shrink-0">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-navy ring-2 ring-transparent grayscale-0 transition duration-500 ease-out group-hover/face:-translate-y-1.5 group-hover/face:shadow-xl group-hover/face:shadow-black/20 group-hover/face:ring-brand sm:h-28 sm:w-28 sm:grayscale sm:group-hover/face:grayscale-0">
        <Image
          src={`/team/${photoSlug(name)}.jpg`}
          alt={name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <figcaption className="pointer-events-none absolute left-1/2 top-full z-20 mt-2.5 w-max max-w-[12rem] -translate-x-1/2 translate-y-1 rounded-full bg-navy px-3.5 py-1.5 text-center opacity-0 shadow-lg transition duration-300 group-hover/face:translate-y-0 group-hover/face:opacity-100">
        <span className="block text-[11px] font-bold uppercase leading-tight tracking-wide text-white">
          {name}
        </span>
        <span className="block text-[10px] leading-tight text-brand">{role}</span>
      </figcaption>
    </figure>
  );
}

function Row({
  people,
  duration,
  reverse = false,
}: {
  people: typeof PEOPLE;
  duration: string;
  reverse?: boolean;
}) {
  const row = [...people, ...people];
  return (
    <div className="marquee group relative overflow-x-clip py-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />
      <div
        className={`marquee-track flex w-max gap-5 sm:gap-6 ${reverse ? "marquee-track--reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {row.map((m, i) => (
          <Face key={`${m.name}-${i}`} name={m.name} role={m.role} />
        ))}
      </div>
    </div>
  );
}

export function TeamStrip() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <Row people={PEOPLE.slice(0, 16)} duration="54s" />
      <Row people={PEOPLE.slice(16, 32)} duration="64s" reverse />
    </div>
  );
}
