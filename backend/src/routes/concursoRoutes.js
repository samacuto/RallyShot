import express from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireAdmin } from '../middlewares/requireAdmin.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import upload from '../middlewares/upload.js'
import ConcursoController from '../controllers/ConcursoController.js'
import { validate } from '../middlewares/validate.js'
import {
  concursoSchema,
  concursoUpdateSchema,
} from '../schemas/concursoSchema.js'

const router = express.Router()

router.get('/', ConcursoController.getAll)

router.get('/:id', ConcursoController.getById)

router.post(
  '/',
  verifyToken,
  requireAuth,
  requireAdmin,
  validate(concursoSchema),
  ConcursoController.create
)

router.post('/:id/join', verifyToken, requireAuth, ConcursoController.join)

router.get('/:id/joined', verifyToken, requireAuth, ConcursoController.isJoined)

router.post(
  '/:id/fotos',
  verifyToken,
  requireAuth,
  upload.single('foto'),
  ConcursoController.uploadPhoto
)

router.get('/:id/photos', ConcursoController.getPhotosByContest)

// Actualizar concurso (admin)
router.patch(
  '/:id',
  verifyToken,
  requireAuth,
  requireAdmin,
  validate(concursoUpdateSchema),
  ConcursoController.update
)

// Eliminar concurso (admin)
router.delete(
  '/:id',
  verifyToken,
  requireAuth,
  requireAdmin,
  ConcursoController.delete
)

export default router
