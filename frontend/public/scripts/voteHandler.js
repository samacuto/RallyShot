const storageKey = 'votedPhotos'

console.log('Script de votación iniciado')

const article = document.querySelector('article[data-photo-id]')
console.log('Artículo encontrado:', article)

if (!article) {
  console.error('Artículo con data-photo-id no encontrado.')
} else {
  const photoId = article.dataset.photoId
  console.log('ID de la foto:', photoId)

  // Seleccionar elementos
  const btn = article.querySelector('.vote-btn')
  const icon = btn?.querySelector('svg')
  const countSpan = btn?.nextElementSibling

  console.log('Botón encontrado:', btn)
  console.log('Ícono encontrado:', icon)
  console.log('Contador encontrado:', countSpan)

  if (!btn) {
    console.warn(`Botón de voto no encontrado para photoId: ${photoId}`)
  }

  // Cargar votos previos e inicializar colores
  let voted = JSON.parse(localStorage.getItem(storageKey) || '[]')
  console.log('Votos previos:', voted)

  if (icon) {
    if (voted.includes(photoId)) {
      icon.classList.remove('text-white', 'hover:text-red-400')
      icon.classList.add('text-red-500')
      console.log('Corazón marcado como votado')
    }
  }
  if (countSpan) {
    countSpan.classList.add(
      voted.includes(photoId) ? 'text-red-500' : 'text-gray-400'
    )
  }

  if (btn) {
    btn.addEventListener('click', async () => {
      console.log('Botón clickeado')

      if (voted.includes(photoId)) {
        console.log('Ya votado anteriormente')
        // Animación de "ya votado"
        btn.classList.add('animate-shake')
        setTimeout(() => btn.classList.remove('animate-shake'), 500)
        return
      }

      try {
        console.log('Iniciando voto')
        // Animación de "votando"
        btn.classList.add('animate-pulse')
        icon?.classList.add('animate-bounce')

        const res = await fetch('/api/votos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoId }),
          credentials: 'include',
        })

        console.log('Respuesta del servidor:', res.status)

        if (res.status === 401) {
          console.log('No autorizado, redirigiendo a login')
          window.location.href = '/login'
          return
        }

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || `Error ${res.status}`)
        }

        console.log('Voto registrado exitosamente')
        // Animación de éxito
        btn.classList.remove('animate-pulse')
        icon?.classList.remove('animate-bounce')
        icon?.classList.add('animate-heartbeat')
        setTimeout(() => {
          icon?.classList.remove('animate-heartbeat')
          icon?.classList.remove('text-white', 'hover:text-red-400')
          icon?.classList.add('text-red-500')
          console.log('Corazón cambiado a rojo')
        }, 1000)

        // Actualizar cache y UI
        voted.push(photoId)
        localStorage.setItem(storageKey, JSON.stringify(voted))
        if (countSpan) {
          countSpan.classList.replace('text-gray-400', 'text-red-500')
          countSpan.textContent = String(Number(countSpan.textContent) + 1)
          countSpan.classList.add('animate-count-up')
          setTimeout(() => countSpan.classList.remove('animate-count-up'), 1000)
        }
      } catch (err) {
        console.error('Error al votar:', err)
        // Animación de error
        btn.classList.remove('animate-pulse')
        if (icon) {
          icon.classList.remove('animate-bounce')
        }
        btn.classList.add('animate-shake')
        setTimeout(() => btn.classList.remove('animate-shake'), 500)
        alert(
          err instanceof Error
            ? err.message
            : 'Error al votar. Intenta más tarde.'
        )
      }
    })
  }
}
