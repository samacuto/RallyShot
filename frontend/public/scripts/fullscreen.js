window.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.fullscreenable')

  images.forEach((img) => {
    img.style.cursor = 'zoom-in'
    img.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        img.requestFullscreen().catch((err) => {
          console.error('Error al activar fullscreen:', err)
        })
      }
    })
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen()
    }
  })
})
