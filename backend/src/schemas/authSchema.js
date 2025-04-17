import { z } from 'zod'

export const authRegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Correo inválido' }),
  password: z
    .string()
    .min(6, { message: 'Debe tener al menos 6 caracteres' })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Debe incluir una mayúscula',
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: 'Debe incluir un carácter especial',
    }),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  pais: z.string().min(2, 'El país es obligatorio'),
  foto_perfil: z.string().optional(),
  rol: z.enum(['admin', 'participante']),
})

export const authLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Correo inválido' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' }),
})
