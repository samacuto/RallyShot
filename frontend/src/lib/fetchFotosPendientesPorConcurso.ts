import type { Foto } from './types/types'

export async function fetchFotosPendientesPorConcurso(
  concursoId: string,
  cookie = ''
): Promise<Foto[]> {
  const res = await fetch(
    `${
      import.meta.env.PUBLIC_SITE_ORIGIN || 'http://localhost:4321'
    }/api/fotografias/pending/${concursoId}`,
    {
      headers: { Cookie: cookie },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error('❌ Error al obtener fotos pendientes:', text)
    throw new Error('No se pudieron cargar las fotos pendientes')
  }

  return res.json()
}
