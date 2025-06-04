// src/pages/api/gallery/[contestId].ts

import type { APIRoute } from 'astro'

interface FotografiaPorConcurso {
  id: string
  titulo: string
  descripcion: string
  url_imagen: string
  fecha_subida: string
  concurso_id: string
  usuarios: {
    display_name: string
  }
  total_votos: number
}

export const GET: APIRoute = async ({ request, params }) => {
  const contestId = params.contestId as string

  // Paginación, orden y límite desde query params (opcionales)
  const url = new URL(request.url)
  const page = url.searchParams.get('page') ?? '1'
  const limit = url.searchParams.get('limit') ?? '12'
  const sortBy = url.searchParams.get('sortBy') ?? 'fecha_subida'
  const order = url.searchParams.get('order') ?? 'desc'

  try {
    const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
    // Llamamos al endpoint del backend: GET /api/fotografia/gallery/:contestId
    // nuevo: ruta real de tu backend para sacar fotos de un concurso
    const res = await fetch(
      `${backendURL}/api/concursos/${contestId}/photos?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
    )

    if (!res.ok) {
      // Si el backend devuelve un error HTTP, reenvío el mensaje
      const errorText = await res.text()
      return new Response(JSON.stringify({ error: errorText }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parseo la respuesta JSON como array de fotos
    const fotos: FotografiaPorConcurso[] = await res.json()
    return new Response(JSON.stringify(fotos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    console.error('[API gallery/[contestId]] Error al obtener fotos:', err)
    return new Response(
      JSON.stringify({
        error: 'No se pudieron obtener las fotografías del concurso.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
