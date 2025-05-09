import express from 'express'
import FotografiaController from '../controllers/FotografiaController.js'

const router = express.Router()

router.get('/galeria', FotografiaController.getGaleria)
router.post('/subir', FotografiaController.upload)

export default router
