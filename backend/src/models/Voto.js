import adminClient from '../supabase/adminClient.js'

class Voto {
  static async registerVote({ photoId, ip }) {
    // Validar que la foto existe y está admitida
    const { data: photo, error: photoError } = await adminClient
      .from('fotografias')
      .select('id')
      .eq('id', photoId)
      .eq('estado', 'admitida')
      .single()

    if (photoError || !photo) {
      throw new Error('La fotografía no existe o no está admitida')
    }

    // Comprobar si ya votó desde esta IP
    const { data: existing } = await adminClient
      .from('votos')
      .select('id')
      .eq('fotografia_id', photoId)
      .eq('ip', ip)
      .maybeSingle()

    if (existing) {
      throw new Error('Ya has votado esta fotografía desde esta IP')
    }

    // Insertar el voto
    const { error: insertError } = await adminClient.from('votos').insert([
      {
        fotografia_id: photoId,
        ip,
        fecha_voto: new Date(),
      },
    ])

    if (insertError) {
      throw new Error('No se pudo registrar el voto')
    }
  }

  static async countVotes(photoId) {
    const { count, error } = await adminClient
      .from('votos')
      .select('*', { count: 'exact', head: true })
      .eq('fotografia_id', photoId)

    if (error) throw new Error('Error al contar los votos')
    return count
  }
}

export default Voto
