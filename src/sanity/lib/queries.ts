import { groq } from "next-sanity";

// Case studies
export const allCaseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(order asc, _createdAt desc){
    _id, title, "slug": slug.current, standfirst, heroImage, services,
    "clientName": client->name
  }`;

export const caseStudySlugsQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current }`;

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, standfirst, heroImage, services, results, body, gallery,
    "videoPlaybackId": video.asset->playbackId,
    "client": client->{name, logo, website},
    seo
  }`;

// Slipstream articles
export const allArticlesQuery = groq`
  *[_type == "slipstreamArticle"] | order(publishedAt desc){
    _id, title, "slug": slug.current, standfirst, heroImage, issue, publishedAt,
    "category": category->title, "categorySlug": category->slug.current
  }`;

export const articleSlugsQuery = groq`
  *[_type == "slipstreamArticle" && defined(slug.current)]{ "slug": slug.current }`;

export const articleBySlugQuery = groq`
  *[_type == "slipstreamArticle" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, standfirst, heroImage, issue, publishedAt, body,
    "category": category->{title, "slug": slug.current},
    "author": author->{name, role, image, linkedin, "slug": slug.current},
    seo
  }`;

// Jobs
export const allJobsQuery = groq`
  *[_type == "job" && active == true] | order(postedAt desc){
    _id, title, "slug": slug.current, team, location, employmentType, summary
  }`;

export const jobSlugsQuery = groq`
  *[_type == "job" && active == true && defined(slug.current)]{ "slug": slug.current }`;

export const jobBySlugQuery = groq`
  *[_type == "job" && active == true && slug.current == $slug][0]{
    _id, title, "slug": slug.current, team, location, employmentType, salary, summary,
    body, applyEmail, teamtailorUrl, postedAt, validThrough, seo
  }`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export const pelotonQuery = groq`
  *[_type == "pelotonMember"] | order(order asc){
    _id, name, role, "slug": slug.current, photo, hoverPhoto, linkedin, isPet
  }`;

export const clientsWallQuery = groq`
  *[_type == "client" && showOnLogoWall == true && defined(logo.asset)]
    | order(order asc){ _id, name, logo }`;

export const featuredCaseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(order asc, _createdAt desc)[0...3]{
    _id, title, "slug": slug.current, standfirst, heroImage,
    "clientName": client->name
  }`;
