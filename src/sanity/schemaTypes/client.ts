import { defineType, defineField } from "sanity";

export default defineType({
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "website", type: "url" }),
    defineField({
      name: "showOnLogoWall",
      title: "Show on homepage logo wall",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 100,
    }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});
