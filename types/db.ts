export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "owner" | "admin" | "member";
export type MatchStatus = "scheduled" | "live" | "completed";

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  favorite_team: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type League = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type LeagueMember = {
  id: string;
  league_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
};

export type Match = {
  id: string;
  match_number: number | null;
  tournament: string;
  stage: string;
  group_name: string | null;
  team_a: string;
  team_b: string;
  kickoff_time: string;
  venue: string | null;
  team_a_score: number | null;
  team_b_score: number | null;
  status: MatchStatus;
  created_at: string;
};

export type Prediction = {
  id: string;
  league_id: string;
  match_id: string;
  user_id: string;
  pred_team_a_score: number;
  pred_team_b_score: number;
  stake_text: string | null;
  points_awarded: number | null;
  submitted_at: string;
};

export type StakeSettlement = {
  id: string;
  league_id: string;
  match_id: string;
  owed_by: string;
  owed_to: string;
  stake_text: string;
  settled: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          bio?: string | null;
          favorite_team?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      leagues: {
        Row: League;
        Insert: {
          id?: string;
          name: string;
          invite_code: string;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<Omit<League, "id" | "created_by">>;
        Relationships: [];
      };
      league_members: {
        Row: LeagueMember;
        Insert: {
          id?: string;
          league_id: string;
          user_id: string;
          role?: UserRole;
          joined_at?: string;
        };
        Update: Partial<Omit<LeagueMember, "id" | "league_id" | "user_id">>;
        Relationships: [];
      };
      matches: {
        Row: Match;
        Insert: {
          id?: string;
          match_number?: number | null;
          tournament: string;
          stage: string;
          group_name?: string | null;
          team_a: string;
          team_b: string;
          kickoff_time: string;
          venue?: string | null;
          team_a_score?: number | null;
          team_b_score?: number | null;
          status?: MatchStatus;
          created_at?: string;
        };
        Update: Partial<Omit<Match, "id" | "created_at">>;
        Relationships: [];
      };
      predictions: {
        Row: Prediction;
        Insert: {
          id?: string;
          league_id: string;
          match_id: string;
          user_id: string;
          pred_team_a_score: number;
          pred_team_b_score: number;
          stake_text?: string | null;
          points_awarded?: number | null;
          submitted_at?: string;
        };
        Update: Partial<
          Omit<Prediction, "id" | "league_id" | "match_id" | "user_id">
        >;
        Relationships: [];
      };
      stake_settlements: {
        Row: StakeSettlement;
        Insert: {
          id?: string;
          league_id: string;
          match_id: string;
          owed_by: string;
          owed_to: string;
          stake_text: string;
          settled?: boolean;
          created_at?: string;
        };
        Update: Partial<Omit<StakeSettlement, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      create_league_for_current_user: {
        Args: {
          league_name: string;
          invite_code_input: string;
        };
        Returns: string;
      };
      join_league_by_invite: {
        Args: {
          invite_code_input: string;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      match_status: MatchStatus;
    };
    CompositeTypes: {};
  };
};
