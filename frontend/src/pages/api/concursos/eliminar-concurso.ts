import type { APIRoute } from 'astro'

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const token = cookies.get('access_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
    })
  }

  const res = await fetch(
    `${import.meta.env.PUBLIC_BACKEND_BASE_URL}/api/concursos/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    const error = await res.json()
    return new Response(JSON.stringify(error), { status: 400 })
  }

  return new Response(null, { status: 204 })
}
