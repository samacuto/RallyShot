const SUPABASE_URL =
  'https://dlpkjbieyipfvrtolbtt.supabase.co/storage/v1/object/public/fotos/'

export function getFotoUrl(url: string): string {
  return url.startsWith('http') ? url : `${SUPABASE_URL}${url}`
}
