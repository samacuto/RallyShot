import supabase from '../supabase/client.js'
import adminClient from '../supabase/adminClient.js'
import adminStorageClient from '../supabase/adminStorageClient.js'

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
  }) {
    // 1. Registro en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw new Error(authError.message)

    const userId = authData.user.id

    // 2. Subida de imagen a Storage (si hay foto)
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

    // 3. Insertar datos en tabla usuarios
    const { error: insertError } = await adminClient.from('usuarios').insert([
      {
        id: userId,
        nombre,
        apellidos,
        fecha_nacimiento,
        pais,
        foto_perfil: fotoPerfilURL,
        rol,
      },
    ])

    if (insertError) throw new Error(insertError.message)

    return { message: 'Usuario registrado correctamente', userId }
  }
}

export default Auth
