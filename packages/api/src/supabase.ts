import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient

export const initSupabase = (url: string, anonKey: string) => {
  supabase = createClient(url, anonKey)
}

export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    throw new Error('Supabase not initialized. Call initSupabase() first.')
  }
  return supabase
}
