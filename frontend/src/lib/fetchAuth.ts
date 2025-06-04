export async function loginUser({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string
  password: string
}) {
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL

  const res = await fetch(`${backendURL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername, password }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || 'Error al iniciar sesión')
  }

  return result
}

interface UpdateUserData {
  nombre?: string
  apellidos?: string
  pais?: string
  fecha_nacimiento?: string
  display_name?: string
  email?: string
  foto_perfil?: File
}

export async function updateUser(data: UpdateUserData) {
  const backendURL = import.meta.env.PUBLIC_BACKEND_BASE_URL
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1]

  if (!token) {
    throw new Error('No hay sesión activa')
  }

  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value)
    }
  })

  const res = await fetch(`${backendURL}/api/auth/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || 'Error al actualizar el perfil')
  }

  return result
}
