import { defineType, defineField } from "sanity";

export default defineType({
  name: "slipstreamArticle",
  title: "Slipstream article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "standfirst",
      title: "Standfirst / excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary shown on the listing and at the top of the article.",
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
    }),
    defineField({
      name: "issue",
      title: "Slipstream issue number",
      type: "number",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      group: "content",
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "body",
      type: "blockContent",
      group: "content",
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Published, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "heroImage" },
  },
});
