import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const emailOrUsername = formData.get('emailOrUsername')
  const password = formData.get('password')

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

  const res = await fetch(`${backendURL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername, password }),
  })

  const data = await res.json()

  // Usuario no verificado
  if (data?.error?.includes('verificada')) {
    // Intentamos recuperar el userId del backend (si lo tienes disponible)
    const getUserIdRes = await fetch(`${backendURL}/api/auth/get-user-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername }),
    })

    const userData = await getUserIdRes.json()
    const userId = userData.userId

    if (userId) {
      return new Response(null, {
        status: 302,
        headers: {
          'Set-Cookie': `temp_user_id=${userId}; Path=/; Max-Age=300`,
          Location: '/verificar?unverified=1',
        },
      })
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/verificar?unverified=1',
      },
    })
  }

  // Login exitoso
  if (res.ok) {
    const isAdmin = data.rol === 'admin'

    return new Response(null, {
      status: 302,
      headers: {
        'Set-Cookie': `access_token=${data.access_token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`,
        Location: isAdmin ? '/admin/panel' : '/perfil',
      },
    })
  }

  // Error de login: pasar mensaje a la URL
  const params = new URLSearchParams({
    error: encodeURIComponent(data.error || 'Error desconocido'),
  })

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/login?${params.toString()}`,
    },
  })
}
