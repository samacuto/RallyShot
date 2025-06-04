import type { APIRoute } from 'astro'

export const POST: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': `access_token=; Path=/; Max-Age=0`,
      Location: '/',
    },
  })
}
