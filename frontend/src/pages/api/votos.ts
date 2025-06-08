// src/pages/api/votos.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json()
    const photoId = body.photoId

    if (!photoId) {
      return new Response(
        JSON.stringify({ error: 'ID de fotografía requerido' }),
        { status: 400 }
      )
    }

    const token = cookies.get('access_token')?.value
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Debes iniciar sesión para votar' }),
        { status: 401 }
      )
    }

    const backendUrl = import.meta.env.PUBLIC_BACKEND_BASE_URL
    if (!backendUrl) {
      console.error('PUBLIC_BACKEND_BASE_URL no está definida')
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servidor' }),
        { status: 500 }
      )
    }

    const res = await fetch(`${backendUrl}/api/votos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ photoId }),
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data.error || 'Error al registrar el voto' }),
        { status: res.status }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Voto registrado correctamente' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en API votos:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    )
  }
}
