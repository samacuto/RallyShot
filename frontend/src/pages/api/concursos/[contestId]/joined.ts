import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, params, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const contestId = params.contestId as string
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

  const rawCookies = request.headers.get('cookie') || ''
  const token =
    rawCookies
      .split('; ')
      .find((r) => r.startsWith('access_token='))
      ?.split('=')[1] || ''

  try {
    const backendUrl = `${backendURL}/api/concursos/${contestId}/joined`

    const resp = await fetch(backendUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (resp.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await resp.json()

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[joined.ts] Error proxy /joined:', err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
