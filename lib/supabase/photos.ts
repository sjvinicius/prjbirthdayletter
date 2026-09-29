export function getPublicPhotoUrl(path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!supabaseUrl) return null

  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/birthday/${encodedPath}`
}