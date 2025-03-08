
import { supabase } from "@/integrations/supabase/client";

export async function seedDatabase() {
  try {
    // Get the home team (Trash Pandas) first
    const { data: homeTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('is_home_team', true)
      .single();
    
    if (!homeTeam) {
      console.error('Home team not found');
      return;
    }
    
    // Check if we've already seeded data
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }
    
    // Insert opponent teams
    const opponentTeamsData = [
      { name: 'Westside Warriors', short_name: 'Warriors', logo_url: null, is_home_team: false },
      { name: 'Northern Knights', short_name: 'Knights', logo_url: null, is_home_team: false },
      { name: 'Eastside Eagles', short_name: 'Eagles', logo_url: null, is_home_team: false },
      { name: 'Metro Rugby FC', short_name: 'Metro', logo_url: null, is_home_team: false },
      { name: 'Southern Sharks', short_name: 'Sharks', logo_url: null, is_home_team: false },
      { name: 'City Barbarians', short_name: 'Barbarians', logo_url: null, is_home_team: false },
      { name: 'Rivals Club', short_name: 'Rivals', logo_url: null, is_home_team: false },
    ];
    
    const { data: opponentTeams, error: teamsError } = await supabase
      .from('teams')
      .insert(opponentTeamsData)
      .select();
      
    if (teamsError) {
      console.error('Error inserting teams:', teamsError);
      return;
    }
    
    // Insert players for Trash Pandas
    const playersData = [
      {
        name: "Jack Williams", position: "Prop", number: 1, height: "6'2\"", weight: "240 lbs",
        age: 28, hometown: "Tavistock", experience: "7 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Jack+W.",
        team_id: homeTeam.id
      },
      {
        name: "Thomas Smith", position: "Hooker", number: 2, height: "5'11\"", weight: "220 lbs",
        age: 25, hometown: "Brighton", experience: "5 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Thomas+S.",
        team_id: homeTeam.id
      },
      {
        name: "Ryan Johnson", position: "Prop", number: 3, height: "6'3\"", weight: "255 lbs",
        age: 29, hometown: "Oxford", experience: "8 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Ryan+J.",
        team_id: homeTeam.id
      },
      {
        name: "Michael Brown", position: "Lock", number: 4, height: "6'6\"", weight: "245 lbs",
        age: 26, hometown: "Tavistock", experience: "4 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Michael+B.",
        team_id: homeTeam.id
      },
      {
        name: "David Jones", position: "Lock", number: 5, height: "6'5\"", weight: "240 lbs",
        age: 30, hometown: "Cambridge", experience: "10 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=David+J.",
        team_id: homeTeam.id
      },
      {
        name: "James Wilson", position: "Flanker", number: 6, height: "6'2\"", weight: "220 lbs",
        age: 26, hometown: "Tavistock", experience: "5 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=James+W.",
        team_id: homeTeam.id
      },
      {
        name: "Harry Moore", position: "Scrum Half", number: 9, height: "5'9\"", weight: "175 lbs",
        age: 24, hometown: "London", experience: "6 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Harry+M.",
        team_id: homeTeam.id
      },
      {
        name: "Oliver Taylor", position: "Fly Half", number: 10, height: "5'11\"", weight: "185 lbs",
        age: 27, hometown: "Tavistock", experience: "7 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Oliver+T.",
        team_id: homeTeam.id
      },
      {
        name: "Noah Martin", position: "Inside Center", number: 12, height: "6'0\"", weight: "200 lbs",
        age: 25, hometown: "Exeter", experience: "5 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Noah+M.",
        team_id: homeTeam.id
      },
      {
        name: "Charlie Wright", position: "Outside Center", number: 13, height: "6'1\"", weight: "205 lbs",
        age: 26, hometown: "Tavistock", experience: "4 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Charlie+W.",
        team_id: homeTeam.id
      },
      {
        name: "George Thompson", position: "Winger", number: 14, height: "5'10\"", weight: "180 lbs",
        age: 23, hometown: "Bristol", experience: "3 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=George+T.",
        team_id: homeTeam.id
      },
      {
        name: "Leo Clark", position: "Fullback", number: 15, height: "6'0\"", weight: "190 lbs",
        age: 28, hometown: "Tavistock", experience: "8 years", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Leo+C.",
        team_id: homeTeam.id
      }
    ];
    
    const { error: playersError } = await supabase
      .from('players')
      .insert(playersData);
      
    if (playersError) {
      console.error('Error inserting players:', playersError);
      return;
    }
    
    // Insert coaches
    const coachesData = [
      {
        name: "Robert Anderson", position: "Head Coach", experience: "15 years",
        background: "Former National Team Player", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Coach+Robert",
        team_id: homeTeam.id
      },
      {
        name: "Steven Lewis", position: "Assistant Coach", experience: "10 years",
        background: "Specialist in Forward Play", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Coach+Steven",
        team_id: homeTeam.id
      },
      {
        name: "Mark Davies", position: "Fitness Coach", experience: "12 years",
        background: "Sports Science Specialist", image_url: "https://placehold.co/300x300/333333/FFFFFF?text=Coach+Mark",
        team_id: homeTeam.id
      }
    ];
    
    const { error: coachesError } = await supabase
      .from('coaches')
      .insert(coachesData);
      
    if (coachesError) {
      console.error('Error inserting coaches:', coachesError);
      return;
    }
    
    // Handle matches
    if (opponentTeams) {
      const currentDate = new Date();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
      
      const upcomingMatchesData = [];
      const pastMatchesData = [];
      
      for (let i = 0; i < 3; i++) {
        const matchDate = new Date();
        matchDate.setDate(currentDate.getDate() + (i * 7) + 5); // Add 5 days plus 7 days per iteration
        
        upcomingMatchesData.push({
          home_team_id: i % 2 === 0 ? homeTeam.id : opponentTeams[i].id,
          away_team_id: i % 2 === 0 ? opponentTeams[i].id : homeTeam.id,
          match_date: matchDate.toISOString().split('T')[0],
          match_time: '15:00:00',
          location: i % 2 === 0 ? 'Tavistock Rugby Grounds' : `${opponentTeams[i].name} Stadium`,
          status: 'upcoming'
        });
      }
      
      for (let i = 0; i < 3; i++) {
        const matchDate = new Date();
        matchDate.setDate(twoMonthsAgo.getDate() + (i * 7));
        
        // Random scores with home team advantage
        const homeScore = Math.floor(Math.random() * 20) + 10;
        const awayScore = Math.floor(Math.random() * 15) + 5;
        const homeWin = (i % 2 === 0 && homeScore > awayScore) || (i % 2 === 1 && homeScore < awayScore);
        
        pastMatchesData.push({
          home_team_id: i % 2 === 0 ? homeTeam.id : opponentTeams[i + 3].id,
          away_team_id: i % 2 === 0 ? opponentTeams[i + 3].id : homeTeam.id,
          match_date: matchDate.toISOString().split('T')[0],
          match_time: '15:00:00',
          location: i % 2 === 0 ? 'Tavistock Rugby Grounds' : `${opponentTeams[i + 3].name} Stadium`,
          home_score: i % 2 === 0 ? (homeWin ? homeScore : awayScore) : (homeWin ? awayScore : homeScore),
          away_score: i % 2 === 0 ? (homeWin ? awayScore : homeScore) : (homeWin ? homeScore : awayScore),
          status: 'completed'
        });
      }
      
      const { error: upcomingMatchesError } = await supabase
        .from('matches')
        .insert(upcomingMatchesData);
        
      if (upcomingMatchesError) {
        console.error('Error inserting upcoming matches:', upcomingMatchesError);
      }
      
      const { error: pastMatchesError } = await supabase
        .from('matches')
        .insert(pastMatchesData);
        
      if (pastMatchesError) {
        console.error('Error inserting past matches:', pastMatchesError);
      }
      
      // Get inserted players to get their IDs
      const { data: playersList } = await supabase
        .from('players')
        .select('id');
      
      if (playersList) {
        // Insert player stats
        const playerStatsData = playersList.map((player, index) => ({
          player_id: player.id,
          season: '2023-2024',
          matches_played: 10 - (index % 3),
          tries: index < 5 ? Math.floor(Math.random() * 6) : Math.floor(Math.random() * 3),
          conversions: index === 1 || index === 7 ? Math.floor(Math.random() * 15) : 0,
          penalties: index === 1 || index === 7 ? Math.floor(Math.random() * 10) : 0,
          yellow_cards: index % 5 === 0 ? 1 : 0,
          red_cards: 0
        }));
        
        const { error: playerStatsError } = await supabase
          .from('player_stats')
          .insert(playerStatsData);
          
        if (playerStatsError) {
          console.error('Error inserting player stats:', playerStatsError);
        }
      }
      
      // Insert team standings
      const teamStandingsData = [
        {
          team_id: homeTeam.id,
          season: '2023-2024',
          division: 'League',
          played: 10,
          won: 7,
          drawn: 1,
          lost: 2,
          points_for: 186,
          points_against: 124,
          bonus_points: 3,
          total_points: 26
        },
        ...opponentTeams.map((team, index) => ({
          team_id: team.id,
          season: '2023-2024',
          division: 'League',
          played: 10,
          won: 6 - index,
          drawn: index < 3 ? 1 : 0,
          lost: 3 + (index < 3 ? 0 : (index - 2)),
          points_for: 176 - (index * 8),
          points_against: 142 + (index * 3),
          bonus_points: index < 4 ? 3 : 2,
          total_points: 24 - (index * 2)
        }))
      ];
      
      const divisionTeams = [homeTeam.id, ...opponentTeams.slice(0, 3).map(t => t.id)];
      
      const divisionStandingsData = divisionTeams.map((teamId, index) => ({
        team_id: teamId,
        season: '2023-2024',
        division: 'Division',
        played: 5,
        won: index === 0 ? 4 : (3 - index),
        drawn: index === 1 ? 1 : 0,
        lost: index === 0 ? 1 : (1 + index),
        points_for: 94 - (index * 10),
        points_against: 58 + (index * 8),
        bonus_points: index < 2 ? 2 : 1,
        total_points: index === 0 ? 14 : (13 - (index * 4))
      }));
      
      const { error: leagueStandingsError } = await supabase
        .from('team_standings')
        .insert(teamStandingsData);
        
      if (leagueStandingsError) {
        console.error('Error inserting league standings:', leagueStandingsError);
      }
      
      const { error: divisionStandingsError } = await supabase
        .from('team_standings')
        .insert(divisionStandingsData);
        
      if (divisionStandingsError) {
        console.error('Error inserting division standings:', divisionStandingsError);
      }
      
      console.log('Database seeding completed successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
