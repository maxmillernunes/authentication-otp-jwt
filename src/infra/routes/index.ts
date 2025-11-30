import { Router } from 'express'
import { HealthCheckController } from '../controllers/health-check'
import { SignInController } from '../controllers/users/sign-in'
import { SignUpController } from '../controllers/users/sign-up'
import { ValidateOtpController } from '../controllers/users/validate-otp'

const router = Router()

// Health check controller
const healthCheckController = new HealthCheckController()

// Sign-in controller
const signInController = new SignInController()
const signUpController = new SignUpController()
const validateOtpController = new ValidateOtpController()

// Health check route
router.get('/health', healthCheckController.handle)

// User sign-in route
router.post('/auth/signin', signInController.handle)
router.post('/auth/signup', signUpController.handle)
router.post('/auth/validate', validateOtpController.handle)

export { router }
