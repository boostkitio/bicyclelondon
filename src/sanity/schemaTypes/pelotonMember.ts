import { defineType, defineField } from "sanity";

export default defineType({
  name: "pelotonMember",
  title: "Peloton member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "hoverPhoto",
      title: "Hover photo",
      type: "image",
      description: "Optional. An alternate shot revealed when you hover the headshot.",
      options: { hotspot: true },
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https"] })
          .custom((url) =>
            !url || url.includes("linkedin.com") ? true : "Should be a LinkedIn URL",
          ),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "isPet",
      title: "Office dog",
      type: "boolean",
      description: "Tick for the office dogs (they get sprinkled through the roster).",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
