import Concurso from '../models/Concurso.js'
import Fotografia from '../models/Fotografia.js'
import { ParticipanteConcurso } from '../models/ParticipanteConcurso.js'
import adminClient from '../supabase/adminClient.js'

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
      console.log('Concurso recibido en req.body:', req.body)
      console.log('ID del creador (req.user.id):', req.user?.id)

      const nuevoId = await Concurso.create(req.body, req.user.id)

      console.log('Concurso creado con ID:', nuevoId)

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
      const usuarioId = req.user.id
      await ParticipanteConcurso.join(usuarioId, concursoId)
      res.status(201).json({
        message: 'Te has unido al concurso correctamente',
      })
    } catch (error) {
      console.error('Error al unirse al concurso:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async isJoined(req, res) {
    try {
      const concursoId = req.params.id
      const usuarioId = req.user.id
      const joined = await ParticipanteConcurso.isJoined(usuarioId, concursoId)
      return res.status(200).json({ joined })
    } catch (err) {
      console.error('Error comprobando si el usuario ya está unido:', err)
      return res.status(500).json({ error: 'Error interno' })
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
        message: 'Foto subida correctamente y está pendiente de revisión.',
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

  static async delete(req, res) {
    try {
      const { id } = req.params

      console.log('ID recibido:', id)
      await Concurso.delete(id)

      res.status(204).end()
    } catch (error) {
      console.error('Error al eliminar concurso:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params
      await Concurso.update(id, req.body)
      res.status(200).json({ message: 'Concurso actualizado correctamente' })
    } catch (error) {
      console.error('Error al modificar concurso:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params
      const concurso = await Concurso.getById(id)
      res.status(200).json(concurso)
    } catch (error) {
      console.error('Error al obtener concurso:', error)
      res.status(404).json({ error: error.message })
    }
  }
}

export default ConcursoController
