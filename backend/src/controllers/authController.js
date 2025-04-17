import Auth from '../models/Auth.js'

class AuthController {
  static async register(req, res) {
    try {
      const data = {
        ...req.validatedData,
        foto_perfil: req.file || null,
      }
      const result = await Auth.register(data)
      res.status(201).json(result)
    } catch (error) {
      console.error('Error en register:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.validatedData
      const result = await Auth.login(email, password)
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ error: 'Error al iniciar sesión.' })
    }
  }
}

export default AuthController
