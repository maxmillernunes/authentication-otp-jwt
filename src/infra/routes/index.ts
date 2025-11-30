import { Router } from 'express'
import { HealthCheckController } from '../controllers/health-check'
import { SignInController } from '../controllers/users/sign-in'
import { SignUpController } from '../controllers/users/sign-up'

const router = Router()

// Health check controller
const healthCheckController = new HealthCheckController()

// Sign-in controller
const signInController = new SignInController()
const signUpController = new SignUpController()

// Health check route
router.get('/health', healthCheckController.handle)

// User sign-in route
router.post('/signin', signInController.handle)
router.post('/signup', signUpController.handle)

export { router }
