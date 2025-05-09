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
      const { emailOrUsername, password } = req.validatedData
      const result = await Auth.login(emailOrUsername, password)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error en login:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async verifyAccount(req, res) {
    try {
      const { userId, codigo } = req.body
      const result = await Auth.verifyAccount(userId, codigo)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error en confirmarCuenta', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.user.id
      const result = await Auth.delete(userId)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error en delete:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async update(req, res) {
    try {
      const userId = req.user.id
      const data = {
        ...req.validatedData,
        foto_perfil: req.file || null,
      }
      const result = await Auth.update(userId, data)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error al actualizar cuenta: ', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async requestPasswordChange(req, res) {
    try {
      const userId = req.user.id
      const result = await Auth.requestPasswordChange(userId)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error solicitando cambio de password: ', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async confirmPasswordChange(req, res) {
    try {
      const { userId, codigo, nueva_password } = req.validatedData
      const result = await Auth.confirmPasswordChange(
        userId,
        codigo,
        nueva_password
      )
      res.status(200).json(result)
    } catch (error) {
      console.error('Error confirmando cambio de password: ', error)
      res.status(400).json({ error: error.message })
    }
  }
}

export default AuthController
