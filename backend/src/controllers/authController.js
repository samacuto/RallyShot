import Auth from '../models/Auth.js'
import { sendRequestChangePassword } from '../services/emailService.js'
import { sendVerificationCode } from '../services/emailService.js'
import adminClient from '../supabase/adminClient.js'

class AuthController {
  static async register(req, res) {
    try {
      const data = {
        ...req.validatedData,
        foto_perfil: req.file || null,
      }
      const result = await Auth.register(data)

      // Obtener email real desde Supabase Auth
      const { data: authUser, error: authError } =
        await adminClient.auth.admin.getUserById(result.userId)

      if (authError || !authUser?.user?.email) {
        throw new Error('No se pudo recuperar el email del usuario')
      }

      // Enviar correo con el código de verificación
      await sendVerificationCode(
        authUser.user.email,
        result.codigo_verificacion
      )

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

  static async requestPasswordChange(userId) {
    const codigo = crypto.randomBytes(3).toString('hex')

    const { error: updateError } = await adminClient
      .from('usuarios')
      .update({ codigo_cambio_password: codigo })
      .eq('id', userId)

    if (updateError)
      throw new Error('Error al iniciar el proceso de cambio de contraseña')

    // Obtener el email del usuario
    const { data: authUser, error: authError } =
      await adminClient.auth.admin.getUserById(userId)
    if (authError || !authUser?.user?.email) {
      throw new Error('No se pudo recuperar el email del usuario')
    }

    // Enviar email
    await sendRequestChangePassword(authUser.user.email, codigo)

    return {
      message:
        'Se ha enviado un email con el código para cambiar la contraseña',
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

  static async forgottenPassword(req, res) {
    try {
      const { emailOrUsername } = req.body

      // Buscar usuario por email o display_name
      let userId = null
      let email = null

      if (emailOrUsername.includes('@')) {
        // Buscar por email
        const { data: authList, error: listError } =
          await adminClient.auth.admin.listUsers()

        if (listError) throw new Error('Error buscando usuarios')

        const userMatch = authList.users.find(
          (u) => u.email === emailOrUsername
        )
        if (!userMatch) throw new Error('No se encontró el usuario')
        userId = userMatch.id
        email = userMatch.email
      } else {
        // Buscar por display_name
        const { data: userRow, error } = await adminClient
          .from('usuarios')
          .select('id')
          .eq('display_name', emailOrUsername)
          .single()

        if (error || !userRow) throw new Error('Usuario no encontrado')

        const { data: userData, error: authError } =
          await adminClient.auth.admin.getUserById(userRow.id)
        if (authError || !userData?.user?.email) {
          throw new Error('No se pudo recuperar el email del usuario')
        }

        userId = userRow.id
        email = userData.user.email
      }

      // Generar código y enviar correo
      const result = await Auth.requestPasswordChange(userId)

      // Enviar correo manualmente (ya que no tienes token)
      await sendRequestChangePassword(email, result.codigo)

      res.status(200).json({
        message:
          'Se ha enviado un email con el código para cambiar la contraseña',
        userId,
        codigo: result.codigo,
      })
    } catch (error) {
      console.error('Error en olvide-password:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const result = await Auth.getCurrentUser(req.user.id)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error al obtener el usuario:', error)
      res.status(404).json({ error: error.message })
    }
  }

  static async getAll(req, res) {
    try {
      const usuarios = await Auth.getAll()
      res.status(200).json(usuarios)
    } catch (error) {
      console.error('Error en getAll:', error)
      res.status(500).json({ error: error.message })
    }
  }

  static async updateById(req, res) {
    try {
      const userId = req.params.id
      const data = {
        ...req.validatedData,
        foto_perfil: req.file || null,
      }
      const result = await Auth.updateById(userId, data)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error en updateById:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async deleteById(req, res) {
    try {
      const userId = req.params.id
      const result = await Auth.deleteById(userId)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error en deleteById:', error)
      res.status(400).json({ error: error.message })
    }
  }

  static async getById(req, res) {
    try {
      const userId = req.params.id
      const result = await Auth.getById(userId)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error en getById:', error)
      res.status(404).json({ error: error.message })
    }
  }
}

export default AuthController
