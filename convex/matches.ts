import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .collect();

    // Sort by matchDate ascending
    matches.sort((a, b) => a.matchDate.localeCompare(b.matchDate));

    // Resolve team references
    const resolved = await Promise.all(
      matches.map(async (match) => {
        const homeTeam = await ctx.db.get(match.homeTeamId);
        const awayTeam = await ctx.db.get(match.awayTeamId);
        return { ...match, homeTeam, awayTeam };
      })
    );

    return resolved;
  },
});

export const getNextMatch = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    const matches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .collect();

    // Filter to future dates and sort
    const upcoming = matches
      .filter((m) => m.matchDate >= today)
      .sort((a, b) => a.matchDate.localeCompare(b.matchDate));

    const next = upcoming[0];
    if (!next) return null;

    const homeTeam = await ctx.db.get(next.homeTeamId);
    const awayTeam = await ctx.db.get(next.awayTeamId);
    return { ...next, homeTeam, awayTeam };
  },
});

export const getPast = query({
  args: {},
  handler: async (ctx) => {
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .collect();

    // Sort by matchDate descending
    matches.sort((a, b) => b.matchDate.localeCompare(a.matchDate));

    const resolved = await Promise.all(
      matches.map(async (match) => {
        const homeTeam = await ctx.db.get(match.homeTeamId);
        const awayTeam = await ctx.db.get(match.awayTeamId);
        return { ...match, homeTeam, awayTeam };
      })
    );

    return resolved;
  },
});

export const getBySeason = query({
  args: { season: v.string() },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_season", (q) => q.eq("season", args.season))
      .collect();

    const resolved = await Promise.all(
      matches.map(async (match) => {
        const homeTeam = await ctx.db.get(match.homeTeamId);
        const awayTeam = await ctx.db.get(match.awayTeamId);
        return { ...match, homeTeam, awayTeam };
      })
    );

    return resolved;
  },
});
