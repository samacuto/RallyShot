import jwt from 'jsonwebtoken'

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET)
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    }
    next()
  } catch (err) {
    console.error('Error verifyToken:', err.message)
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
