import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/avatar";
import { JsonLd } from "@/components/seo/json-ld";
import { TEAM_STORIES } from "@/content/team-stories";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// The story list is complete at build time, so unknown slugs get a real 404
// rather than an on-demand render.
export const dynamicParams = false;

export function generateStaticParams() {
  return TEAM_STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = TEAM_STORIES.find((s) => s.slug === slug);
  if (!story) return {};
  return {
    alternates: { canonical: `/careers/team/${story.slug}` },
    title: story.metaTitle,
    description: story.metaDescription,
  };
}

export default async function TeamStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = TEAM_STORIES.find((s) => s.slug === slug);
  if (!story) notFound();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: story.name,
    jobTitle: story.jobTitle,
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
    image: `${SITE.url}${story.avatar}`,
    url: `${SITE.url}/careers/team/${story.slug}`,
    ...(story.linkedin ? { sameAs: [story.linkedin] } : {}),
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <PageHero
        eyebrow="Careers · Meet the Peloton"
        title={story.name}
        lead={story.role}
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-[220px_1fr]">
          <div className="w-40 md:w-full">
            <Avatar
              src={story.avatar}
              name={story.name}
              initials={story.initials}
            />
          </div>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-black/75">
            {story.paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            {story.signoff && (
              <p className="font-semibold text-black/60">{story.signoff}</p>
            )}
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
