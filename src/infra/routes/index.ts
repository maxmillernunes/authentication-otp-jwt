import { Router } from 'express'
import { HealthCheckController } from '../controllers/health-check'

const router = Router()

const healthCheckController = new HealthCheckController()

router.get('/health', healthCheckController.handle)

export { router }
