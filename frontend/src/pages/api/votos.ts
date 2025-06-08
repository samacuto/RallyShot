// src/pages/api/votos.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json()
    const photoId = body.photoId
    if (!photoId) {
      return new Response(
        JSON.stringify({ error: 'ID de fotografía requerido' }),
        {
          status: 400,
        }
      )
    }

    const backendUrl = import.meta.env.PUBLIC_BACKEND_BASE_URL
    const token = cookies.get('access_token')?.value

    const res = await fetch(`${backendUrl}/api/votos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ photoId }),
    })

    if (!res.ok) {
      const error = await res.json()
      return new Response(JSON.stringify(error), { status: res.status })
    }

    return new Response(
      JSON.stringify({ message: 'Voto registrado correctamente' }),
      {
        status: 201,
      }
    )
  } catch (error: any) {
    console.error('Error en API votos:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }
}
