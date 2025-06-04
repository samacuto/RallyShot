import type { APIRoute } from 'astro'
import cookie from 'cookie'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
    })
  }

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
