import { defineType, defineField } from "sanity";

export default defineType({
  name: "job",
  title: "Job",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Role title",
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
      name: "active",
      title: "Currently open",
      type: "boolean",
      group: "content",
      initialValue: true,
    }),
    defineField({
      name: "team",
      title: "Team / department",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "location",
      type: "string",
      group: "content",
      initialValue: "London (Clerkenwell)",
    }),
    defineField({
      name: "employmentType",
      title: "Employment type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Full-time", value: "FULL_TIME" },
          { title: "Part-time", value: "PART_TIME" },
          { title: "Contract", value: "CONTRACTOR" },
          { title: "Internship", value: "INTERN" },
        ],
      },
      initialValue: "FULL_TIME",
    }),
    defineField({
      name: "salary",
      title: "Salary (optional)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "applyEmail",
      title: "Apply-to email",
      type: "string",
      group: "content",
      initialValue: "jobs@bicyclelondon.com",
    }),
    defineField({
      name: "teamtailorUrl",
      title: "Teamtailor application URL (optional)",
      description:
        "If set, the 'Apply' button links here instead of a mailto, so the application flows into Teamtailor's ATS/candidate pipeline.",
      type: "url",
      group: "content",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).custom((url) =>
          !url || url.includes("teamtailor.com") || url.includes("bicyclelondon.com/jobs")
            ? true
            : "Should be a Teamtailor application URL",
        ),
    }),
    defineField({
      name: "postedAt",
      title: "Posted at",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "team", active: "active" },
    prepare: ({ title, subtitle, active }) => ({
      title,
      subtitle: `${active ? "Open" : "Closed"}${subtitle ? ` · ${subtitle}` : ""}`,
    }),
  },
});
