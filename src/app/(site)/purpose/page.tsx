import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Purpose",
  description:
    "Bicycle is a proud B Corp. From sustainable choices to our partnership with XO Bikes, we work with purpose-driven companies to make a meaningful impact.",
};

export default function PurposePage() {
  return (
    <>
      <PageHero
        eyebrow="Purpose"
        title="We’re proud to be a B Corp"
        image="/images/heroes/purpose.jpg"
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Image
            src="/images/bcorp.png"
            alt="Certified B Corporation"
            width={90}
            height={140}
            className="mb-8 h-24 w-auto"
          />
          <div className="space-y-6 text-lg leading-relaxed text-black/75">
            <p>
              Overnight we became a B Corp. But our journey to certification has
              been a long and transformational one. It challenged us to become a
              better business today and think deeply about how we continue to
              improve and make a meaningful impact tomorrow.
            </p>
            <p>
              We take our time choosing the clients we work with, and deep-dive
              into the suppliers we use. We chose our home based on its
              sustainability standards and we carry this through everything we do.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display text-3xl sm:text-4xl">
              Looking after our people, so they look after each other
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-black/75">
              We look after our people with a whole-person approach to
              healthcare, and in turn they choose to look after each other.
              We’re putting lots of small measures in place, but becoming a B
              Corp is no small feat. We’re now part of a community aiming to
              drive change and help each other.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/purpose-people.jpg"
              alt="Bicycle people"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-ink">
            XO Bikes
          </p>
          <h2 className="mt-3 display text-3xl sm:text-4xl">
            Partnering with purpose
          </h2>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src="/images/purpose-xo.jpg"
              alt="XO Bikes"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <p>
              At Bicycle, we believe in leaving the industry better than we found
              it. That’s why we set out to partner with companies that have a
              real purpose. Teaming up with the charity Onwards &amp; Upwards and
              XO Bikes has been a no-brainer.
            </p>
            <p>
              At XO Bikes, ex-offenders learn to repair and recycle bikes through
              their programme, giving wheels a second chance and getting people
              back on the road in the process. As XO founder Stef Jones puts it,
              it’s not a bike business, it’s a bloke business.
            </p>
            <blockquote className="border-l-4 border-brand pl-6 font-display text-xl font-bold uppercase leading-snug">
              It’s a genuinely lovely organisation, run by amazing people, that is
              trying to change a system that’s broken.
            </blockquote>
            <p>
              We support XO Bikes with their recycle-to-work scheme, giving
              employees access to a completely refurbished, warranty-holding bike
              at around half the price of its retail equivalent. We’ve also taken
              part in The Great Release, their mammoth one-day, prison-to-prison
              charity bike ride through Surrey.
            </p>
          </div>
          <div className="mt-8">
            <ButtonLink href="https://xobikes.com/donate/" variant="outline">
              Make a donation
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
