import supabase from '../supabase/client.js'

class Fotografia {
  static async obtenerAdmitidas() {
    const { data, error } = await supabase
      .from('fotografias')
      .select('*')
      .eq('estado', 'admitida')

    if (error) throw error
    return data
  }

  static async subir(data) {
    const { data: nuevaFoto, error } = await supabase
      .from('fotografias')
      .insert([data])
      .select()

    if (error) throw error
    return nuevaFoto
  }
}

export default Fotografia
