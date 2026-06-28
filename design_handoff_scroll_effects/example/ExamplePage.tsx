'use client';
import React from 'react';
import Parallax from '../components/Parallax';
import Marquee from '../components/Marquee';
import KineticPairs from '../components/KineticPairs';
import HorizontalGallery from '../components/HorizontalGallery';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import StickyServices from '../components/StickyServices';
import MagneticButton from '../components/MagneticButton';

const stripe = 'repeating-linear-gradient(125deg,#1b2670 0 16px,#16205f 16px 32px)';

/** Striped stand-in — swap for a real <Image>/photo. */
function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center font-mono text-[13px] uppercase tracking-[0.16em] text-white/30"
      style={{ background: stripe }}
    >
      [ {label} ]
    </div>
  );
}

const cards = [
  ['Built for speed', 'Endurance Sportswear', 'Brand & Performance'],
  ['City in motion', 'Metro Transit', 'Media & Data'],
  ['Pour decisions', 'Craft Spirits Co.', 'Art & Science'],
  ['Future fresh', 'Greengrocer Direct', 'Brand & Creative'],
];

const pairs: [string, string][] = [
  ['Data', 'Digital'], ['Man', 'Machine'], ['Media', 'Creative'], ['Art', 'Science'],
];

const services = [
  ['01', 'Media planning & buying', 'media planning'],
  ['02', 'Creative & production', 'creative studio'],
  ['03', 'Data & analytics', 'data & analytics'],
  ['04', 'Social & content', 'social & content'],
];

/**
 * Full assembly of every effect, in Tailwind. Wrap the app in <SmoothScroll>
 * (layout.tsx) for the Lenis glide. Reference — adapt copy + swap placeholders.
 */
export default function ExamplePage() {
  return (
    <main className="bg-navy font-display text-paper">
      {/* HERO */}
      <section className="relative flex h-screen items-center overflow-hidden">
        <Parallax speed={0.18} className="absolute inset-x-0 -inset-y-[12%]">
          <div className="absolute inset-0" style={{ background: stripe }} />
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,27,84,0.55),rgba(18,27,84,0.78)_55%,#121B54)]" />
        <Parallax speed={-0.12} className="relative z-10 max-w-[1200px] px-6 md:px-10">
          <div className="mb-6 font-mono text-[15px] uppercase tracking-[0.18em] text-acid">
            Independent integrated media &amp; creative agency
          </div>
          <h1 className="m-0 text-[clamp(54px,9.5vw,150px)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
            Built on the<br />power of <span className="text-acid">and</span>
          </h1>
        </Parallax>
      </section>

      {/* MARQUEE */}
      <Marquee
        direction={-1}
        className="border-y-[3px] border-deep bg-acid py-7 text-deep"
        items={['Data', 'Man', 'Media', 'Art', 'Brand'].flatMap((w, i) => [
          <span key={`w${i}`} className="px-7 text-[46px] font-extrabold uppercase tracking-[-0.02em]">
            {w} <span className="font-normal">&amp;</span> {['Digital', 'Machine', 'Creative', 'Science', 'Performance'][i]}
          </span>,
          <span key={`s${i}`} className="text-[46px] font-extrabold opacity-40">/</span>,
        ])}
      />

      {/* PINNED KINETIC PAIRS */}
      <KineticPairs pairs={pairs} />

      {/* HORIZONTAL WORK GALLERY */}
      <HorizontalGallery
        heading={
          <h2 className="m-0 text-[clamp(32px,5vw,72px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
            Selected work
          </h2>
        }
      >
        {cards.map(([title, client, tag], i) => (
          <article key={i} className="w-[82vw] shrink-0 snap-start md:w-[46vw] md:min-w-[380px]">
            <div className="relative flex h-[56vh] min-h-[340px] items-end overflow-hidden rounded-md p-6">
              <Placeholder label="campaign image" />
              <span className="absolute left-5 top-5 rounded-[30px] bg-acid px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-deep">
                {tag}
              </span>
              <h3 className="relative m-0 text-[34px] font-extrabold uppercase tracking-[-0.02em]">{title}</h3>
            </div>
            <div className="mt-4 font-mono text-[13px] uppercase tracking-[0.1em] text-white/55">{client}</div>
          </article>
        ))}
      </HorizontalGallery>

      {/* STATS */}
      <section className="bg-navy px-6 py-[130px] md:px-10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 md:grid-cols-4">
          {[
            [<CountUp key="a" to={27} />, 'Years independent', false],
            [<CountUp key="b" to={215} suffix="+" />, 'Industry awards', true],
            [<CountUp key="c" to={900} prefix="£" suffix="M" />, 'Media under management', false],
            [<CountUp key="d" to={140} />, 'People & counting', true],
          ].map(([num, label, green], i) => (
            <div key={i} className="border-t-2 border-white/15 pt-6 text-center">
              <div className={`text-[clamp(48px,7vw,108px)] font-extrabold leading-none tracking-[-0.04em] ${green ? 'text-acid' : 'text-paper'}`}>
                {num as React.ReactNode}
              </div>
              <div className="mt-3.5 font-mono text-[13px] uppercase tracking-[0.1em] text-white/60">{label as string}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO REVEAL */}
      <section className="bg-deep px-6 py-40 md:px-10">
        <div className="mx-auto max-w-[1100px]">
          <Reveal
            lines={[
              <>We don&rsquo;t pick</>,
              <>data <span className="font-normal text-acid">or</span> instinct.</>,
              <>media <span className="font-normal text-acid">or</span> creative.</>,
              <>We choose <span className="text-acid">and.</span></>,
            ]}
          />
        </div>
      </section>

      {/* STICKY SERVICES */}
      <StickyServices
        media={services.map(([, , label], i) => (
          <div key={i} className="relative h-full w-full">
            <Placeholder label={label} />
          </div>
        ))}
        blocks={services.map(([n, title]) => (
          <div key={n}>
            <div className="mb-[18px] font-mono text-[13px] tracking-[0.16em] text-acid">{n}</div>
            <h3 className="m-0 text-[clamp(32px,4vw,56px)] font-extrabold uppercase leading-none tracking-[-0.02em]">{title}</h3>
          </div>
        ))}
      />

      {/* CTA */}
      <section className="overflow-hidden bg-acid px-6 pb-[70px] pt-[150px] text-center text-deep md:px-10">
        <h2 className="mx-auto max-w-[1100px] text-[clamp(48px,9vw,140px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          Let&rsquo;s build something &amp;
        </h2>
        <div className="mt-14">
          <MagneticButton>Start a project</MagneticButton>
        </div>
      </section>
    </main>
  );
}
