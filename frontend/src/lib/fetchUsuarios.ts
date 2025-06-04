import type { Usuario } from './types/types'

export async function fetchUsuarios(cookies?: string): Promise<Usuario[]> {
  const isServer = typeof window === 'undefined'
  const url = isServer
    ? `${import.meta.env.PUBLIC_SITE_ORIGIN}/api/usuarios`
    : '/api/usuarios'

  const headers: HeadersInit = {}
  if (cookies) headers['cookie'] = cookies

  const res = await fetch(url, { headers })

  if (!res.ok) throw new Error('No se pudieron obtener los usuarios')

  return res.json()
}
