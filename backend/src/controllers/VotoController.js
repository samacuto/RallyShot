import Voto from '../models/Voto.js'

class VotoController {
  static async vote(req, res) {
    try {
      const { photoId } = req.body
      const ip = req.ip

      if (!photoId) {
        return res.status(400).json({ error: 'ID de fotografía requerido' })
      }

      await Voto.registerVote({ photoId, ip })

      res.status(201).json({ message: 'Voto registrado correctamente' })
    } catch (error) {
      console.error('Error al registrar el voto:', error)
      res.status(400).json({ error: error.message })
    }
  }
}

export default VotoController
