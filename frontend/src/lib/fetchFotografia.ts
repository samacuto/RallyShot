import type { Foto } from './types/types'
import { getFotoUrl } from '@lib/utils/getFotoUrl'

const API_RANKING = `${
  import.meta.env.PUBLIC_BACKEND_BASE_URL
}/api/fotografias/ranking-global`

export async function fetchFotografia(): Promise<Foto[]> {
  const res = await fetch(API_RANKING)
  const data = await res.json()

  return (Array.isArray(data) ? data : [])
    .map((foto: any) => ({
      id: foto.id,
      titulo: foto.titulo,
      autor: foto.concurso?.nombre ?? 'Desconocido',
      url: getFotoUrl(foto.url_imagen),
      votos: foto.total_votos ?? 0,
    }))
    .slice(0, 6)
}
