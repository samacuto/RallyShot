import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { userId, codigo, nueva_password } = body

    const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

    const res = await fetch(`${backendURL}/api/auth/confirm-change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, codigo, nueva_password }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('❌ Error en /api/cambiar-contrasena.ts:', error)
    return new Response(
      JSON.stringify({ error: 'Error inesperado en el servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
