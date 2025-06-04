import { z } from 'zod'

const concursoBaseSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),
  fecha_fin_subida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fecha_inicio_votacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fecha_fin_votacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  max_fotos_participante: z
    .string()
    .regex(/^\d+$/, 'Debe ser un número entero')
    .transform(Number)
    .refine((val) => val > 0, 'Debe ser mayor que 0'),
})

export const concursoSchema = concursoBaseSchema
  .refine((data) => data.fecha_fin_subida >= data.fecha_inicio, {
    message: 'La fecha de fin de subida debe ser posterior al inicio',
    path: ['fecha_fin_subida'],
  })
  .refine((data) => data.fecha_inicio_votacion >= data.fecha_fin_subida, {
    message: 'El inicio de votación debe ser posterior a la subida',
    path: ['fecha_inicio_votacion'],
  })
  .refine((data) => data.fecha_fin_votacion >= data.fecha_inicio_votacion, {
    message: 'El fin de votación debe ser posterior al inicio de votación',
    path: ['fecha_fin_votacion'],
  })

export const concursoUpdateSchema = concursoBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.fecha_inicio && data.fecha_fin_subida) {
      if (data.fecha_fin_subida < data.fecha_inicio) {
        ctx.addIssue({
          path: ['fecha_fin_subida'],
          message: 'La fecha de fin de subida debe ser posterior al inicio',
        })
      }
    }

    if (data.fecha_fin_subida && data.fecha_inicio_votacion) {
      if (data.fecha_inicio_votacion < data.fecha_fin_subida) {
        ctx.addIssue({
          path: ['fecha_inicio_votacion'],
          message: 'El inicio de votación debe ser posterior a la subida',
        })
      }
    }

    if (data.fecha_inicio_votacion && data.fecha_fin_votacion) {
      if (data.fecha_fin_votacion < data.fecha_inicio_votacion) {
        ctx.addIssue({
          path: ['fecha_fin_votacion'],
          message:
            'El fin de votación debe ser posterior al inicio de votación',
        })
      }
    }

    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        message: 'Debes proporcionar al menos un campo para actualizar',
        path: [],
      })
    }
  })
