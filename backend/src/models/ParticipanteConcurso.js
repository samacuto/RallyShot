import adminClient from '../supabase/adminClient.js'

export class ParticipanteConcurso {
  /**
   * Comprueba si un usuario ya está unido a un concurso.
   * @param {string} usuarioId – UUID del usuario.
   * @param {string} concursoId – UUID del concurso.
   * @returns {Promise<boolean>} – `true` si ya existe, `false` si no.
   * @throws Error en caso de cualquier error de Supabase.
   */
  static async isJoined(usuarioId, concursoId) {
    // Ejemplo tomando como referencia tu tabla "participantes_concursos"
    // y devolviendo true si existe una fila, false en caso contrario.
    const { data: fila, error } = await adminClient
      .from('participantes_concurso')
      .select('usuario_id')
      .eq('usuario_id', usuarioId)
      .eq('concurso_id', concursoId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 ocurre cuando no hay fila y usas `single()`,
      // pero no es un “error serio”: significa “no existe fila”
      throw new Error(error.message)
    }
    // Si “fila” es null => no existe, devolvemos false.
    // Si “fila” tiene algo, devolvemos true.
    return !!fila
  }

  /**
   * Inserta un nuevo participante en el concurso.
   * Lanza error si ya existe (para que el controlador lo capture).
   */
  static async join(usuarioId, concursoId) {
    // Verificamos primero si ya existe:
    const already = await this.isJoined(usuarioId, concursoId)
    if (already) {
      throw new Error('Ya estás unido a este concurso')
    }

    const { error } = await adminClient
      .from('participantes_concurso')
      .insert([{ usuario_id: usuarioId, concurso_id: concursoId }])

    if (error) throw new Error(error.message)
  }
}
