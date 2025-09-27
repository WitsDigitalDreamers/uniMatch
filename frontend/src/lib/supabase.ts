import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id_number: string
          username: string
          first_name: string
          last_name: string
          email: string
          school_id: string
          marks: Record<string, number>
          preferred_residences: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id_number: string
          username: string
          first_name: string
          last_name: string
          email: string
          school_id: string
          marks: Record<string, number>
          preferred_residences: string[]
        }
        Update: {
          username?: string
          first_name?: string
          last_name?: string
          email?: string
          school_id?: string
          marks?: Record<string, number>
          preferred_residences?: string[]
          updated_at?: string
        }
      }
    }
  }
}
