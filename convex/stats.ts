import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPlayerStats = query({
  args: { season: v.string() },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("playerStats")
      .withIndex("by_season", (q) => q.eq("season", args.season))
      .collect();

    // Resolve player references and sort by tries descending
    const resolved = await Promise.all(
      stats.map(async (stat) => {
        const player = await ctx.db.get(stat.playerId);
        return { ...stat, player };
      })
    );

    resolved.sort((a, b) => b.tries - a.tries);
    return resolved;
  },
});

export const getTeamStandings = query({
  args: { season: v.string() },
  handler: async (ctx, args) => {
    const standings = await ctx.db
      .query("teamStandings")
      .withIndex("by_season", (q) => q.eq("season", args.season))
      .collect();

    // Resolve team references and sort by totalPoints descending
    const resolved = await Promise.all(
      standings.map(async (standing) => {
        const team = await ctx.db.get(standing.teamId);
        return { ...standing, team };
      })
    );

    resolved.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
    });

    return resolved;
  },
});

export const updateStandingsFromMatches = mutation({
  args: { season: v.string() },
  handler: async (ctx, args) => {
    // Get all completed matches for the season
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_season", (q) => q.eq("season", args.season))
      .collect();

    const completedMatches = matches.filter(
      (m) => m.status === "completed" && m.homeScore !== undefined && m.awayScore !== undefined
    );

    if (completedMatches.length === 0) {
      return false;
    }

    // Get all teams
    const teams = await ctx.db.query("teams").collect();

    // Initialize standings for each team
    const standings: Record<
      string,
      {
        teamId: string;
        played: number;
        won: number;
        lost: number;
        drawn: number;
        pointsFor: number;
        pointsAgainst: number;
        bonusPoints: number;
        totalPoints: number;
      }
    > = {};

    for (const team of teams) {
      standings[team._id] = {
        teamId: team._id,
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        bonusPoints: 0,
        totalPoints: 0,
      };
    }

    // Process each match
    for (const match of completedMatches) {
      const homeScore = match.homeScore!;
      const awayScore = match.awayScore!;
      const home = standings[match.homeTeamId];
      const away = standings[match.awayTeamId];

      if (!home || !away) continue;

      home.played += 1;
      away.played += 1;

      home.pointsFor += homeScore;
      home.pointsAgainst += awayScore;
      away.pointsFor += awayScore;
      away.pointsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.won += 1;
        away.lost += 1;
        home.totalPoints += 4;
      } else if (homeScore < awayScore) {
        home.lost += 1;
        away.won += 1;
        away.totalPoints += 4;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.totalPoints += 2;
        away.totalPoints += 2;
      }

      // Bonus point for scoring 4+ tries (assuming ~5 pts per try, so 20+ points)
      if (homeScore >= 20) {
        home.bonusPoints += 1;
        home.totalPoints += 1;
      }
      if (awayScore >= 20) {
        away.bonusPoints += 1;
        away.totalPoints += 1;
      }

      // Losing bonus point for losing by 7 or fewer
      if (homeScore < awayScore && awayScore - homeScore <= 7) {
        home.bonusPoints += 1;
        home.totalPoints += 1;
      }
      if (awayScore < homeScore && homeScore - awayScore <= 7) {
        away.bonusPoints += 1;
        away.totalPoints += 1;
      }
    }

    // Delete existing standings for the season
    const existingStandings = await ctx.db
      .query("teamStandings")
      .withIndex("by_season", (q) => q.eq("season", args.season))
      .collect();

    for (const existing of existingStandings) {
      await ctx.db.delete(existing._id);
    }

    // Insert new standings (only for teams that played)
    for (const teamStanding of Object.values(standings)) {
      if (teamStanding.played > 0) {
        await ctx.db.insert("teamStandings", {
          teamId: teamStanding.teamId as any,
          season: args.season,
          played: teamStanding.played,
          won: teamStanding.won,
          drawn: teamStanding.drawn,
          lost: teamStanding.lost,
          pointsFor: teamStanding.pointsFor,
          pointsAgainst: teamStanding.pointsAgainst,
          bonusPoints: teamStanding.bonusPoints,
          totalPoints: teamStanding.totalPoints,
        });
      }
    }

    return true;
  },
});
