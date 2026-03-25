import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          room_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          room_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          room_id?: string;
          created_at?: string;
        };
      };
      swipes: {
        Row: {
          id: string;
          user_id: string;
          content_id: number;
          liked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: number;
          liked: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: number;
          liked?: boolean;
          created_at?: string;
        };
      };
      content_cache: {
        Row: {
          id: number;
          title: string;
          overview: string;
          poster_path: string;
          rating: number;
          providers: string[];
          content_type: string;
          popularity: number;
          created_at: string;
        };
        Insert: {
          id: number;
          title: string;
          overview: string;
          poster_path: string;
          rating: number;
          providers: string[];
          content_type: string;
          popularity: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          overview?: string;
          poster_path?: string;
          rating?: number;
          providers?: string[];
          content_type?: string;
          popularity?: number;
          created_at?: string;
        };
      };
    };
  };
};
