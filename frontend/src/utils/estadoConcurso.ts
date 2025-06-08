export function calcularEstadoConcurso(concurso: {
  fecha_inicio: string
  fecha_fin_subida: string
  fecha_inicio_votacion: string
  fecha_fin_votacion: string
}) {
  const ahora = new Date()
  const fechaInicio = new Date(concurso.fecha_inicio)
  const fechaFinSubida = new Date(concurso.fecha_fin_subida)
  const fechaInicioVotacion = new Date(concurso.fecha_inicio_votacion)
  const fechaFinVotacion = new Date(concurso.fecha_fin_votacion)

  if (ahora < fechaInicio) {
    return {
      estado: 'Próximo',
      badgeColor: 'bg-blue-600',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-100',
      labelFecha: 'Inicio del concurso',
      valorFecha: fechaInicio.toLocaleDateString(),
      mensaje:
        'El concurso aún no ha comenzado. ¡Permanece atento a la fecha de inicio!',
    }
  } else if (ahora >= fechaInicio && ahora <= fechaFinSubida) {
    return {
      estado: 'En periodo de publicación',
      badgeColor: 'bg-green-800',
      borderColor: 'border-green-500',
      textColor: 'text-green-100',
      labelFecha: 'Fin del periodo de publicación',
      valorFecha: fechaFinSubida.toLocaleDateString(),
      mensaje:
        '¡Participa! Puedes subir tus fotografías hasta la fecha límite.',
    }
  } else if (ahora > fechaFinSubida && ahora < fechaInicioVotacion) {
    return {
      estado: 'Próxima votación',
      badgeColor: 'bg-orange-300',
      borderColor: 'border-orange-700',
      textColor: 'text-orange-700',
      labelFecha: 'Inicio del periodo de votación',
      valorFecha: fechaInicioVotacion.toLocaleDateString(),
      mensaje:
        'Ha terminado el periodo de publicación y pronto comenzará el periodo de votación. ',
    }
  } else if (ahora >= fechaInicioVotacion && ahora <= fechaFinVotacion) {
    return {
      estado: 'Votación',
      badgeColor: 'bg-blue-400',
      borderColor: 'border-blue-700',
      textColor: 'text-blue-700',
      labelFecha: 'Fin del periodo de votación',
      valorFecha: fechaFinVotacion.toLocaleDateString(),
      mensaje: 'Accede al concurso para votar por tus imágenes favoritas.',
    }
  } else {
    return {
      estado: 'Finalizado',
      badgeColor: 'bg-red-400',
      borderColor: 'border-red-700',
      textColor: 'text-red-700',
      labelFecha: '',
      valorFecha: '',
      mensaje: 'Concurso finalizado. Accede para ver los resultados.',
    }
  }
}
