import { SITE } from "./site";

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function articleSchema(a: {
  title: string;
  slug: string;
  standfirst?: string;
  publishedAt?: string;
  authorName?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.standfirst,
    datePublished: a.publishedAt,
    author: a.authorName
      ? { "@type": "Person", name: a.authorName }
      : { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    image: a.image ? [a.image] : undefined,
    mainEntityOfPage: `${SITE.url}/slipstream/${a.slug}`,
  };
}
