import supabase from '../supabase/client.js'
import adminClient from '../supabase/adminClient.js'
import adminStorageClient from '../supabase/adminStorageClient.js'

class Fotografia {
  static async getGallery({ page, limit, sortBy, order }) {
    const offset = (page - 1) * limit

    const { data, error } = await supabase
      .from('fotografias')
      .select('*')
      .eq('estado', 'admitida')
      .order(sortBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) throw new Error('Error al consultar la galería')
    return data
  }

  static async getGalleryByContest({ contestId, page, limit, sortBy, order }) {
    const offset = (page - 1) * limit

    const { data, error } = await supabase
      .from('fotografias')
      .select('*')
      .eq('estado', 'admitida')
      .eq('concurso_id', contestId)
      .order(sortBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) throw new Error('Error al consultar la galería del concurso')
    return data
  }

  static async obtenerAdmitidas() {
    const { data, error } = await supabase
      .from('fotografias')
      .select('*')
      .eq('estado', 'admitida')

    if (error) throw error
    return data
  }

  static async updateStatus(fotoId, estado) {
    const { error } = await adminClient
      .from('fotografias')
      .update({ estado })
      .eq('id', fotoId)

    if (error) throw new Error('No se pudo actualizar el estado de la foto')
  }

  static async getPending() {
    const { data, error } = await adminClient
      .from('fotografias')
      .select('*')
      .eq('estado', 'pendiente')

    if (error) throw new Error('Error al consultar las fotos pendientes')
    return data
  }

  static async getRanking({ contestId }) {
    const { data, error } = await adminClient.rpc(
      'ranking_fotos_por_concurso', // función de supabase
      {
        input_concurso_id: contestId,
      }
    )

    if (error) throw new Error('Error al obtener el ranking')
    return data
  }

  // Eliminar una foto pendiente
  static async delete(photoId, userId) {
    const { data: photo, error } = await adminClient
      .from('fotografias')
      .select('*')
      .eq('id', photoId)
      .eq('usuario_id', userId)
      .eq('estado', 'pendiente')
      .single()

    if (error || !photo) {
      throw new Error('No se puede eliminar esta fotografía')
    }

    // Eliminar del bucket si existe
    const imagePath = photo.url_imagen.split('/').pop()

    await adminStorageClient.storage.from('fotos').remove([imagePath])

    const { error: deleteError } = await adminClient
      .from('fotografias')
      .delete()
      .eq('id', photoId)

    if (deleteError) {
      throw new Error('Error al eliminar la fotografía')
    }
  }

  static async getByContest(contestId) {
    const { data, error } = await adminClient
      .from('fotografias')
      .select(
        `
        id,
        titulo,
        descripcion,
        url_imagen,
        fecha_subida,
        concurso_id,
        usuarios(display_name),
        votos (
          id
        )
      `
      )
      .eq('estado', 'admitida')
      .eq('concurso_id', contestId)
      .order('fecha_subida', { ascending: false })

    if (error) throw new Error('Error al consultar las fotos del concurso')

    // Añadir total de votos a cada foto
    return data.map((foto) => ({
      ...foto,
      total_votos: foto.votos?.length || 0,
      votos: undefined, // eliminamos el array de ids si no quieres exponerlo
    }))
  }
}

export default Fotografia
