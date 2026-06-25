import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({ name: "role", title: "Role / job title", type: "string" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "bio", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
