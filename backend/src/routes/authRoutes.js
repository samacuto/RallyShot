import express from 'express'
import AuthController from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js'
import upload from '../middlewares/upload.js'
import {
  authRegisterSchema,
  authLoginSchema,
  updateUserSchema,
  requestChangePasswordSchema,
  confirmChangePasswordSchema,
} from '../schemas/authSchema.js'
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
router.post('/confirmar-cuenta', AuthController.verifyAccount)
router.delete('/me', verifyToken, requireAuth, AuthController.delete)
router.patch(
  '/me',
  verifyToken,
  requireAuth,
  upload.single('foto_perfil'),
  validate(updateUserSchema),
  AuthController.update
)
router.post(
  '/request-cambio-password',
  verifyToken,
  requireAuth,
  validate(requestChangePasswordSchema),
  AuthController.requestPasswordChange
)

router.post(
  '/confirm-cambio-password',
  validate(confirmChangePasswordSchema),
  AuthController.confirmPasswordChange
)
export default router
