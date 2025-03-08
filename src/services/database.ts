
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
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:home_team_id(id, name, short_name, logo_url),
        away_team:away_team_id(id, name, short_name, logo_url)
      `)
      .eq('status', 'upcoming')
      .order('match_date', { ascending: true });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    toast.error('Failed to load upcoming matches');
    return [];
  }
}

export async function getPastMatches() {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:home_team_id(id, name, short_name, logo_url),
        away_team:away_team_id(id, name, short_name, logo_url)
      `)
      .eq('status', 'completed')
      .order('match_date', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching past matches:', error);
    toast.error('Failed to load past matches');
    return [];
  }
}

// Player Stats
export async function getPlayerStats(season: string) {
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
export async function getTeamStandings(season: string, division?: string) {
  try {
    let query = supabase
      .from('team_standings')
      .select(`
        *,
        team:team_id(id, name, short_name, logo_url, is_home_team)
      `)
      .eq('season', season)
      .order('total_points', { ascending: false });
      
    if (division) {
      query = query.eq('division', division);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching team standings:', error);
    toast.error('Failed to load standings');
    return [];
  }
}
