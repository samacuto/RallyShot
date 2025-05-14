import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireAdmin } from '../middlewares/requireAdmin.js'

const router = express.Router()

router.get('/panel', verifyToken, requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Bienvenido al panel de administración' })
})

export default router
