
export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  is_home_team: boolean;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number | null;
  height: string | null;
  weight: string | null;
  age: number | null;
  hometown: string | null;
  experience: string | null;
  image_url: string | null;
  team_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Coach {
  id: string;
  name: string;
  position: string;
  experience: string | null;
  background: string | null;
  image_url: string | null;
  team_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  match_time: string | null;
  location: string | null;
  home_score: number | null;
  away_score: number | null;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
  home_team?: Team;
  away_team?: Team;
}

export interface PlayerStats {
  id: string;
  player_id: string;
  season: string;
  matches_played: number;
  tries: number;
  conversions: number;
  penalties: number;
  yellow_cards: number;
  red_cards: number;
  created_at: string;
}

export interface TeamStanding {
  id: string;
  team_id: string;
  season: string;
  division: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points_for: number;
  points_against: number;
  bonus_points: number;
  total_points: number;
  created_at: string;
}
