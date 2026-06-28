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
    dateModified: a.publishedAt,
    author: a.authorName
      ? { "@type": "Person", name: a.authorName }
      : { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    image: a.image ? [a.image] : undefined,
    mainEntityOfPage: `${SITE.url}/slipstream/${a.slug}`,
  };
}

export function collectionPageSchema(args: {
  name: string;
  path: string;
  description: string;
  items: Array<{ name: string; path: string; description?: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    url: `${SITE.url}${args.path}`,
    description: args.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: args.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE.url}${item.path}`,
        name: item.name,
        description: item.description,
      })),
    },
  };
}

export function serviceSchema(args: {
  name: string;
  path: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: `${SITE.url}${args.path}`,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: ["GB", "Europe", "North America", "Nigeria", "UAE"],
    serviceType: args.name,
  };
}

export function faqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function webPageSchema(args: {
  name: string;
  path: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: args.name,
    url: `${SITE.url}${args.path}`,
    description: args.description,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}
