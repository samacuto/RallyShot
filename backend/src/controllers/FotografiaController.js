import Fotografia from '../models/Fotografia.js'
import Voto from '../models/Voto.js'

class FotografiaController {
  static async getGallery(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'fecha_subida',
        order = 'desc',
      } = req.query

      const fotos = await Fotografia.getGallery({
        page: Number(page),
        limit: Number(limit),
        sortBy,
        order,
      })

      res.status(200).json(fotos)
    } catch (error) {
      console.error('Error al obtener galería:', error)
      res
        .status(500)
        .json({ error: 'No se pudieron obtener las fotografías admitidas' })
    }
  }

  static async getGalleryByContest(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'fecha_subida',
        order = 'desc',
      } = req.query
      const contestId = req.params.contestId

      const photos = await Fotografia.getGalleryByContest({
        contestId,
        page: Number(page),
        limit: Number(limit),
        sortBy,
        order,
      })

      res.status(200).json(photos)
    } catch (error) {
      console.error('Error al obtener galería por concurso:', error)
      res.status(500).json({
        error: 'No se pudieron obtener las fotografías de este concurso',
      })
    }
  }

  static async updateStatus(req, res) {
    try {
      const fotoId = req.params.id
      const { estado } = req.body

      if (!['admitida', 'rechazada'].includes(estado)) {
        return res
          .status(400)
          .json({ error: 'Estado no válido (solo "admitida" o "rechazada")' })
      }

      await Fotografia.updateStatus(fotoId, estado)
      res.json({ message: `Fotografía marcada como ${estado}` })
    } catch (error) {
      console.error('Error actualizando estado de foto:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async getPending(req, res) {
    try {
      const photos = await Fotografia.getPending()
      res.status(200).json(photos)
    } catch (error) {
      console.error('Error al obtener fotos pendientes:', error)
      res
        .status(500)
        .json({ error: 'No se pudieron obtener las fotos pendientes' })
    }
  }

  static async getVoteCount(req, res) {
    try {
      const photoId = req.params.id

      const total = await Voto.countVotes(photoId)

      res.status(200).json({ photoId, total })
    } catch (error) {
      console.error('Error al contar votos:', error)
      res.status(400).json({ error: 'No se pudieron contar los votos' })
    }
  }

  static async getRanking(req, res) {
    try {
      const { contestId } = req.query

      const photos = await Fotografia.getRanking({ contestId })

      res.status(200).json(photos)
    } catch (error) {
      console.error('Error al obtener ranking:', error)
      res.status(500).json({ error: 'No se pudo obtener el ranking de fotos' })
    }
  }

  static async delete(req, res) {
    try {
      const photoId = req.params.id
      const userId = req.user.id

      await Fotografia.delete(photoId, userId)

      res.json({ message: 'Fotografía eliminada correctamente' })
    } catch (error) {
      console.error('Error al eliminar la foto:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async getRankingGlobal(req, res) {
    try {
      // Leer límite de query string, por defecto 10
      const limit = Number(req.query.limit) || 10

      const fotos = await Fotografia.getRankingGlobal(limit)
      res.status(200).json(fotos)
    } catch (error) {
      console.error('Error al obtener ranking global:', error)
      res.status(500).json({ error: 'No se pudo obtener el ranking global' })
    }
  }

  static async getPendingByContest(req, res) {
    try {
      const contestId = req.params.contestId
      console.log('🔍 Obteniendo fotos pendientes para concurso:', contestId)

      const photos = await Fotografia.getPendingByContest(contestId)
      res.status(200).json(photos)
    } catch (error) {
      console.error('❌ Error getPendingByContest:', error)
      res.status(500).json({ error: error.message })
    }
  }
}

export default FotografiaController
