import type { Usuario } from './types/types'

export async function fetchUsuarioId(
  id: string,
  cookies?: string
): Promise<Usuario | null> {
  const isServer = typeof window === 'undefined'
  const url = isServer
    ? `${import.meta.env.PUBLIC_SITE_ORIGIN}/api/usuarios/${id}`
    : `/api/usuarios/${id}`

  const headers: HeadersInit = {}
  if (cookies) headers['cookie'] = cookies

  const res = await fetch(url, { headers })

  if (!res.ok) return null

  return res.json()
}
