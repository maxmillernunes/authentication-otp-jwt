import express, { urlencoded, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import z, { ZodError } from 'zod'
import { router } from './infra/routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(express.json())

app.use(router)

// Global error handling middleware
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
      return response.status(400).send({
        message: 'Validation error',
        error: z.treeifyError(error),
      })
    }

    // Handle other types of errors

    // Error fallback
    if (error) {
      return response.status(500).json({ message: error.message })
    }
    next()
  }
)

export { app }
