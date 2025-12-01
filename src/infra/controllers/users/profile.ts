import { ProfileUseCase } from '@/use-cases/profile'
import { Request, Response, RequestHandler } from 'express'

export class ProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { sub } = request.user

    const profileUseCase = new ProfileUseCase()

    const profile = await profileUseCase.execute({ id: sub })

    return response.status(200).json(profile)
  }
}
