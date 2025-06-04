// src/pages/api/concursos/[contestId]/joined.ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, params, locals }) => {
  console.log('\n[joined.ts] ===== INICIO ENDPOINT =====')
  console.log('[joined.ts] locals.user:', locals.user)
  console.log('[joined.ts] cookie:', request.headers.get('cookie'))

  if (!locals.user) {
    console.log('[joined.ts] ❌ No hay usuario en locals')
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const contestId = params.contestId as string
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  console.log('[joined.ts] contestId:', contestId)
  console.log('[joined.ts] backendURL:', backendURL)

  const rawCookies = request.headers.get('cookie') || ''
  const token =
    rawCookies
      .split('; ')
      .find((r) => r.startsWith('access_token='))
      ?.split('=')[1] || ''

  console.log('[joined.ts] token existe:', token ? '✅' : '❌')

  try {
    const backendUrl = `${backendURL}/api/concursos/${contestId}/joined`
    console.log('[joined.ts] Llamando al backend:', backendUrl)

    const resp = await fetch(backendUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('[joined.ts] backend status:', resp.status)

    if (resp.status === 401) {
      console.log('[joined.ts] ❌ Backend devolvió 401')
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await resp.json()
    console.log('[joined.ts] backend data:', data)
    console.log('[joined.ts] ===== FIN ENDPOINT =====\n')

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[joined.ts] ❌ Error proxy /joined:', err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
