import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    shortName: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    isHomeTeam: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_isHomeTeam", ["isHomeTeam"]),

  players: defineTable({
    name: v.string(),
    position: v.string(),
    number: v.optional(v.number()),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    age: v.optional(v.number()),
    hometown: v.optional(v.string()),
    experience: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    teamId: v.id("teams"),
    isActive: v.boolean(),
  }).index("by_team", ["teamId", "isActive"]),

  coaches: defineTable({
    name: v.string(),
    position: v.string(),
    experience: v.optional(v.string()),
    background: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    teamId: v.id("teams"),
    isActive: v.boolean(),
  }).index("by_team", ["teamId"]),

  matches: defineTable({
    homeTeamId: v.id("teams"),
    awayTeamId: v.id("teams"),
    matchDate: v.string(),
    matchTime: v.optional(v.string()),
    location: v.optional(v.string()),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
    status: v.string(),
    season: v.string(),
  })
    .index("by_status", ["status", "matchDate"])
    .index("by_season", ["season"]),

  playerStats: defineTable({
    playerId: v.id("players"),
    season: v.string(),
    matchesPlayed: v.number(),
    tries: v.number(),
    conversions: v.number(),
    penalties: v.number(),
    yellowCards: v.number(),
    redCards: v.number(),
  })
    .index("by_season", ["season"])
    .index("by_player", ["playerId", "season"]),

  teamStandings: defineTable({
    teamId: v.id("teams"),
    season: v.string(),
    played: v.number(),
    won: v.number(),
    drawn: v.number(),
    lost: v.number(),
    pointsFor: v.number(),
    pointsAgainst: v.number(),
    bonusPoints: v.number(),
    totalPoints: v.number(),
  }).index("by_season", ["season"]),
});
