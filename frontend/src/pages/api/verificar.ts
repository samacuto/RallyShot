import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userId, codigo } = await request.json()

    if (!userId || !codigo) {
      return new Response(JSON.stringify({ error: 'Faltan campos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
    const res = await fetch(`${backendURL}/api/auth/verify-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, codigo }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error en /api/verificar:', err)
    return new Response(
      JSON.stringify({ error: 'Error inesperado del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
