import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get('access_token')?.value
  if (!token) return redirect('/login')

  const form = await request.formData()
  const id = form.get('id')
  const data = Object.fromEntries(form.entries())
  delete data.id

  const res = await fetch(
    `${import.meta.env.PUBLIC_BACKEND_BASE_URL}/api/concursos/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (res.ok) {
    return redirect('/admin/panel')
  }

  const error = await res.json()
  return redirect(
    `/admin/modificar-concurso/${id}?error=${encodeURIComponent(
      error.error || 'Error desconocido'
    )}`
  )
}
