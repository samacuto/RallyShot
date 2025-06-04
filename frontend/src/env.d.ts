/// <reference types="astro/client" />

interface User {
  id: string
  nombre: string
  apellidos: string
  rol: 'admin' | 'participante'
  foto_perfil: string | null
  email: string
  display_name: string | null
}

declare namespace App {
  interface Locals {
    user: User
  }
}
