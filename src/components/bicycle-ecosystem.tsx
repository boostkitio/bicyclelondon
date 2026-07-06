import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";

// Real sub-brand accents (sampled from the logos).
const GREEN = "#00d400";
const ORANGE = "#f08040";
const CORAL = "#f06060";

type Label = { x: string; y: string; w: string; el: ReactNode };

const brandLogo = "mx-auto h-7 w-auto sm:h-9";
const brandSub = "mt-3 text-[11px] leading-snug text-white/75 sm:text-sm";
const overlap = "text-[11px] font-medium leading-snug text-white/85 sm:text-sm";

const LABELS: Label[] = [
  {
    x: "51%",
    y: "16%",
    w: "40%",
    el: (
      <>
        <Image
          src="/images/logo-bicycle-white.png"
          alt="Bicycle"
          width={10001}
          height={3295}
          className={brandLogo}
        />
        <p className={brandSub}>
          ‘Brand-first’ media planning, buying &amp; consultancy
        </p>
      </>
    ),
  },
  {
    x: "26%",
    y: "66%",
    w: "26%",
    el: (
      <>
        <Image
          src="/images/logo-studio.png"
          alt="Bicycle Studio"
          width={1117}
          height={399}
          className={brandLogo}
        />
        <p className={brandSub}>Production solutions</p>
      </>
    ),
  },
  {
    x: "74%",
    y: "65%",
    w: "28%",
    el: (
      <>
        <Image
          src="/images/logo-blade.png"
          alt="Bicycle Blade"
          width={1043}
          height={400}
          className={brandLogo}
        />
        <p className={brandSub}>
          ‘Performance-first’ media planning, buying &amp; consultancy
        </p>
      </>
    ),
  },
  {
    x: "40%",
    y: "45%",
    w: "17%",
    el: (
      <p className={overlap}>
        ‘Brand-first’ Creative <strong className="font-bold text-white">AND</strong> Media Solutions
      </p>
    ),
  },
  {
    x: "61%",
    y: "45%",
    w: "16%",
    el: (
      <p className={overlap} style={{ color: ORANGE }}>
        Performance <strong className="font-bold">AND</strong> Brand Solutions
      </p>
    ),
  },
  {
    x: "50%",
    y: "56%",
    w: "13%",
    el: <p className="text-xs font-bold leading-tight text-white sm:text-base">C-Suite Strategy</p>,
  },
  {
    x: "50%",
    y: "73%",
    w: "17%",
    el: (
      <p className={overlap} style={{ color: ORANGE }}>
        ‘Performance-first’ Creative <strong className="font-bold">AND</strong> Media Solutions
      </p>
    ),
  },
];

export function BicycleEcosystem() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-white sm:py-32">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="label mb-4 justify-center text-brand">The ecosystem</p>
          <h2 className="display text-4xl sm:text-5xl">One agency, joined up</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Bicycle, Studio and Blade overlap by design, so brand and performance
            meet in the middle, with C-suite strategy at the centre of it all.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-16 aspect-[16/9] max-w-4xl">
          <svg
            viewBox="0 0 2000 1125"
            className="absolute inset-0 h-full w-full"
            fill="none"
            aria-hidden
          >
            <circle
              className="eco-ring"
              cx="1015"
              cy="375"
              r="335"
              stroke={GREEN}
              strokeWidth="2.5"
              strokeDasharray="9 13"
            />
            <circle
              className="eco-ring eco-ring--slow"
              cx="800"
              cy="720"
              r="350"
              stroke={ORANGE}
              strokeWidth="2.5"
              strokeDasharray="9 13"
            />
            <circle
              className="eco-ring eco-ring--rev"
              cx="1225"
              cy="720"
              r="350"
              stroke={CORAL}
              strokeWidth="2.5"
              strokeDasharray="9 13"
            />
          </svg>

          {LABELS.map((l, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: l.x, top: l.y, width: l.w }}
            >
              <Reveal delay={200 + i * 90}>{l.el}</Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
