import { query } from "./_generated/server";
import { v } from "convex/values";

export const getHomeTeam = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("teams")
      .withIndex("by_isHomeTeam", (q) => q.eq("isHomeTeam", true))
      .first();
  },
});

export const getOpponentTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("teams")
      .withIndex("by_isHomeTeam", (q) => q.eq("isHomeTeam", false))
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teams")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});
