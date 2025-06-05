export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const fotoId = params.id
  const token = cookies.get('access_token')?.value

  if (!fotoId || !token) {
    return new Response(JSON.stringify({ error: 'ID o token faltante' }), {
      status: 400,
    })
  }

  const body = await request.json()

  const res = await fetch(`${backendURL}/api/fotografias/${fotoId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
