export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      voting_state: {
        Row: {
          id: number
          options: string[]
          votes: number[]
          voting_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          options?: string[]
          votes?: number[]
          voting_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          options?: string[]
          votes?: number[]
          voting_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
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
  }
}