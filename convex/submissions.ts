import { internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    // Shared secret held by the site's API route; the deployment URL is
    // public (NEXT_PUBLIC_CONVEX_URL), so this is what stops direct writes.
    secret: v.string(),
    type: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    enquiryType: v.optional(v.string()),
    jobSlug: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    if (
      !process.env.CONTACT_FORM_SECRET ||
      args.secret !== process.env.CONTACT_FORM_SECRET
    ) {
      throw new Error("Unauthorised");
    }
    const { secret: _secret, ...submission } = args;
    return await ctx.db.insert("submissions", {
      ...submission,
      createdAt: Date.now(),
    });
  },
});

// Internal only: submissions hold personal data, so they are readable from
// the dashboard or other Convex functions, never from a browser client.
export const list = internalQuery({
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
