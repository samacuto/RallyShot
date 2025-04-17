import express from 'express'
import AuthController from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js'
import upload from '../middlewares/upload.js'
import { authRegisterSchema, authLoginSchema } from '../schemas/authSchema.js'

const router = express.Router()

router.post(
  '/register',
  upload.single('foto_perfil'),
  validate(authRegisterSchema),
  AuthController.register
)

router.post('/login', validate(authLoginSchema), AuthController.login)

export default router
