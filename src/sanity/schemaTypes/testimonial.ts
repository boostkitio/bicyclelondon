import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role / title",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Author photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "authorName", subtitle: "company", media: "photo" },
  },
});
