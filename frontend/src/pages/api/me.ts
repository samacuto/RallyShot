import type { APIRoute } from 'astro'
import cookie from 'cookie'

export const prerender = false

// GET: obtener datos del usuario
export const GET: APIRoute = async ({ request }) => {
  // Validar token desde la cookie manualmente
  const cookies = cookie.parse(request.headers.get('cookie') ?? '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Llamar a tu backend para obtener el usuario
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const user = await res.json()
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

// PATCH: actualizar perfil del usuario
export const PATCH: APIRoute = async ({ request }) => {
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: await request.formData(),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// DELETE: eliminar cuenta de usuario
export const DELETE: APIRoute = async ({ request }) => {
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    return new Response(JSON.stringify(error), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Eliminar cookie y redirigir
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': cookie.serialize('access_token', '', {
        path: '/',
        expires: new Date(0),
      }),
      Location: '/login?deleted=1',
    },
  })
}
