import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/page/cta-band";
import { MuxVideo } from "@/components/mux-video";
import { Parallax } from "@/components/scroll/parallax";
import { MaskReveal } from "@/components/scroll/mask-reveal";
import { Marquee } from "@/components/scroll/marquee";
import { SplitReveal } from "@/components/scroll/split-reveal";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  alternates: { canonical: "/purpose" },
  title: "Purpose",
  description:
    "Bicycle is a proud B Corp. From sustainable choices to our partnership with XO Bikes, we work with purpose-driven companies to make a meaningful impact.",
};

// Accreditations and partners. White marks sit straight on the navy band; the
// Great Release lockup is black-on-white, so it rides in a light chip.
const PARTNERS: {
  src: string;
  alt: string;
  w: number;
  h: number;
  className: string;
  chip?: boolean;
}[] = [
  { src: "/images/bcorp-white.png", alt: "Certified B Corporation", w: 70, h: 118, className: "h-16 w-auto" },
  { src: "/images/purpose/logo-xo-bikes.png", alt: "XO Bikes", w: 456, h: 87, className: "h-7 w-auto sm:h-8" },
  { src: "/images/purpose/logo-recycle-to-work.png", alt: "Recycle to Work", w: 600, h: 504, className: "h-16 w-auto" },
  { src: "/images/purpose/logo-great-release.jpg", alt: "The Great Release", w: 868, h: 433, className: "h-11 w-auto", chip: true },
];

