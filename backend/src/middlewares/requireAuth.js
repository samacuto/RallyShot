export const requireAuth = (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'No autenticado' })
  }
  next()
}
