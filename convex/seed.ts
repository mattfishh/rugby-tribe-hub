import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingTeams = await ctx.db.query("teams").collect();
    if (existingTeams.length > 0) {
      return { alreadySeeded: true };
    }

    // ── Teams ──────────────────────────────────────────────────────────
    const teamData = [
      { name: "Tavistock Trash Pandas", shortName: "Trash Pandas", slug: "tavistock-trash-pandas", isHomeTeam: true },
      { name: "Brantford Broncos", shortName: "Broncos", slug: "brantford-broncos", isHomeTeam: false },
      { name: "Toronto City Saints", shortName: "Saints", slug: "toronto-city-saints", isHomeTeam: false },
      { name: "Brampton Beavers", shortName: "Beavers", slug: "brampton-beavers", isHomeTeam: false },
      { name: "Royal City Goons", shortName: "Goons", slug: "royal-city-goons", isHomeTeam: false },
      { name: "Durham Dawgs", shortName: "Dawgs", slug: "durham-dawgs", isHomeTeam: false },
      { name: "Hamilton Highlanders", shortName: "Highlanders", slug: "hamilton-highlanders", isHomeTeam: false },
      { name: "Kitchener Kodiaks", shortName: "Kodiaks", slug: "kitchener-kodiaks", isHomeTeam: false },
    ];

    const teamIds: Record<string, Id<"teams">> = {};
    for (const team of teamData) {
      const id = await ctx.db.insert("teams", team);
      teamIds[team.slug] = id;
    }

    const homeTeamId = teamIds["tavistock-trash-pandas"];

    // ── Players ────────────────────────────────────────────────────────
    const playersData = [
      { name: "Jack Williams", position: "Prop", number: 1, height: "6'2\"", weight: "240 lbs", age: 28, hometown: "Tavistock", experience: "7 years" },
      { name: "Thomas Smith", position: "Hooker", number: 2, height: "5'11\"", weight: "220 lbs", age: 25, hometown: "Brighton", experience: "5 years" },
      { name: "Ryan Johnson", position: "Prop", number: 3, height: "6'3\"", weight: "255 lbs", age: 29, hometown: "Oxford", experience: "8 years" },
      { name: "Michael Brown", position: "Lock", number: 4, height: "6'6\"", weight: "245 lbs", age: 26, hometown: "Tavistock", experience: "4 years" },
      { name: "David Jones", position: "Lock", number: 5, height: "6'5\"", weight: "240 lbs", age: 30, hometown: "Cambridge", experience: "10 years" },
      { name: "James Wilson", position: "Flanker", number: 6, height: "6'2\"", weight: "220 lbs", age: 26, hometown: "Tavistock", experience: "5 years" },
      { name: "Sam Evans", position: "Flanker", number: 7, height: "6'1\"", weight: "215 lbs", age: 24, hometown: "Hamilton", experience: "3 years" },
      { name: "Ben Taylor", position: "Number 8", number: 8, height: "6'3\"", weight: "235 lbs", age: 27, hometown: "Kitchener", experience: "6 years" },
      { name: "Harry Moore", position: "Scrum Half", number: 9, height: "5'9\"", weight: "175 lbs", age: 24, hometown: "London", experience: "6 years" },
      { name: "Oliver Taylor", position: "Fly Half", number: 10, height: "5'11\"", weight: "185 lbs", age: 27, hometown: "Tavistock", experience: "7 years" },
      { name: "Noah Martin", position: "Centre", number: 12, height: "6'0\"", weight: "200 lbs", age: 25, hometown: "Exeter", experience: "5 years" },
      { name: "Charlie Wright", position: "Centre", number: 13, height: "6'1\"", weight: "205 lbs", age: 26, hometown: "Tavistock", experience: "4 years" },
      { name: "George Thompson", position: "Winger", number: 11, height: "5'10\"", weight: "180 lbs", age: 23, hometown: "Bristol", experience: "3 years" },
      { name: "Liam Harris", position: "Winger", number: 14, height: "5'11\"", weight: "182 lbs", age: 22, hometown: "Toronto", experience: "2 years" },
      { name: "Leo Clark", position: "Fullback", number: 15, height: "6'0\"", weight: "190 lbs", age: 28, hometown: "Tavistock", experience: "8 years" },
    ];

    const playerIds: Id<"players">[] = [];
    for (const player of playersData) {
      const id = await ctx.db.insert("players", {
        ...player,
        imageUrl: `https://placehold.co/300x300/333333/FFFFFF?text=${encodeURIComponent(player.name.split(" ").map((w) => w[0]).join(""))}`,
        teamId: homeTeamId,
        isActive: true,
      });
      playerIds.push(id);
    }

    // ── Coaches ────────────────────────────────────────────────────────
    const coachesData = [
      { name: "Robert Anderson", position: "Head Coach", experience: "15 years", background: "Former National Team Player" },
      { name: "Steven Lewis", position: "Assistant Coach", experience: "10 years", background: "Specialist in Forward Play" },
      { name: "Mark Davies", position: "Fitness Coach", experience: "12 years", background: "Sports Science Specialist" },
    ];

    for (const coach of coachesData) {
      await ctx.db.insert("coaches", {
        ...coach,
        imageUrl: `https://placehold.co/300x300/333333/FFFFFF?text=${encodeURIComponent("Coach " + coach.name.split(" ")[0])}`,
        teamId: homeTeamId,
        isActive: true,
      });
    }

    // ── 2024 Season Matches (all completed) ───────────────────────────
    const season2024Matches = [
      { home: "tavistock-trash-pandas", away: "brantford-broncos", date: "2024-04-13", homeScore: 24, awayScore: 17, location: "Tavistock Rugby Grounds" },
      { home: "toronto-city-saints", away: "tavistock-trash-pandas", date: "2024-04-27", homeScore: 15, awayScore: 22, location: "Saints Field" },
      { home: "tavistock-trash-pandas", away: "brampton-beavers", date: "2024-05-11", homeScore: 31, awayScore: 12, location: "Tavistock Rugby Grounds" },
      { home: "royal-city-goons", away: "tavistock-trash-pandas", date: "2024-05-25", homeScore: 20, awayScore: 20, location: "Royal City Park" },
      { home: "tavistock-trash-pandas", away: "durham-dawgs", date: "2024-06-08", homeScore: 28, awayScore: 14, location: "Tavistock Rugby Grounds" },
      { home: "hamilton-highlanders", away: "tavistock-trash-pandas", date: "2024-06-22", homeScore: 19, awayScore: 25, location: "Highlander Stadium" },
      // Non-home-team matches
      { home: "brantford-broncos", away: "toronto-city-saints", date: "2024-04-20", homeScore: 18, awayScore: 21, location: "Broncos Field" },
      { home: "brampton-beavers", away: "royal-city-goons", date: "2024-05-04", homeScore: 14, awayScore: 26, location: "Beavers Park" },
      { home: "durham-dawgs", away: "hamilton-highlanders", date: "2024-05-18", homeScore: 22, awayScore: 16, location: "Dawgs Den" },
      { home: "kitchener-kodiaks", away: "brantford-broncos", date: "2024-06-01", homeScore: 27, awayScore: 19, location: "Kodiaks Arena" },
    ];

    for (const m of season2024Matches) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        matchDate: m.date,
        matchTime: "15:00",
        location: m.location,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: "completed",
        season: "2024",
      });
    }

    // ── 2025 Season Matches ───────────────────────────────────────────
    const season2025CompletedMatches = [
      { home: "tavistock-trash-pandas", away: "kitchener-kodiaks", date: "2025-04-12", homeScore: 27, awayScore: 10, location: "Tavistock Rugby Grounds" },
      { home: "brantford-broncos", away: "tavistock-trash-pandas", date: "2025-04-26", homeScore: 14, awayScore: 21, location: "Broncos Field" },
      { home: "tavistock-trash-pandas", away: "royal-city-goons", date: "2025-05-10", homeScore: 18, awayScore: 22, location: "Tavistock Rugby Grounds" },
      // Non-home-team matches
      { home: "toronto-city-saints", away: "brampton-beavers", date: "2025-04-19", homeScore: 25, awayScore: 17, location: "Saints Field" },
      { home: "durham-dawgs", away: "hamilton-highlanders", date: "2025-05-03", homeScore: 19, awayScore: 19, location: "Dawgs Den" },
    ];

    for (const m of season2025CompletedMatches) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        matchDate: m.date,
        matchTime: "15:00",
        location: m.location,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: "completed",
        season: "2025",
      });
    }

    const season2025UpcomingMatches = [
      { home: "brampton-beavers", away: "tavistock-trash-pandas", date: "2025-09-06", location: "Beavers Park" },
      { home: "tavistock-trash-pandas", away: "hamilton-highlanders", date: "2025-09-20", location: "Tavistock Rugby Grounds" },
      { home: "durham-dawgs", away: "tavistock-trash-pandas", date: "2025-10-04", location: "Dawgs Den" },
    ];

    for (const m of season2025UpcomingMatches) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        matchDate: m.date,
        matchTime: "15:00",
        location: m.location,
        status: "upcoming",
        season: "2025",
      });
    }

    // ── Player Stats: 2024 Season ─────────────────────────────────────
    const stats2024 = [
      { idx: 0, matchesPlayed: 6, tries: 2, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 1, matchesPlayed: 6, tries: 3, conversions: 0, penalties: 0, yellowCards: 1, redCards: 0 },
      { idx: 2, matchesPlayed: 5, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 3, matchesPlayed: 6, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 4, matchesPlayed: 6, tries: 0, conversions: 0, penalties: 0, yellowCards: 1, redCards: 0 },
      { idx: 5, matchesPlayed: 6, tries: 3, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 6, matchesPlayed: 5, tries: 2, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 7, matchesPlayed: 6, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 8, matchesPlayed: 6, tries: 4, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 9, matchesPlayed: 6, tries: 2, conversions: 12, penalties: 8, yellowCards: 0, redCards: 0 },
      { idx: 10, matchesPlayed: 6, tries: 5, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 11, matchesPlayed: 5, tries: 3, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 12, matchesPlayed: 6, tries: 6, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 13, matchesPlayed: 4, tries: 4, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 14, matchesPlayed: 6, tries: 3, conversions: 5, penalties: 2, yellowCards: 0, redCards: 0 },
    ];

    for (const s of stats2024) {
      await ctx.db.insert("playerStats", {
        playerId: playerIds[s.idx],
        season: "2024",
        matchesPlayed: s.matchesPlayed,
        tries: s.tries,
        conversions: s.conversions,
        penalties: s.penalties,
        yellowCards: s.yellowCards,
        redCards: s.redCards,
      });
    }

    // ── Player Stats: 2025 Season ─────────────────────────────────────
    const stats2025 = [
      { idx: 0, matchesPlayed: 3, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 1, matchesPlayed: 3, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 2, matchesPlayed: 2, tries: 0, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 3, matchesPlayed: 3, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 4, matchesPlayed: 3, tries: 0, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 5, matchesPlayed: 3, tries: 2, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 6, matchesPlayed: 2, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 7, matchesPlayed: 3, tries: 0, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 8, matchesPlayed: 3, tries: 2, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 9, matchesPlayed: 3, tries: 1, conversions: 6, penalties: 4, yellowCards: 0, redCards: 0 },
      { idx: 10, matchesPlayed: 3, tries: 2, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 11, matchesPlayed: 3, tries: 1, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 12, matchesPlayed: 3, tries: 3, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 13, matchesPlayed: 2, tries: 2, conversions: 0, penalties: 0, yellowCards: 0, redCards: 0 },
      { idx: 14, matchesPlayed: 3, tries: 1, conversions: 3, penalties: 1, yellowCards: 0, redCards: 0 },
    ];

    for (const s of stats2025) {
      await ctx.db.insert("playerStats", {
        playerId: playerIds[s.idx],
        season: "2025",
        matchesPlayed: s.matchesPlayed,
        tries: s.tries,
        conversions: s.conversions,
        penalties: s.penalties,
        yellowCards: s.yellowCards,
        redCards: s.redCards,
      });
    }

    // ── Compute & Insert Standings ────────────────────────────────────
    // We'll compute standings from the match data we just inserted,
    // using the same logic as updateStandingsFromMatches
    for (const season of ["2024", "2025"]) {
      const matches = await ctx.db
        .query("matches")
        .withIndex("by_season", (q) => q.eq("season", season))
        .collect();

      const completed = matches.filter(
        (m) => m.status === "completed" && m.homeScore !== undefined && m.awayScore !== undefined
      );

      const standings: Record<string, {
        played: number; won: number; lost: number; drawn: number;
        pointsFor: number; pointsAgainst: number; bonusPoints: number; totalPoints: number;
      }> = {};

      const allTeams = await ctx.db.query("teams").collect();
      for (const t of allTeams) {
        standings[t._id] = { played: 0, won: 0, lost: 0, drawn: 0, pointsFor: 0, pointsAgainst: 0, bonusPoints: 0, totalPoints: 0 };
      }

      for (const match of completed) {
        const hs = match.homeScore!;
        const as_ = match.awayScore!;
        const home = standings[match.homeTeamId];
        const away = standings[match.awayTeamId];
        if (!home || !away) continue;

        home.played++; away.played++;
        home.pointsFor += hs; home.pointsAgainst += as_;
        away.pointsFor += as_; away.pointsAgainst += hs;

        if (hs > as_) {
          home.won++; away.lost++; home.totalPoints += 4;
        } else if (hs < as_) {
          home.lost++; away.won++; away.totalPoints += 4;
        } else {
          home.drawn++; away.drawn++; home.totalPoints += 2; away.totalPoints += 2;
        }

        if (hs >= 20) { home.bonusPoints++; home.totalPoints++; }
        if (as_ >= 20) { away.bonusPoints++; away.totalPoints++; }
        if (hs < as_ && as_ - hs <= 7) { home.bonusPoints++; home.totalPoints++; }
        if (as_ < hs && hs - as_ <= 7) { away.bonusPoints++; away.totalPoints++; }
      }

      for (const [teamId, s] of Object.entries(standings)) {
        if (s.played > 0) {
          await ctx.db.insert("teamStandings", {
            teamId: teamId as Id<"teams">,
            season,
            ...s,
          });
        }
      }
    }

    return { alreadySeeded: false };
  },
});
