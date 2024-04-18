import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// Routes
app.get('/', (req, res) => res.send('OK'))
app.use('/api/auth', authRoutes)

export default app
