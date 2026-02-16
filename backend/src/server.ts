import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'

import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import { errorHandler } from './middleware/errorHandler'
import swaggerSpec from './docs/swagger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// basic security headers
app.use(helmet())

// rate limiting (simple)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  })
)

// request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(cors())
app.use(express.json())

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// global error handler (must come after routes)
app.use(errorHandler)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

export default app
