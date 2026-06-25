import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      group: "general",
      initialValue: "Bicycle London",
    }),
    defineField({
      name: "description",
      title: "Default meta description",
      type: "text",
      rows: 3,
      group: "general",
    }),
    defineField({
      name: "ogImage",
      title: "Default social share image",
      type: "image",
      group: "general",
    }),
    defineField({
      name: "phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number (international, digits only)",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "General email",
      type: "string",
      group: "contact",
      initialValue: "info@bicyclelondon.com",
    }),
    defineField({
      name: "jobsEmail",
      title: "Careers email",
      type: "string",
      group: "contact",
      initialValue: "jobs@bicyclelondon.com",
    }),
    defineField({
      name: "address",
      type: "object",
      group: "contact",
      fields: [
        { name: "line1", type: "string", title: "Line 1" },
        { name: "line2", type: "string", title: "Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "postcode", type: "string", title: "Postcode" },
      ],
    }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url", group: "social" }),
    defineField({ name: "x", title: "X / Twitter URL", type: "url", group: "social" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url", group: "social" }),
    defineField({ name: "substack", title: "Substack URL", type: "url", group: "social" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
