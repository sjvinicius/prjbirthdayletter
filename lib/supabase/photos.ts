export function getPublicPhotoUrl(path: string, supabaseUrl: string | null) {
  if (!supabaseUrl) return null

  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/birthday/${encodedPath}`
}