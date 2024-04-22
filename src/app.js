import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import 'express-async-errors'

import { AppError } from './utils/error.js'
import { errorHandler } from './middlewares/error.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/project.js'

const app = express()

// Global middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())

// Routes
app.get('/', (req, res) => res.send('OK'))
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

// Error handlers
app.use(() => {
  throw new AppError('Route not found', 404)
})

app.use(errorHandler)

export default app
