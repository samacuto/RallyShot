import Concurso from '../models/Concurso.js'

class ConcursoController {
  static async create(req, res) {
    try {
      const nuevoId = await Concurso.create(req.body, req.user.id)
      res.status(201).json({
        message: 'Concurso creado correctamente',
        id: nuevoId,
      })
    } catch (error) {
      console.error('Error creando concurso:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async join(req, res) {
    try {
      const concursoId = req.params.id
      await Concurso.join(req.user.id, concursoId)
      res.status(201).json({
        message: 'Te has unido al concurso correctamente',
      })
    } catch (error) {
      console.error('Error al unirse al concurso:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async uploadPhoto(req, res) {
    try {
      const concursoId = req.params.id
      const { titulo, descripcion } = req.body

      await Concurso.uploadPhoto({
        usuarioId: req.user.id,
        concursoId,
        titulo,
        descripcion,
        archivo: req.file,
      })

      res.status(201).json({
        message: 'Foto subida correctamente y está pendiente de revisión',
      })
    } catch (error) {
      console.error('Error subiendo foto:', error)
      res.status(400).json({ error: error.message })
    }
  }
}

export default ConcursoController
