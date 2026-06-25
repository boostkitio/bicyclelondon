import { defineType, defineField } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Overrides the default page title in search results (~60 chars).",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Shown in search results (~155 chars).",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Used when the page is shared (1200x630 recommended).",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
