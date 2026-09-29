import 'server-only'

import { getSupabaseReadClient } from '@/lib/supabase/server'
import type { BirthdayData, BirthdayMessage } from '@/types/birthday'

const EMPTY_DATA: BirthdayData = {
  messages: [],
  stats: { messages: 0, photos: 0 },
  configurationMissing: true,
  hasError: false,
}

export async function getBirthdayData(): Promise<BirthdayData> {
  const supabase = getSupabaseReadClient()
  console.log('supabase', supabase)
  if (!supabase) return EMPTY_DATA

  const [messagesResult, photosResult] = await Promise.all([
    supabase
      .from('messages')
      .select('id, name, message, photo_path, envelope_style, approved, created_at', {
        count: 'exact',
      })
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('approved', true)
      .not('photo_path', 'is', null),
  ])

  console.log('messagesResult', messagesResult)
  console.log('photosResult', photosResult)

  if (messagesResult.error || photosResult.error) {
    return { ...EMPTY_DATA, configurationMissing: false, hasError: true }
  }

  return {
    messages: (messagesResult.data ?? []) as BirthdayMessage[],
    stats: {
      messages: messagesResult.count ?? messagesResult.data?.length ?? 0,
      photos: photosResult.count ?? 0,
    },
    configurationMissing: false,
    hasError: false,
  }
}