import adminClient from '../supabase/adminClient.js'

export async function requireAdmin(req, res, next) {
  try {
    const userId = req.user?.id

    if (!userId) return res.status(401).json({ error: 'No autenticado' })

    const { data: user, error } = await adminClient
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return res.status(403).json({ error: 'Usuario no encontrado' })
    }

    if (user.rol !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Acceso denegado: se requiere rol de administrador' })
    }

    next()
  } catch (err) {
    console.error('requireAdmin error:', err.message)
    return res
      .status(500)
      .json({ error: 'Error al verificar rol de administrador' })
  }
}
