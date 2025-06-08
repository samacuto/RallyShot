import adminClient from '../supabase/adminClient.js'
import supabase from '../supabase/client.js'
import adminStorageClient from '../supabase/adminStorageClient.js'
import crypto from 'crypto'

class Concurso {
  static async getAll() {
    const { data, error } = await supabase
      .from('concursos')
      .select(
        `
      id,
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin_subida,
      fecha_inicio_votacion,
      fecha_fin_votacion,
      max_fotos_participante
    `
      )
      .order('fecha_inicio', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Error al consultar los concursos')
    }

    return data
  }

  static async create(data, creadoPor) {
    const { data: insertado, error } = await adminClient
      .from('concursos')
      .insert([{ ...data, creado_por: creadoPor }])
      .select('id')

    if (error) {
      console.error('Error desde Supabase:', error)
      throw new Error(error.message)
    }

    return insertado[0].id
  }

  static async join(usuarioId, concursoId) {
    const { data: yaExiste } = await adminClient
      .from('participantes_concurso')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('concurso_id', concursoId)
      .single()

    if (yaExiste) throw new Error('Ya estás unido a este concurso')

    const { error } = await adminClient
      .from('participantes_concurso')
      .insert([{ usuario_id: usuarioId, concurso_id: concursoId }])

    if (error) throw new Error(error.message)
  }

  static async uploadPhoto({
    usuarioId,
    concursoId,
    titulo,
    descripcion,
    archivo,
  }) {
    const { data: participacion } = await adminClient
      .from('participantes_concurso')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('concurso_id', concursoId)
      .single()

    if (!participacion) throw new Error('No estás inscrito en este concurso')

    const { count } = await adminClient
      .from('fotografias')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', usuarioId)
      .eq('concurso_id', concursoId)

    const { data: concurso } = await adminClient
      .from('concursos')
      .select('max_fotos_participante')
      .eq('id', concursoId)
      .single()

    if (count >= concurso.max_fotos_participante) {
      throw new Error('Has alcanzado el límite de fotos permitidas')
    }

    const extension = archivo.mimetype.split('/')[1] || 'jpg'
    const nombreArchivo = `${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await adminStorageClient.storage
      .from('fotos')
      .upload(nombreArchivo, archivo.buffer, {
        contentType: archivo.mimetype,
      })

    if (uploadError) throw new Error('Error subiendo la imagen')

    const { data: urlData } = supabase.storage
      .from('fotos')
      .getPublicUrl(nombreArchivo)

    const { error: insertError } = await adminClient
      .from('fotografias')
      .insert([
        {
          usuario_id: usuarioId,
          concurso_id: concursoId,
          titulo,
          descripcion,
          url_imagen: urlData.publicUrl,
          estado: 'pendiente',
          fecha_subida: new Date(),
        },
      ])

    if (insertError) throw new Error(insertError.message)
  }

  static async delete(id) {
    const { error } = await adminClient.from('concursos').delete().eq('id', id)

    if (error) {
      console.error('❌ Error al eliminar concurso:', error)
      throw new Error('No se pudo eliminar el concurso')
    }
  }

  static async update(id, data) {
    const { error } = await adminClient
      .from('concursos')
      .update(data)
      .eq('id', id)

    if (error) {
      console.error('❌ Error al modificar concurso:', error)
      throw new Error('No se pudo modificar el concurso')
    }
  }

  static async getById(id) {
    const { data, error } = await adminClient
      .from('concursos')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('❌ Error al obtener concurso:', error)
      throw new Error('Concurso no encontrado')
    }

    return data
  }
}

export default Concurso
