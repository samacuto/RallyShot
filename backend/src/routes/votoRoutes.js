import express from 'express'
import VotoController from '../controllers/VotoController.js'

const router = express.Router()

// Ruta pública para votar por una fotografía
router.post('/', VotoController.vote)

export default router
