export const PUBLIC_PATHS = ['/login', '/register', '/api'] as const

export const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path))
}
