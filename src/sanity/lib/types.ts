export type SanityImage = {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
};

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
};

export type CaseStudyCard = {
  _id: string;
  title: string;
  slug: string;
  standfirst?: string;
  heroImage?: SanityImage;
  services?: string[];
  clientName?: string;
};

export type CaseStudy = CaseStudyCard & {
  results?: { metric?: string; label?: string }[];
  body?: unknown[];
  gallery?: SanityImage[];
  videoPlaybackId?: string;
  client?: { name?: string; logo?: SanityImage; website?: string };
  seo?: Seo;
};

export type ArticleCard = {
  _id: string;
  title: string;
  slug: string;
  standfirst?: string;
  heroImage?: SanityImage;
  issue?: number;
  publishedAt?: string;
  category?: string;
  categorySlug?: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  standfirst?: string;
  heroImage?: SanityImage;
  issue?: number;
  publishedAt?: string;
  body?: unknown[];
  category?: { title?: string; slug?: string };
  author?: { name?: string; role?: string; image?: SanityImage };
  seo?: Seo;
};

export type JobCard = {
  _id: string;
  title: string;
  slug: string;
  team?: string;
  location?: string;
  employmentType?: string;
  summary?: string;
};

export type Job = JobCard & {
  salary?: string;
  body?: unknown[];
  applyEmail?: string;
  postedAt?: string;
  seo?: Seo;
};
