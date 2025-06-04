import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData()
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

  const token = cookies.get('access_token')?.value
  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    })
  }

  // Convertir FormData a objeto plano
  const plainObject: Record<string, any> = {}
  for (const [key, value] of formData.entries()) {
    plainObject[key] = value.toString()
  }

  // Petición al backend
  const res = await fetch(`${backendURL}/api/concursos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(plainObject),
  })

  const result = await res.json()

  // ⚠️ Si hay error, redirige con el mensaje
  if (!res.ok) {
    const errorMsg =
      typeof result.error === 'string'
        ? result.error
        : result.error?.[0]?.message || 'Error al crear el concurso'

    return new Response(null, {
      status: 302,
      headers: {
        Location: `/admin/crear-concurso?error=${encodeURIComponent(errorMsg)}`,
      },
    })
  }

  // ✅ Éxito: redirigir al panel con ID del concurso
  return new Response(null, {
    status: 303,
    headers: {
      Location: `/admin/panel?concurso=${result.id}`,
    },
  })
}
