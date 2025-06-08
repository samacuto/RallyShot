// src/lib/fetchFotografia.ts
import type { Fotografia } from './types/types'

export async function fetchFotografiaRankingGlobal(
  limit = 10
): Promise<Fotografia[]> {
  const res = await fetch(
    `${
      import.meta.env.PUBLIC_BACKEND_BASE_URL
    }/api/fotografias/ranking-global?limit=${limit}`
  )
  if (!res.ok) throw new Error('Error al obtener ranking global')
  return (await res.json()) as Fotografia[]
}
