import type { Concurso, Foto } from './types/types'
import { getFotoUrl } from 'src/utils/getFotoUrl'

const API_CONCURSOS = `${import.meta.env.PUBLIC_BACKEND_BASE_URL}/api/concursos`
const API_GALLERY = `${
  import.meta.env.PUBLIC_BACKEND_BASE_URL
}/api/fotografias/gallery`

export async function fetchConcurso(): Promise<Concurso[]> {
  const res = await fetch(API_CONCURSOS)
  const data = await res.json()
  const concursosArray = Array.isArray(data) ? data : data.concursos ?? []

  return Promise.all(
    concursosArray.map(async (concurso: any) => {
      try {
        const fotosRes = await fetch(`${API_GALLERY}/${concurso.id}`)
        const fotosData = await fotosRes.json()

        const fotos: Foto[] = fotosData.map((foto: any) => ({
          id: foto.id,
          titulo: foto.titulo,
          url: getFotoUrl(foto.url_imagen),
          autor: '',
          votos: foto.total_votos ?? 0,
        }))

        return {
          id: concurso.id,
          titulo: concurso.nombre,
          descripcion: concurso.descripcion,
          fecha_inicio: concurso.fecha_inicio,
          fecha_fin_subida: concurso.fecha_fin_subida,
          fecha_inicio_votacion: concurso.fecha_inicio_votacion,
          fecha_fin_votacion: concurso.fecha_fin_votacion,
          max_fotos_participante: concurso.max_fotos_participante,
          fotos: fotos.slice(0, 3),
        }
      } catch {
        return {
          id: concurso.id,
          titulo: concurso.nombre,
          descripcion: concurso.descripcion,
          fecha_inicio: concurso.fecha_inicio,
          fecha_fin_subida: concurso.fecha_fin_subida,
          fecha_inicio_votacion: concurso.fecha_inicio_votacion,
          fecha_fin_votacion: concurso.fecha_fin_votacion,
          max_fotos_participante: concurso.max_fotos_participante,
        }
      }
    })
  )
}
