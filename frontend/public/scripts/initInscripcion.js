import { initInscripcion } from './participacion.js'

export function setupInscripcion(user, contestId) {
  if (user && contestId) {
    initInscripcion({ user, contestId })
  }
}
