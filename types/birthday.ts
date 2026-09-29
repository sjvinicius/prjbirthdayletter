export const ENVELOPE_STYLES = [
  'sage',
  'rose',
  'butter',
  'blue',
  'clay',
] as const

export type EnvelopeStyle = (typeof ENVELOPE_STYLES)[number]

export type BirthdayMessage = {
  id: string
  name: string
  message: string
  photo_path: string | null
  envelope_style: EnvelopeStyle
  approved: boolean
  created_at: string
}

export type BirthdayStats = {
  messages: number
  photos: number
}

export type BirthdayData = {
  messages: BirthdayMessage[]
  stats: BirthdayStats
  configurationMissing: boolean
  hasError: boolean
}