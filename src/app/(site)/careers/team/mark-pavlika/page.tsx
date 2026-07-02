import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/avatar";

export const metadata: Metadata = {
  alternates: { canonical: "/careers/team/mark-pavlika" },
  title: "Mark Pavlika, Chief People & Purpose Officer",
  description:
    "Today I am Chief People & Purpose Officer of the agency I dreamed of working at Bicycle London. Mark's story, from our People team.",
};

export default function MarkPavlikaPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers · Meet the Peloton"
        title="Mark Pavlika"
        lead="Chief People & Purpose Officer, People Team"
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-[220px_1fr]">
          <div className="w-40 md:w-full">
            <Avatar
              src="/team/mark-pavlika.png"
              name="Mark Pavlika"
              initials="MP"
            />
          </div>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-black/75">
            <p>
              I was brought up as a Jehovah&apos;s Witness in a strict
              household. At 16 I realised that I had no choice but to accept
              my sexuality and explore the LGBTQ+ community, and for 3 years I
              lived a double life because I couldn&apos;t face telling my
              parents.
            </p>
            <p>
              At 18 I befriended a man 37 years my senior, but he had other
              ideas. He fell for me and stalked me for 3 years, making my life
              hell. He was so infatuated with me that he wanted me to live
              with him, and he started writing abusive, hate-mail type
              letters to my parents to out me and to get me thrown out. One
              day he succeeded, and on the 9th February 1993, my parents gave
              me an ultimatum. Change or leave &ndash; I chose to leave.
            </p>
            <p>
              The next 2 years shaped my life forever to come. I lived on the
              streets, took drugs and met some very unsavoury people. It took
              all my might, and on 31st October 1994, almost 2 years after I
              left home, I took my last drug.
            </p>
            <p>
              I went on to get a junior job in finance and found a home with
              a housing association. I studied hard, and with my ambition and
              zeal for my new life I got to a senior position within 8 years.
              I then moved over to HR exclusively in 2005 and have been a
              senior practitioner since.
            </p>
            <p>
              For years I suffered from depression and anxiety, and
              eventually in 2010, 16 years of being clean, I discovered yoga
              and mindfulness. I credit these with saving my life, as
              they&apos;ve helped me piece together the jigsaw pieces in my
              mind.
            </p>
            <p>
              Today I am Chief People &amp; Purpose Officer of the agency I
              dreamed of working at, Bicycle London. I feel like a kid in a
              sweet shop and want to tell everyone about it.
            </p>
            <p className="font-semibold text-black/60">
              Pav x (aka known as Mark, Mario and Maz)
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        heading="Like the sound of the Peloton? See our open roles."
        label="View open roles"
        href="/careers"
      />
    </>
  );
}
