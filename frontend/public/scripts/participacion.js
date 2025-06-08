export async function initInscripcion({ user, contestId, contestName }) {
  const container = document.getElementById('inscripcion-container')
  if (!user || !container) return

  try {
    const res = await fetch(`/api/concursos/${contestId}/joined`, {
      method: 'GET',
      credentials: 'include',
    })

    if (res.status === 401) return (window.location.href = '/login')
    if (!res.ok) throw new Error(`Error ${res.status}`)

    const { joined } = await res.json()
    joined ? renderPhotoForm() : renderJoinForm()
  } catch (err) {
    console.error('Error verificando inscripción:', err)
    container.innerHTML = `<div class="bg-red-800 text-red-200 p-4 rounded">No se pudo comprobar tu estado de inscripción.</div>`
  }

  function renderPhotoForm() {
    container.innerHTML = `
        <form id="photo-form" enctype="multipart/form-data" class="space-y-4">
          <h2 class="text-xl font-semibold mb-4 text-gray-200">Publicar fotografía en "${contestName}"</h2>
          
          <label class="block text-sm text-gray-200 font-semibold">
            Título
            <input
              type="text"
              name="titulo"
              id="titulo"
              required
              class="mt-1 w-full p-3 rounded border border-gray-700 bg-primary text-white text-sm shadow-sm font-normal"
            />
          </label>

          <label class="block text-sm text-gray-200 font-semibold">
            Descripción
            <textarea
              name="descripcion"
              id="descripcion"
              class="mt-1 w-full p-3 rounded border border-gray-700 bg-primary text-white text-sm shadow-sm font-normal"
            ></textarea>
          </label>

          <label class="block text-sm text-gray-200">
            <span class="mb-1 inline-block font-semibold">Selecciona imagen</span>
            <input
              type="file"
              name="foto"
              id="foto"
              accept="image/*"
              required
              class="block w-full text-sm
                file:px-2 file:py-1.5 file:text-white file:bg-green-800
                file:border file:border-green-600 file:rounded-md file:shadow
                hover:file:opacity-90 hover:file:border-green-400
                file:transition file:cursor-pointer"
            />
          </label>

          <div class="flex justify-end gap-4 pt-2">
            <button
              type="submit"
              class="mt-6 inline-flex items-center gap-2 px-3 py-2 bg-blue-800 text-white text-sm border border-blue-500 rounded-md hover:opacity-85 hover:border-blue-400 transition shadow cursor-pointer"
            >
              Publicar
            </button>
          </div>
        </form>
      `

    document
      .getElementById('photo-form')
      ?.addEventListener('submit', async (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)

        const fileInput = form.querySelector('input[name="foto"]')
        if (!fileInput.files || fileInput.files.length === 0) {
          container.innerHTML = `<div class="bg-red-600 text-white px-4 py-2 rounded mb-4">Por favor, selecciona un archivo de imagen.</div>`
          return
        }

        form.innerHTML = `<p class="text-white">Subiendo imagen…</p>`

        try {
          const res = await fetch(`/api/concursos/${contestId}/fotos`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
          })

          const result = await res.json()
          if (res.status === 401) return (window.location.href = '/login')
          if (!res.ok) throw new Error(result.error || `Error ${res.status}`)

          container.innerHTML = `<div class="bg-green-800 border border-green-500 text-white px-4 py-2 rounded mb-4"> ${result.message}</div>`
        } catch (err) {
          container.innerHTML = `<div class="bg-red-600 text-white px-4 py-2 rounded mb-4">Error al subir la imagen: ${err.message}</div>`
        }
      })
  }

  function renderJoinForm() {
    container.innerHTML = `
        <form id="join-form" class="flex justify-end">
          <button
            type="submit"
            class="mt-6 inline-flex items-center gap-2 px-3 py-2 bg-blue-800 text-white text-sm border border-blue-500 rounded-md hover:opacity-85 hover:border-blue-400 transition shadow cursor-pointer"
          >
            Unirme al concurso
          </button>
        </form>
      `

    document
      .getElementById('join-form')
      ?.addEventListener('submit', async (e) => {
        e.preventDefault()
        container.innerHTML = `<p class="text-white">Uniéndote al concurso…</p>`

        try {
          const postResp = await fetch(`/api/concursos/${contestId}/join`, {
            method: 'POST',
            credentials: 'include',
          })

          if (postResp.status === 401) return (window.location.href = '/login')
          const result = await postResp.json()
          if (!postResp.ok)
            throw new Error(result.error || `Error ${postResp.status}`)

          // Ya unido, renderiza el formulario de fotos
          renderPhotoForm()
        } catch (err) {
          container.innerHTML = `<div class="bg-red-600 text-white px-4 py-2 rounded">Error al unirse: ${err.message}</div>`
        }
      })
  }
}
