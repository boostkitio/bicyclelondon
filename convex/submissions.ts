import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    enquiryType: v.optional(v.string()),
    jobSlug: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("submissions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("submissions")
        .withIndex("by_type", (q) => q.eq("type", args.type as string))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("submissions").order("desc").collect();
  },
});