export default function PurposePage() {
  return (
    <>
      {/* Hero — the team and the XO bikes, image-led */}
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-navy text-white">
        <Image
          src="/images/purpose/hero.jpg"
          alt="The Bicycle team with XO Bikes"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />
        <Container className="relative z-10 pb-16 pt-44">
          <p className="label mb-5 flex items-center gap-2.5 text-brand">
            <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            B Corp certified
          </p>
          <MaskReveal
            as="h1"
            className="display text-6xl sm:text-7xl lg:text-8xl"
            lines={["Purpose"]}
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Doing right by our people, our partners and the planet. Built on the
            power of &lsquo;and&rsquo;.
          </p>
        </Container>
      </section>

      {/* Accreditations / partners — steady cruise, surges with scroll velocity */}
      <Marquee
        velocity
        className="bg-navy py-10"
        items={[...PARTNERS, ...PARTNERS, ...PARTNERS].flatMap((p, i) => [
          <span key={`p${i}`} className="inline-flex items-center px-8 sm:px-10">
            {p.chip ? (
              <span className="inline-flex items-center rounded-xl bg-white px-5 py-3">
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} className={p.className} />
              </span>
            ) : (
              <Image src={p.src} alt={p.alt} width={p.w} height={p.h} className={p.className} />
            )}
          </span>,
          <span key={`s${i}`} className="text-2xl font-extrabold text-white/20" aria-hidden>
            /
          </span>,
        ])}
      />

      {/* We're proud to be a B Corp */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/bicycle-london-limited/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-navy p-12 transition-colors duration-300 group-hover:bg-deep">
                <Image
                  src="/images/bcorp-white.png"
                  alt="Certified B Corporation"
                  width={160}
                  height={269}
                  className="h-40 w-auto transition-transform duration-500 ease-out group-hover:scale-105 sm:h-48"
                />
              </div>
              <span className="label mt-4 inline-flex items-center gap-2 text-black/50 transition-all group-hover:gap-3 group-hover:text-brand-ink">
                View our B Corp profile <span aria-hidden>→</span>
              </span>
            </a>
          </Reveal>
          <Reveal delay={120}>
            <SplitReveal
              as="h2"
              by="word"
              className="display text-3xl sm:text-4xl lg:text-5xl"
              text="We’re proud to be a B Corp"
            />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-black/70">
              <p>
                Overnight we became a B Corp. But our journey to certification has
                been a long and transformational one. It challenged us to become a
                better business today and think deeply about how we continue to
                improve and make a meaningful impact tomorrow.
              </p>
              <p>
                We take our time choosing the clients we work with, and deep-dive
                into the suppliers we use. We chose our home based on its
                sustainability standards and we carry this through everything we
                do.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Looking after our people */}
      <Section tone="paper">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Parallax speed={0.12} className="absolute inset-x-0 -inset-y-[12%]">
                <Image
                  src="/images/purpose/people.jpg"
                  alt="The Bicycle team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:order-1">
            <SplitReveal
              as="h2"
              by="word"
              className="display text-2xl leading-[1.1] sm:text-3xl lg:text-[2.5rem]"
              text="We look after our people with a whole-person approach to healthcare, and in turn they choose to look after each other."
            />
            <p className="mt-6 text-lg leading-relaxed text-black/70">
              We&rsquo;re putting lots of small measures in place, but becoming a B
              Corp is no small feat. We&rsquo;re now part of a community aiming to
              drive change and help each other.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* XO Bikes */}
      <Section tone="navy">
        <div className="mx-auto max-w-3xl">
          <Image
            src="/images/purpose/logo-xo-bikes.png"
            alt="XO Bikes"
            width={456}
            height={87}
            className="h-9 w-auto sm:h-11"
          />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/75">
            <p>
              At Bicycle, we believe in leaving the industry better than we found
              it. That&rsquo;s why we set out to partner with companies that have a
              real purpose.
            </p>
            <p>
              Teaming up with the charity{" "}
              <a
                href="https://www.linkedin.com/company/onwards-and-upwards-group/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline-offset-4 hover:underline"
              >
                Onwards &amp; Upwards
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/company/xobikes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline-offset-4 hover:underline"
              >
                XO Bikes
              </a>{" "}
              has been a no-brainer. At XO Bikes, ex-offenders learn to repair and
              recycle bikes through their programme, giving wheels a second chance
              and getting people back on the road in the process.
            </p>
          </div>

          <SplitReveal
            as="blockquote"
            by="word"
            className="my-10 border-l-4 border-brand pl-6 font-display text-2xl font-bold uppercase leading-[1.15] text-brand sm:text-3xl"
            text="It’s a genuinely lovely organisation, run by amazing people, that is trying to change a system that’s broken."
          />

          <div className="space-y-5 text-lg leading-relaxed text-white/75">
            <p>
              The impact they have on their community of XO&rsquo;s goes beyond just
              bikes. It&rsquo;s about building confidence, providing mental health
              support, and giving them a much-needed job to get themselves back on
              two feet when they are released. As XO founder{" "}
              <a
                href="https://www.linkedin.com/in/stef-jones-65b52a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline-offset-4 hover:underline"
              >
                Stef Jones
              </a>{" "}
              put it, it&rsquo;s not a bike business, it&rsquo;s a bloke business.
            </p>
          </div>

          <Reveal className="mt-10">
            <MuxVideo
              playbackId="3kub5N1MsStvEnTNLQ0002TXTbcMWI6XTdQo01FbwWJbXU"
              title="XO Bikes"
            />
          </Reveal>
        </div>
      </Section>

      {/* Recycle to Work + The Great Release */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-navy">
              <Image
                src="/images/purpose/giving-back.jpg"
                alt="A refurbished XO bike"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SplitReveal
              as="h2"
              by="word"
              className="display text-2xl leading-[1.15] sm:text-3xl"
              text="We support XO Bikes with their recycle-to-work scheme, giving employees access to a completely refurbished, warranty-holding bike at around half the price of its retail equivalent."
            />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-black/70">
              <p>
                We also took part in their mammoth charity bike ride, The Great
                Release: an epic one-day, prison-to-prison ride through Surrey,
                starting from HMP Wandsworth and finishing at Herne Hill, measuring
                an almighty 125km.
              </p>
              <p>
                We proudly support them with giving-back days too. A chance to meet
                Stef and the XO Bikes team at their workshop, hear the team&rsquo;s
                stories and see the great work they do.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Donate */}
      <section className="overflow-hidden bg-brand px-5 py-20 text-center text-black sm:px-8 sm:py-28">
        <h2 className="display mx-auto max-w-3xl text-4xl sm:text-5xl">
          Donate your bike and help rebuild a life
        </h2>
        <div className="mt-10">
          <ButtonLink
            href="https://xobikes.com/donate/"
            variant="dark"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Make a donation
          </ButtonLink>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
