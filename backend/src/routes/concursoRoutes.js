import express from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireAdmin } from '../middlewares/requireAdmin.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import upload from '../middlewares/upload.js'
import ConcursoController from '../controllers/ConcursoController.js'

const router = express.Router()

router.get('/', ConcursoController.getAll)

// Crear concurso (admin)
router.post(
  '/',
  verifyToken,
  requireAuth,
  requireAdmin,
  ConcursoController.create
)

// Unirse a un concurso
router.post('/:id/join', verifyToken, requireAuth, ConcursoController.join)

// Subir fotografía al concurso
router.post(
  '/:id/fotos',
  verifyToken,
  requireAuth,
  upload.single('foto'),
  ConcursoController.uploadPhoto
)

router.get('/:id/photos', ConcursoController.getPhotosByContest)

export default router
