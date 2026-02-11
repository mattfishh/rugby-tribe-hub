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

    // ── Teams (from old Supabase DB) ──────────────────────────────────
    const teamData = [
      { name: "Tavistock Trash Pandas", shortName: "Tavistock", slug: "tavistock-trash-pandas", logoUrl: "/images/logos/tavistock-logo.jpg", isHomeTeam: true },
      { name: "Royal City Goons", shortName: "Royal City", slug: "royal-city-goons", logoUrl: "/images/logos/royal-city-logo.png", isHomeTeam: false },
      { name: "Durham Dawgs", shortName: "Durham", slug: "durham-dawgs", logoUrl: "/images/logos/durham-logo.png", isHomeTeam: false },
      { name: "Toronto City Saints", shortName: "Toronto", slug: "toronto-city-saints", logoUrl: "/images/logos/toronto-logo.png", isHomeTeam: false },
      { name: "Brampton Beavers", shortName: "Brampton", slug: "brampton-beavers", logoUrl: "/images/logos/brampton-logo.png", isHomeTeam: false },
      { name: "Brantford Broncos", shortName: "Brantford", slug: "brantford-broncos", logoUrl: "/images/logos/brantford-logo.png", isHomeTeam: false },
    ];

    const teamIds: Record<string, Id<"teams">> = {};
    for (const team of teamData) {
      const id = await ctx.db.insert("teams", team);
      teamIds[team.slug] = id;
    }

    const homeTeamId = teamIds["tavistock-trash-pandas"];

    // ── Players (real roster from old DB) ─────────────────────────────
    const playersData = [
      { name: "Zack Shurtleff", position: "Forward", number: 1 },
      { name: "Mitch Voralek", position: "Good Guy", number: 2 },
      { name: "Max Goodwin", position: "Good Guy", number: 3 },
      { name: "Jay Park", position: "Good Guy", number: 4 },
      { name: "Devon Ollson", position: "Good Guy", number: 5 },
      { name: "Daniel Froome", position: "Good Guy", number: 6 },
      { name: "Everett Hawkins", position: "Good Guy", number: 7 },
      { name: "Cam Sandison", position: "Bad Guy", number: 8 },
      { name: "Dan Snider", position: "Good Guy", number: 9 },
      { name: "Matt Fish", position: "Good Guy", number: 10 },
      { name: "David Froome", position: "Good Guy", number: 11 },
      { name: "Jeff Park", position: "Good Guy", number: 12 },
      { name: "Graydon Harris", position: "Good Guy", number: 13 },
      { name: "Mitch Talbot", position: "Good Guy", number: 14 },
      { name: "Nathan Roberts", position: "Good Guy", number: 15 },
      { name: "Kevin Le", position: "Good Guy", number: 16 },
      { name: "Rich Lebel", position: "Good Guy", number: 17 },
      { name: "Jackson Smith", position: "Good Guy", number: 18 },
      { name: "Wes MacDonald", position: "Good Guy", number: 19 },
      { name: "Ben Playfair", position: "Good Guy", number: 20 },
      { name: "Sam Taylor", position: "Good Guy", number: 21 },
      { name: "Kevin Oh", position: "Good Guy", number: 22 },
      { name: "Jordan Ng", position: "Bad Guy", number: 23 },
      { name: "Brandon Kostyk", position: "Good Guy", number: 24 },
      { name: "Dillon Goos", position: "Good Guy", number: 25 },
      { name: "Lloyd Roberts", position: "Good Guy", number: 26 },
    ];

    const playerIds: Id<"players">[] = [];
    for (const player of playersData) {
      const nameParts = player.name.toLowerCase().split(" ");
      const imageSlug = `${nameParts[0]}-${nameParts[nameParts.length - 1]}`;
      const id = await ctx.db.insert("players", {
        ...player,
        imageUrl: `/images/players/${imageSlug}.webp`,
        teamId: homeTeamId,
        isActive: true,
      });
      playerIds.push(id);
    }

    // ── Coaches ────────────────────────────────────────────────────────
    await ctx.db.insert("coaches", {
      name: "Nathan Roberts",
      position: "Head Coach",
      experience: "Watched at least 12 Rugby League games in his life",
      imageUrl: "/images/coaches/nathan-roberts.webp",
      teamId: homeTeamId,
      isActive: true,
    });

    // ── 2025 Season Matches (from old DB) ─────────────────────────────
    const season2025Matches = [
      // Round 1 – Mar 30 @ Guelph
      { home: "tavistock-trash-pandas", away: "brampton-beavers", date: "2025-03-30", time: "11:00", homeScore: 44, awayScore: 10, location: "Guelph" },
      { home: "brantford-broncos", away: "durham-dawgs", date: "2025-03-30", time: "13:00", homeScore: 58, awayScore: 6, location: "Guelph" },
      { home: "royal-city-goons", away: "toronto-city-saints", date: "2025-03-30", time: "13:00", homeScore: 20, awayScore: 0, location: "Guelph" },
      // Round 2 – Apr 6 @ Brantford
      { home: "brantford-broncos", away: "brampton-beavers", date: "2025-04-06", time: "11:00", homeScore: 6, awayScore: 38, location: "Brantford" },
      { home: "toronto-city-saints", away: "tavistock-trash-pandas", date: "2025-04-06", time: "13:00", homeScore: 4, awayScore: 90, location: "Brantford" },
      { home: "royal-city-goons", away: "durham-dawgs", date: "2025-04-06", time: "15:00", homeScore: 38, awayScore: 26, location: "Brantford" },
      // Round 3 – Apr 13 @ Brampton
      { home: "toronto-city-saints", away: "durham-dawgs", date: "2025-04-13", time: "11:00", homeScore: 22, awayScore: 34, location: "Brampton" },
      { home: "brampton-beavers", away: "royal-city-goons", date: "2025-04-13", time: "13:00", homeScore: 68, awayScore: 8, location: "Brampton" },
      { home: "tavistock-trash-pandas", away: "brantford-broncos", date: "2025-04-13", time: "15:00", homeScore: 46, awayScore: 20, location: "Brampton" },
      // Round 4 – Apr 19 @ Brampton
      { home: "toronto-city-saints", away: "brampton-beavers", date: "2025-04-19", time: "11:00", homeScore: 6, awayScore: 38, location: "Brampton" },
      { home: "royal-city-goons", away: "brantford-broncos", date: "2025-04-19", time: "13:00", homeScore: 18, awayScore: 40, location: "Brampton" },
      { home: "durham-dawgs", away: "tavistock-trash-pandas", date: "2025-04-19", time: "15:00", homeScore: 14, awayScore: 64, location: "Brampton" },
    ];

    for (const m of season2025Matches) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        matchDate: m.date,
        matchTime: m.time,
        location: m.location,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: "completed",
        season: "2025",
      });
    }

    // ── 2025 Playoff Matches ──────────────────────────────────────────
    const playoffCompleted = [
      { home: "tavistock-trash-pandas", away: "royal-city-goons", date: "2025-04-27", time: "13:00", homeScore: 76, awayScore: 0, location: "Stratford" },
      { home: "brampton-beavers", away: "brantford-broncos", date: "2025-04-27", time: "15:00", homeScore: 38, awayScore: 36, location: "Stratford" },
    ];

    for (const m of playoffCompleted) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        matchDate: m.date,
        matchTime: m.time,
        location: m.location,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: "completed",
        season: "2025 Playoffs",
      });
    }

    const playoffUpcoming = [
      { home: "brantford-broncos", away: "royal-city-goons", date: "2025-05-04", time: "13:00", location: "Stratford" },
      { home: "tavistock-trash-pandas", away: "brampton-beavers", date: "2025-05-04", time: "15:00", location: "Stratford" },
    ];

    for (const m of playoffUpcoming) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        matchDate: m.date,
        matchTime: m.time,
        location: m.location,
        status: "upcoming",
        season: "2025 Playoffs",
      });
    }

    // ── Team Standings: 2025 Season (from old DB) ─────────────────────
    const standingsData = [
      { team: "tavistock-trash-pandas", played: 4, won: 4, drawn: 0, lost: 0, pointsFor: 244, pointsAgainst: 48, bonusPoints: 0, totalPoints: 8 },
      { team: "brampton-beavers", played: 4, won: 3, drawn: 0, lost: 1, pointsFor: 154, pointsAgainst: 64, bonusPoints: 0, totalPoints: 6 },
      { team: "brantford-broncos", played: 4, won: 2, drawn: 0, lost: 2, pointsFor: 124, pointsAgainst: 108, bonusPoints: 0, totalPoints: 4 },
      { team: "royal-city-goons", played: 4, won: 2, drawn: 0, lost: 2, pointsFor: 84, pointsAgainst: 134, bonusPoints: 0, totalPoints: 4 },
      { team: "durham-dawgs", played: 4, won: 1, drawn: 0, lost: 3, pointsFor: 80, pointsAgainst: 182, bonusPoints: 0, totalPoints: 2 },
      { team: "toronto-city-saints", played: 4, won: 0, drawn: 0, lost: 4, pointsFor: 32, pointsAgainst: 182, bonusPoints: 0, totalPoints: 0 },
    ];

    for (const s of standingsData) {
      await ctx.db.insert("teamStandings", {
        teamId: teamIds[s.team],
        season: "2025",
        played: s.played,
        won: s.won,
        drawn: s.drawn,
        lost: s.lost,
        pointsFor: s.pointsFor,
        pointsAgainst: s.pointsAgainst,
        bonusPoints: s.bonusPoints,
        totalPoints: s.totalPoints,
      });
    }

    return { alreadySeeded: false };
  },
});
