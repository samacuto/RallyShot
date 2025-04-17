import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fotografiasRoutes from './routes/fotografiasRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/fotografias', fotografiasRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
