import express from 'express'
import AuthController from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js'
import upload from '../middlewares/upload.js'
import { authRegisterSchema, authLoginSchema } from '../schemas/authSchema.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post(
  '/register',
  upload.single('foto_perfil'),
  validate(authRegisterSchema),
  AuthController.register
)
router.post('/login', validate(authLoginSchema), AuthController.login)
router.post('/confirmar-cuenta', AuthController.confirmarCuenta)
router.delete('/me', verifyToken, requireAuth, AuthController.delete)

export default router
