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

  static async getRankingGlobal(limit = 10) {
    // 1) Traer todas las fotografías admitidas con sólo los campos que interesan
    const { data: fotosRaw, error: fotosError } = await adminClient
      .from('fotografias')
      .select(
        `
      id,
      titulo,
      url_imagen,
      descripcion,
      concurso:concurso_id ( nombre ),
      autor:usuario_id ( nombre )
    `
      )
      .eq('estado', 'admitida')

    if (fotosError) {
      throw new Error('Error al obtener ranking global')
    }

    // 2) Traer todos los votos (solo necesitamos el campo fotografia_id)
    const { data: votosData, error: votosError } = await adminClient
      .from('votos')
      .select('fotografia_id')

    if (votosError) {
      console.error('[getRankingGlobal] Supabase votos error:', votosError)
      throw new Error('Error al contar votos')
    }

    // 3) Hacer conteo de votos por fotografía (sin anotación de tipo)
    const conteoVotos = votosData.reduce((acc, voto) => {
      const fotoId = voto.fotografia_id
      acc[fotoId] = (acc[fotoId] || 0) + 1
      return acc
    }, {})

    // 4) Enriquecer cada foto con su número de votos y ordenar
    const ordenadas = fotosRaw
      .map((foto) => ({
        titulo: foto.titulo,
        url_imagen: foto.url_imagen,
        descripcion: foto.descripcion,
        nombre_concurso: foto.concurso.nombre,
        nombre_autor: foto.autor.nombre,
        total_votos: conteoVotos[foto.id] || 0,
      }))
      .sort((a, b) => b.total_votos - a.total_votos)

    // 5) Devolver solo los primeros “limit”
    return ordenadas.slice(0, limit)
  }

  static async getPendingByContest(concursoId) {
    const { data, error } = await adminClient
      .from('fotografias')
      .select('*')
      .eq('estado', 'pendiente')
      .eq('concurso_id', concursoId)

    if (error) {
      console.error('[getPendingByContest] Supabase error:', error)
      throw new Error(
        'No se pudieron obtener las fotos pendientes del concurso'
      )
    }

    return data
  }
}

export default Fotografia
