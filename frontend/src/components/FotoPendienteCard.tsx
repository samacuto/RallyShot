import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { FotoPendiente } from '@lib/types/types'

type Props = {
  foto: FotoPendiente
}

const FotoPendienteCard: React.FC<Props> = ({ foto }) => {
  const [visible, setVisible] = useState(true)

  const actualizarEstado = async (estado: 'admitida' | 'rechazada') => {
    const confirmar = confirm(
      `¿Estás seguro de ${
        estado === 'admitida' ? 'admitir' : 'rechazar'
      } esta fotografía?`
    )
    if (!confirmar) return

    const res = await fetch(`/api/fotografias/${foto.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })

    if (res.ok) {
      setVisible(true) // si quieres animación antes de ocultar
      setTimeout(() => setVisible(false), 100) // opcional para animación
    } else {
      alert('Ocurrió un error al actualizar el estado de la fotografía.')
    }
  }

  if (!visible) return null

  return (
    <div className="bg-zinc-700 rounded-lg p-4 text-white shadow flex flex-col gap-2 transition-opacity duration-300">
      <img
        src={foto.url_imagen}
        alt={foto.titulo}
        className="rounded object-cover max-h-64"
      />
      <h4 className="font-semibold">{foto.titulo}</h4>
      <p className="text-sm text-zinc-300">{foto.descripcion}</p>

      <div className="flex gap-3 mt-3 justify-end">
        <button
          title="Admitir fotografía"
          className="group bg-green-700/20 text-green-500 hover:text-green-400 hover:bg-green-800 transition duration-200 ease-in-out cursor-pointer p-2 rounded-md shadow border border-green-500/30 hover:border-green-400"
          onClick={() => actualizarEstado('admitida')}
        >
          <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 ease-in-out" />
        </button>

        <button
          title="Rechazar fotografía"
          className="group bg-red-700/20 text-red-500 hover:text-red-400 hover:bg-red-800 transition duration-200 ease-in-out cursor-pointer p-2 rounded-md shadow border border-red-500/30 hover:border-red-400"
          onClick={() => actualizarEstado('rechazada')}
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 ease-in-out" />
        </button>
      </div>
    </div>
  )
}

export default FotoPendienteCard
