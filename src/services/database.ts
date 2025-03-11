import { supabase } from "@/integrations/supabase/client";
import type { Player, Coach, Match, PlayerStats, TeamStanding, Team } from "@/types/database";
import { toast } from "sonner";

// Teams
export async function getHomeTeam() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('is_home_team', true)
      .single();
      
    if (error) throw error;
    return data as Team;
  } catch (error) {
    console.error('Error fetching home team:', error);
    toast.error('Failed to load team data');
    return null;
  }
}

export async function getOpponentTeams() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('is_home_team', false);
      
    if (error) throw error;
    return data as Team[];
  } catch (error) {
    console.error('Error fetching opponent teams:', error);
    toast.error('Failed to load opponent teams');
    return [];
  }
}

// Players
export async function getPlayers(teamId: string) {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true);
      
    if (error) throw error;
    return data as Player[];
  } catch (error) {
    console.error('Error fetching players:', error);
    toast.error('Failed to load players');
    return [];
  }
}

export async function getPlayer(playerId: string) {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();
      
    if (error) throw error;
    return data as Player;
  } catch (error) {
    console.error('Error fetching player:', error);
    toast.error('Failed to load player details');
    return null;
  }
}

// Coaches
export async function getCoaches(teamId: string) {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true);
      
    if (error) throw error;
    return data as Coach[];
  } catch (error) {
    console.error('Error fetching coaches:', error);
    toast.error('Failed to load coaches');
    return [];
  }
}

// Matches
export async function getUpcomingMatches() {
  try {
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .gte('match_date', today)
      .is('home_score', null) // Only matches with no score yet
      .is('away_score', null) // Only matches with no score yet
      .order('match_date', { ascending: true });
      
    if (error) throw error;
    return data as Match[];
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    toast.error('Failed to load upcoming matches');
    return [];
  }
}

export async function getNextMatch() {
  try {
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .gte('match_date', today)
      .order('match_date', { ascending: true })
      .limit(1)
      .single();
      
    if (error) throw error;
    return data as Match;
  } catch (error) {
    console.error('Error fetching next match:', error);
    return null;
  }
}

export async function getPastMatches() {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .not('home_score', 'is', null) // Matches that have scores recorded
      .not('away_score', 'is', null) // Matches that have scores recorded
      .order('match_date', { ascending: false });
      
    if (error) throw error;
    return data as Match[];
  } catch (error) {
    console.error('Error fetching past matches:', error);
    toast.error('Failed to load past matches');
    return [];
  }
}

// Player Stats
export async function getPlayerStats(season: string = "2025") {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select(`
        *,
        player:player_id(id, name, position, number, image_url)
      `)
      .eq('season', season)
      .order('tries', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    toast.error('Failed to load player statistics');
    return [];
  }
}

// Team Standings
export async function getTeamStandings(season: string) {
  try {
    const { data, error } = await supabase
      .from('team_standings')
      .select(`
        *,
        team:team_id(id, name, short_name, logo_url, is_home_team)
      `)
      .eq('season', season)
      .order('total_points', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching team standings:', error);
    toast.error('Failed to load standings');
    return [];
  }
}

// Update team standings from match results
export async function updateTeamStandingsFromMatches(season: string = "2025") {
  try {
    // Get all completed matches (with scores)
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .not('home_score', 'is', null)
      .not('away_score', 'is', null);
      
    if (matchesError) throw matchesError;
    
    if (!matches || matches.length === 0) {
      toast.info('No completed matches found to update standings');
      return false;
    }
    
    // Get all teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*');
      
    if (teamsError) throw teamsError;
    
    if (!teams || teams.length === 0) {
      toast.error('No teams found');
      return false;
    }
    
    // Initialize standings for each team
    const standings: Record<string, {
      team_id: string,
      season: string,
      played: number,
      won: number,
      lost: number,
      drawn: number,
      points_for: number,
      points_against: number,
      bonus_points: number,
      total_points: number
    }> = {};
    
    teams.forEach(team => {
      standings[team.id] = {
        team_id: team.id,
        season,
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        points_for: 0,
        points_against: 0,
        bonus_points: 0,
        total_points: 0
      };
    });
    
    // Process each match
    matches.forEach(match => {
      if (match.home_score === null || match.away_score === null || 
          !match.home_team_id || !match.away_team_id) return;
          
      const homeTeamStanding = standings[match.home_team_id];
      const awayTeamStanding = standings[match.away_team_id];
      
      if (!homeTeamStanding || !awayTeamStanding) return;
      
      // Update matches played
      homeTeamStanding.played += 1;
      awayTeamStanding.played += 1;
      
      // Update points for and against
      homeTeamStanding.points_for += match.home_score;
      homeTeamStanding.points_against += match.away_score;
      awayTeamStanding.points_for += match.away_score;
      awayTeamStanding.points_against += match.home_score;
      
      // Update win/loss/draw
      if (match.home_score > match.away_score) {
        // Home team won
        homeTeamStanding.won += 1;
        awayTeamStanding.lost += 1;
        homeTeamStanding.total_points += 4; // 4 points for a win
      } else if (match.home_score < match.away_score) {
        // Away team won
        homeTeamStanding.lost += 1;
        awayTeamStanding.won += 1;
        awayTeamStanding.total_points += 4; // 4 points for a win
      } else {
        // Draw
        homeTeamStanding.drawn += 1;
        awayTeamStanding.drawn += 1;
        homeTeamStanding.total_points += 2; // 2 points for a draw
        awayTeamStanding.total_points += 2; // 2 points for a draw
      }
      
      // Add bonus point for scoring 4+ tries (assuming each try is worth 5 points)
      // This is a rugby-specific rule - customize as needed
      if (match.home_score >= 20) {
        homeTeamStanding.bonus_points += 1;
        homeTeamStanding.total_points += 1;
      }
      if (match.away_score >= 20) {
        awayTeamStanding.bonus_points += 1;
        awayTeamStanding.total_points += 1;
      }
      
      // Add losing bonus point for losing by 7 or fewer points
      if (match.home_score < match.away_score && (match.away_score - match.home_score) <= 7) {
        homeTeamStanding.bonus_points += 1;
        homeTeamStanding.total_points += 1;
      }
      if (match.away_score < match.home_score && (match.home_score - match.away_score) <= 7) {
        awayTeamStanding.bonus_points += 1;
        awayTeamStanding.total_points += 1;
      }
    });
    
    // First, clear existing standings for the season
    const { error: deleteError } = await supabase
      .from('team_standings')
      .delete()
      .eq('season', season);
      
    if (deleteError) throw deleteError;
    
    // Insert new standings
    const standingsArray = Object.values(standings);
    
    const { error: insertError } = await supabase
      .from('team_standings')
      .insert(standingsArray);
      
    if (insertError) throw insertError;
    
    toast.success('Team standings updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating team standings:', error);
    toast.error('Failed to update team standings');
    throw error;
  }
}
