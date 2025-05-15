import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fotografiaRoutes from './routes/fotografiaRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import concursosRoutes from './routes/concursoRoutes.js'
import votoRoutes from './routes/votoRoutes.js'
import { initEmailService } from './services/emailService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

initEmailService()

app.use(cors())
app.use(express.json())

app.use('/api/fotografias', fotografiaRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/concursos', concursosRoutes)
app.use('/api/votos', votoRoutes)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
