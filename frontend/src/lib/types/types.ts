export interface Foto {
  id: string
  url: string
  titulo: string
  autor: string
  votos: number
}

export type FotoPendiente = {
  id: string
  titulo: string
  descripcion: string
  url_imagen: string
  estado: string
  fecha_subida: string
  concurso_id: string
}

export interface Concurso {
  id: string
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_fin_subida: string
  fecha_inicio_votacion: string
  fecha_fin_votacion: string
  max_fotos_participante: number
  fotos: Foto[]
}

export interface Usuario {
  id: string
  nombre: string
  apellidos: string
  rol: string
  foto_perfil: string
  pais: string
  fecha_nacimiento: string
  email?: string
  display_name?: string
  es_admin?: boolean
}
