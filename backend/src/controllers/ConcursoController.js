import Concurso from '../models/Concurso.js'
import Fotografia from '../models/Fotografia.js'

class ConcursoController {
  static async getAll(req, res) {
    try {
      const contests = await Concurso.getAll()
      res.status(200).json(contests)
    } catch (error) {
      console.error('Error al obtener concursos:', error)
      res.status(500).json({ error: 'No se pudieron obtener los concursos' })
    }
  }

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

  static async getPhotosByContest(req, res) {
    try {
      const contestId = req.params.id

      const photos = await Fotografia.getByContest(contestId)

      res.status(200).json(photos)
    } catch (error) {
      console.error('Error al obtener fotos del concurso:', error)
      res.status(500).json({ error: 'No se pudieron obtener las fotografías' })
    }
  }
}

export default ConcursoController
