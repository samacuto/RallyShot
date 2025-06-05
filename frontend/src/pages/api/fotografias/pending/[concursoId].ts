import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ params, cookies }) => {
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const concursoId = params.concursoId
  const token = cookies.get('access_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
    })
  }

  const res = await fetch(
    `${backendURL}/api/fotografias/pending/${concursoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
