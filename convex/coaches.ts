import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("coaches")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    return all.filter((c) => c.isActive);
  },
});
