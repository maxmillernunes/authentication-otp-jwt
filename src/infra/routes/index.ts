import { Router } from 'express'
import { HealthCheckController } from '../controllers/health-check'
import { SignInController } from '../controllers/users/sign-in'

const router = Router()

// Health check controller
const healthCheckController = new HealthCheckController()

// Sign-in controller
const signInController = new SignInController()

// Health check route
router.get('/health', healthCheckController.handle)

// User sign-in route
router.post('/users', signInController.handle)

export { router }
