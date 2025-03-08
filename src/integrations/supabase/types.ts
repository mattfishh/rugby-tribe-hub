export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      coaches: {
        Row: {
          background: string | null
          created_at: string | null
          experience: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          position: string
          team_id: string | null
        }
        Insert: {
          background?: string | null
          created_at?: string | null
          experience?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          position: string
          team_id?: string | null
        }
        Update: {
          background?: string | null
          created_at?: string | null
          experience?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          position?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaches_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          created_at: string | null
          home_score: number | null
          home_team_id: string | null
          id: string
          location: string | null
          match_date: string
          match_time: string | null
          status: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          location?: string | null
          match_date: string
          match_time?: string | null
          status?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          location?: string | null
          match_date?: string
          match_time?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          conversions: number | null
          created_at: string | null
          id: string
          matches_played: number | null
          penalties: number | null
          player_id: string | null
          red_cards: number | null
          season: string
          tries: number | null
          yellow_cards: number | null
        }
        Insert: {
          conversions?: number | null
          created_at?: string | null
          id?: string
          matches_played?: number | null
          penalties?: number | null
          player_id?: string | null
          red_cards?: number | null
          season: string
          tries?: number | null
          yellow_cards?: number | null
        }
        Update: {
          conversions?: number | null
          created_at?: string | null
          id?: string
          matches_played?: number | null
          penalties?: number | null
          player_id?: string | null
          red_cards?: number | null
          season?: string
          tries?: number | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          age: number | null
          created_at: string | null
          experience: string | null
          height: string | null
          hometown: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          number: number | null
          position: string
          team_id: string | null
          weight: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          experience?: string | null
          height?: string | null
          hometown?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          number?: number | null
          position: string
          team_id?: string | null
          weight?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          experience?: string | null
          height?: string | null
          hometown?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          number?: number | null
          position?: string
          team_id?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_standings: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          division: string | null
          drawn: number | null
          id: string
          lost: number | null
          played: number | null
          points_against: number | null
          points_for: number | null
          season: string
          team_id: string | null
          total_points: number | null
          won: number | null
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          division?: string | null
          drawn?: number | null
          id?: string
          lost?: number | null
          played?: number | null
          points_against?: number | null
          points_for?: number | null
          season: string
          team_id?: string | null
          total_points?: number | null
          won?: number | null
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          division?: string | null
          drawn?: number | null
          id?: string
          lost?: number | null
          played?: number | null
          points_against?: number | null
          points_for?: number | null
          season?: string
          team_id?: string | null
          total_points?: number | null
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          is_home_team: boolean | null
          logo_url: string | null
          name: string
          short_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_home_team?: boolean | null
          logo_url?: string | null
          name: string
          short_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_home_team?: boolean | null
          logo_url?: string | null
          name?: string
          short_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
