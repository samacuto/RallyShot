// src/pages/api/concursos/[contestId]/join.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, params, locals }) => {
  // Verificamos que hay usuario en locals (token válido)
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const contestId = params.contestId as string
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

  try {
    // Extraemos token de la cookie (igual que antes)
    const rawCookies = request.headers.get('cookie') || ''
    const token =
      rawCookies
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1] || ''

    if (!token) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Reenviamos el POST al backend real
    const resp = await fetch(`${backendURL}/api/concursos/${contestId}/join`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // No hace falta body, porque tu backend no lo espera
    })

    // Si el backend devolvió 401, reenviamos 401
    if (resp.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Leemos la respuesta del backend y se la reenviamos al cliente
    const data = await resp.json()
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API Astro] Error proxy /join:', err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
