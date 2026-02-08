import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId).eq("isActive", true))
      .collect();
  },
});

export const get = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});
