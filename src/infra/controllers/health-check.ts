import { Request, Response } from 'express'

export class HealthCheckController {
  async handle(_request: Request, response: Response) {
    return response.status(200).json({ status: 'OK' })
  }
}
