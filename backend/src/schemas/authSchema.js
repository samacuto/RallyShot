import { z } from 'zod'

export const authRegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Correo inválido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'La contraseña debe incluir al menos una mayúscula',
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: 'La contraseña debe incluir al menos un carácter especial',
    }),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
    .refine(
      (fecha) => {
        const edad = new Date().getFullYear() - new Date(fecha).getFullYear()
        return edad >= 13
      },
      {
        message: 'Debes tener al menos 13 años',
      }
    ),
  pais: z.string().min(2, 'El país es obligatorio'),
  display_name: z.string().min(3, 'El nombre de usuario es obligatorio'),
  foto_perfil: z.string().optional(),
  rol: z.enum(['admin', 'participante']).optional().default('participante'),
})

export const authLoginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'El correo o nombre de usuario es obligatorio'),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' }),
})
