import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    type: v.string(), // "contact" | "application"
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    enquiryType: v.optional(v.string()),
    jobSlug: v.optional(v.string()),
    message: v.string(),
    createdAt: v.number(),
  }).index("by_type", ["type"]),
});
