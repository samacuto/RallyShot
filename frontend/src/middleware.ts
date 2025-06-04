import type { MiddlewareHandler } from 'astro'
import cookie from 'cookie'

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/verificar',
  '/olvide-contrasena',
  '/cambiar-contrasena',
  '/concursos',
]

export const onRequest: MiddlewareHandler = async (
  { request, url, locals },
  next
) => {
  console.log('Middleware de Astro ejecutado para:', url.pathname)

  const cookies = cookie.parse(request.headers.get('cookie') ?? '')
  const token = cookies.access_token

  const isApiRoute = url.pathname.startsWith('/api/')
  const isPublic =
    url.pathname === '/' ||
    isApiRoute ||
    PUBLIC_PATHS.some((path) => url.pathname.startsWith(path)) ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname === '/404'

  if (token) {
    const apiUrl = import.meta.env.PUBLIC_BACKEND_BASE_URL
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      const user = await res.json()
      locals.user = user
      console.log('Usuario autenticado:', JSON.stringify(user, null, 2))
    } else {
      console.warn('Token inválido')
    }
  }

  if (isPublic) {
    return next()
  }

  if (!token || !locals.user) {
    const response = await next()

    if (response.status < 400) {
      console.warn('Sin token válido. Redirigiendo a /login...')
      return new Response(null, {
        status: 302,
        headers: { Location: '/login' },
      })
    }

    return response
  }

  if (url.pathname.startsWith('/admin') && locals.user.rol !== 'admin') {
    console.warn('Acceso bloqueado: no es admin. Redirigiendo a /perfil...')
    return new Response(null, {
      status: 302,
      headers: { Location: '/perfil' },
    })
  }

  return next()
}
