export async function initInscripcion({ user, contestId }) {
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
    console.error('❌ Error verificando inscripción:', err)
    container.innerHTML = `<div class="bg-red-800 text-red-200 p-4 rounded">No se pudo comprobar tu estado de inscripción.</div>`
  }

  function renderPhotoForm() {
    container.innerHTML = `
        <div class="bg-green-600 text-white px-4 py-2 rounded mb-4">✅ Ya estás unido al concurso</div>
        <form id="photo-form" enctype="multipart/form-data" class="bg-gray-800 p-6 rounded-lg text-white">
          <h2 class="text-xl font-semibold mb-4">Subir foto para este concurso</h2>
          <div class="mb-4">
            <label for="titulo" class="block mb-1">Título:</label>
            <input type="text" name="titulo" id="titulo" required class="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600" />
          </div>
          <div class="mb-4">
            <label for="descripcion" class="block mb-1">Descripción:</label>
            <textarea name="descripcion" id="descripcion" class="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"></textarea>
          </div>
          <div class="mb-4">
            <label for="foto" class="block mb-1">Selecciona imagen:</label>
            <input type="file" name="foto" id="foto" accept="image/*" required class="w-full text-gray-200" />
          </div>
          <button type="submit" class="px-6 py-3 bg-green-500 hover:bg-green-400 rounded font-medium transition">
            Subir foto
          </button>
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

          container.innerHTML = `<div class="bg-green-600 text-white px-4 py-2 rounded mb-4">📸 ${result.message}</div>`
        } catch (err) {
          container.innerHTML = `<div class="bg-red-600 text-white px-4 py-2 rounded mb-4">Error al subir la imagen: ${err.message}</div>`
        }
      })
  }

  function renderJoinForm() {
    container.innerHTML = `
        <form id="join-form">
          <button type="submit" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition-colors duration-150">
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
