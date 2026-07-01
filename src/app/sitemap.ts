import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  articleSlugsQuery,
  caseStudySlugsQuery,
  jobSlugsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticPaths = [
    "",
    "/about",
    "/purpose",
    "/the-peloton",
    "/contact-us",
    "/work",
    "/slipstream",
    "/careers",
    "/careers/benefits",
    "/careers/values",
    "/careers/diversity",
    "/careers/team/mark-pavlika",
    "/careers/team/valeria-perticucci",
    "/bicycle",
    "/bicycle-blade",
    "/bicycle-studio",
    "/bicycle-ripple",
    "/international",
    "/privacy-policy",
    "/cookie-policy",
    "/modern-slavery",
  ];

  const [articles, studies, jobs] = await Promise.all([
    sanityFetch<{ slug: string }[]>({ query: articleSlugsQuery }),
    sanityFetch<{ slug: string }[]>({ query: caseStudySlugsQuery }),
    sanityFetch<{ slug: string }[]>({ query: jobSlugsQuery }),
  ]);

  const now = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...articles.map((a) => ({
      url: `${base}/slipstream/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...studies.map((s) => ({
      url: `${base}/work/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...jobs.map((j) => ({
      url: `${base}/careers/${j.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
