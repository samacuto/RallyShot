import type { APIRoute } from 'astro'
import cookie from 'cookie'

export const DELETE: APIRoute = async ({ request, params }) => {
  const id = params.id
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
    })
  }

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const id = params.id
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
    })
  }

  const formData = await request.formData()

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    return new Response(JSON.stringify(error), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return redirect('/admin/panel')
}

export const GET: APIRoute = async ({ request, params }) => {
  const id = params.id
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const token = cookies.access_token

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
    })
  }

  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const res = await fetch(`${backendURL}/api/auth/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
