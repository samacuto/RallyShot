import Fotografia from '../models/Fotografia.js'

class FotografiaController {
  static async getGaleria(req, res) {
    try {
      const fotos = await Fotografia.obtenerAdmitidas()
      res.status(200).json(fotos)
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al obtener las fotografías admitidas.' })
    }
  }

  static async subirFoto(req, res) {
    try {
      const datos = req.body
      const nuevaFoto = await Fotografia.subir(datos)
      res.status(201).json(nuevaFoto)
    } catch (error) {
      res.status(400).json({ error: 'Error al subir la fotografía.' })
    }
  }
}

export default FotografiaController
