// src/pages/api/concursos/[contestId]/fotos.ts
import type { APIRoute } from 'astro'
import cookie from 'cookie'

export const POST: APIRoute = async ({ request, params, locals }) => {
  // 1) Verificamos que el middleware global haya llenado locals.user
  if (!locals.user) {
    console.log('[fotos.ts] ❌ No autenticado (locals.user missing)')
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 2) Obtenemos el contestId y la URL base del backend real
  const contestId = params.contestId as string
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL as string
  console.log(
    '[fotos.ts] ✅ Autenticado. contestId:',
    contestId,
    'backendURL:',
    backendURL
  )

  // 3) Extraemos las cookies del request (para recuperar el JWT)
  const rawCookies = request.headers.get('cookie') || ''
  const token =
    rawCookies
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1] || ''

  if (!token) {
    console.log('[fotos.ts] ❌ No autenticado (token missing in cookie)')
    return new Response(
      JSON.stringify({ error: 'No token provided in cookie' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  console.log('[fotos.ts] ✅ Token encontrado en cookie')

  // 4) Construimos y reenviamos la petición al backend real
  try {
    // Lee el cuerpo de la solicitud entrante como FormData
    const incomingFormData = await request.formData()
    console.log(
      '[fotos.ts] FormData recibido:',
      Object.fromEntries(incomingFormData.entries())
    )

    // Crea un nuevo FormData para la solicitud saliente al backend
    const outgoingFormData = new FormData()

    // Añade los campos necesarios al nuevo FormData. Asegúrate de incluir la 'foto'.
    // Asumiendo que los campos son 'titulo', 'descripcion' y 'foto'
    outgoingFormData.append('titulo', incomingFormData.get('titulo') || '')
    outgoingFormData.append(
      'descripcion',
      incomingFormData.get('descripcion') || ''
    )

    const fotoFile = incomingFormData.get('foto')
    if (fotoFile instanceof File) {
      outgoingFormData.append('foto', fotoFile, fotoFile.name)
      console.log(
        '[fotos.ts] Archivo foto encontrado y añadido al outgoing FormData:',
        fotoFile.name,
        fotoFile.size,
        'bytes'
      )
    } else {
      console.log(
        '[fotos.ts] ❌ No se encontró archivo de foto en incoming FormData o no es un File.'
      )
      // Opcional: devolver un error si la foto es requerida
      return new Response(
        JSON.stringify({ error: 'Archivo de foto requerido' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const backendUrl = `${backendURL}/api/concursos/${contestId}/fotos`
    console.log('[fotos.ts] Reenviando a backend con FormData:', backendUrl)

    // Reenviamos la petición POST a /api/concursos/:id/fotos del backend real
    const resp = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // NO establecer Content-Type aquí. Fetch lo hará automáticamente y correctamente para FormData.
      },
      // Usa el nuevo FormData como cuerpo de la petición
      body: outgoingFormData,
    })

    console.log('[fotos.ts] Backend response status:', resp.status)

    // 5) Si el backend real devolvió 401, lo reenviamos
    if (resp.status === 401) {
      console.log('[fotos.ts] ❌ Backend devolvió 401')
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Si el backend devuelve un error que no es 401 pero es un código de error (>= 400)
    if (!resp.ok) {
      const errorData = await resp.json()
      console.error(
        '[fotos.ts] ❌ Backend error response:',
        resp.status,
        errorData
      )
      return new Response(JSON.stringify(errorData), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 6) Leemos la respuesta exitosa del backend y se la devolvemos al cliente
    const data = await resp.json()
    console.log('[fotos.ts] ✅ Backend success data:', data)
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API Astro] ❌ Error in proxy /fotos:', err)
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor al procesar solicitud',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
