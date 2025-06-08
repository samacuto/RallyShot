import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()

  const data = Object.fromEntries(formData.entries())
  const foto_perfil = formData.get('foto_perfil') as File

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

  const body = new FormData()
  Object.entries(data).forEach(([key, val]) => {
    if (key !== 'foto_perfil') body.append(key, val.toString())
  })
  if (foto_perfil && foto_perfil.size > 0) {
    body.append('foto_perfil', foto_perfil)
  }

  const res = await fetch(`${backendURL}/api/auth/register`, {
    method: 'POST',
    body,
  })

  const result = await res.json()

  if (res.ok) {
    // Guarda en localStorage y redirige a verificación
    return new Response(null, {
      status: 302,
      headers: {
        'Set-Cookie': `temp_user_id=${result.userId}; Path=/; Max-Age=300`,
        Location: '/verificar',
      },
    })
  }

  const params = new URLSearchParams({
    error: result.error || 'Error desconocido',
  })

  return new Response(null, {
    status: 302,
    headers: { Location: `/register?${params.toString()}` },
  })
}
