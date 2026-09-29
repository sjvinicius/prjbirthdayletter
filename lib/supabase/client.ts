'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) return null

  browserClient ??= createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })

  return browserClient
}