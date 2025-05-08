import supabase from '../supabase/client.js'
import adminClient from '../supabase/adminClient.js'
import adminStorageClient from '../supabase/adminStorageClient.js'
import crypto from 'crypto'

class Auth {
  static async register({
    email,
    password,
    nombre,
    apellidos,
    fecha_nacimiento,
    pais,
    foto_perfil,
    rol,
    display_name,
  }) {
    // Comprobamos si display_name ya existe
    const { data: existing } = await adminClient
      .from('usuarios')
      .select('id')
      .eq('display_name', display_name)
      .single()

    if (existing) throw new Error('El nombre de usuario ya está en uso')

    // Registro en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw new Error(authError.message)

    const userId = authData.user.id

    // Guardar display_name en Auth
    const { error: metadataError } =
      await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: {
          display_name,
        },
      })

    if (metadataError) {
      console.error('Error actualizando user_metadata:', metadataError)
      throw new Error('No se pudo guardar el nombre de usuario en el perfil')
    }

    // Subida de imagen a Storage (si hay foto)
    let fotoPerfilURL = null

    if (foto_perfil?.buffer && foto_perfil?.mimetype) {
      const buffer = foto_perfil.buffer
      const mimetype = foto_perfil.mimetype

      const { error: uploadError } = await adminStorageClient.storage
        .from('perfiles')
        .upload(`fotos/${userId}.jpg`, buffer, {
          contentType: mimetype,
          upsert: true,
        })

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError)
        throw new Error('Error al subir la foto de perfil.')
      }

      const { data: urlData } = supabase.storage
        .from('perfiles')
        .getPublicUrl(`fotos/${userId}.jpg`)

      fotoPerfilURL = urlData.publicUrl
    }

    // Generamos código de verificación para confirmar el registro
    const codigo_verificacion = crypto.randomBytes(3).toString('hex')

    // Insertar datos en tabla usuarios
    const { error: insertError } = await adminClient.from('usuarios').insert([
      {
        id: userId,
        nombre,
        apellidos,
        fecha_nacimiento,
        pais,
        foto_perfil: fotoPerfilURL,
        rol,
        verificado: false,
        codigo_verificacion,
        display_name,
      },
    ])

    if (insertError) throw new Error(insertError.message)

    return {
      message: 'Usuario registrado. Usa el código para confirmar la cuenta.',
      userId,
      codigo_verificacion,
      display_name,
    }
  }

  static async login(emailOrUsername, password) {
    let email = emailOrUsername

    // Si el texto no parece un email, buscarlo por display_name
    if (!emailOrUsername.includes('@')) {
      const { data: userRow, error } = await adminClient
        .from('usuarios')
        .select('id')
        .eq('display_name', emailOrUsername)
        .single()

      if (error || !userRow) {
        throw new Error('Nombre de usuario no encontrado')
      }

      // Buscar email asociado al id en Auth
      const { data: userData, error: userError } =
        await adminClient.auth.admin.getUserById(userRow.id)
      if (userError || !userData?.user?.email) {
        throw new Error('No se pudo recuperar el email del usuario')
      }

      email = userData.user.email
    }

    // Login con email real
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error('Email o contraseña incorrectos')

    const { user, session } = data
    if (!user || !session) throw new Error('Email o contraseña incorrectos')

    const { data: userDb, error: dbError } = await adminClient
      .from('usuarios')
      .select('rol, verificado')
      .eq('id', user.id)
      .single()

    if (dbError || !userDb)
      throw new Error('Usuario no encontrado en base de datos')
    if (!userDb.verificado)
      throw new Error('La cuenta no ha sido verificada con el código')

    return {
      message: 'Inicio de sesión exitoso',
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user_id: user.id,
      rol: userDb.rol,
    }
  }

  static async confirmarCuenta(userId, codigo) {
    const { data: user, error } = await adminClient
      .from('usuarios')
      .select('codigo_verificacion, verificado')
      .eq('id', userId)
      .single()

    if (error || !user) throw new Error('Usuario no encontrado')
    if (user.verificado) throw new Error('Cuenta ya verificada')
    if (user.codigo_verificacion !== codigo)
      throw new Error('Código incorrecto')

    const { error: updateError } = await adminClient
      .from('usuarios')
      .update({ verificado: true, codigo_verificacion: null })
      .eq('id', userId)

    if (updateError) throw new Error('Error al verificar la cuenta')

    return { message: 'Cuenta verificada correctamente' }
  }

  static async delete(userId) {
    // Eliminar de Supabase Auth
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) throw new Error('No se puedo eliminar el usuario de Auth')

    // Eliminar de la tabla usuarios
    const { error: dbError } = await adminClient
      .from('usuarios')
      .delete()
      .eq('id', userId)

    if (dbError)
      throw new Error('No se pudo eliminar el usuario en la base de datos')

    return { message: 'Usuario eliminado correctamente' }
  }
}

export default Auth
