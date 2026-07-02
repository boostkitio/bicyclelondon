import { type SchemaTypeDefinition } from "sanity";
import siteSettings from "./siteSettings";
import slipstreamArticle from "./slipstreamArticle";
import caseStudy from "./caseStudy";
import job from "./job";
import client from "./client";
import author from "./author";
import pelotonMember from "./pelotonMember";
import testimonial from "./testimonial";
import category from "./category";
import blockContent from "./blockContent";
import seo from "./seo";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  slipstreamArticle,
  caseStudy,
  job,
  client,
  author,
  pelotonMember,
  testimonial,
  category,
  blockContent,
  seo,
];
