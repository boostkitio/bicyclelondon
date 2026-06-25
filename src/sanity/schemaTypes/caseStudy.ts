import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "Usually the client/campaign name, e.g. MOJU.",
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
      name: "client",
      type: "reference",
      to: [{ type: "client" }],
      group: "content",
    }),
    defineField({
      name: "standfirst",
      title: "Summary",
      type: "text",
      rows: 3,
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
      name: "services",
      title: "Services / disciplines",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "content",
    }),
    defineField({
      name: "results",
      title: "Results / key stats",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "metric", type: "string", title: "Metric (e.g. +38%)" },
            { name: "label", type: "string", title: "Label (e.g. uplift in sales)" },
          ],
          preview: { select: { title: "metric", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "video",
      title: "Showcase video (Mux)",
      type: "mux.video",
      group: "content",
      description: "Optional campaign film. Uploaded and streamed via Mux.",
    }),
    defineField({
      name: "gallery",
      title: "Image gallery",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "content",
      initialValue: 100,
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "client.name", media: "heroImage" },
  },
});
