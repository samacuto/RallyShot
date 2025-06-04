import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text()
  const params = new URLSearchParams(body)
  const emailOrUsername = params.get('emailOrUsername')

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/forgotten-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername }),
  })

  const data = await res.json()

  if (res.ok) {
    const query = new URLSearchParams({
      userId: data.userId,
      codigo: data.codigo,
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: `/cambiar-contrasena?${query.toString()}`,
      },
    })
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/olvide-contrasena?error=1',
    },
  })
}
