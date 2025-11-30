import { z } from 'zod'
import { Request, Response } from 'express'
import { SignInUseCase } from '@/use-cases/sign-in'

const signInSchema = z.object({
  email: z.email(),
})

export class SignInController {
  constructor() {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = signInSchema.parse(request.body)

    const signInUseCase = new SignInUseCase()

    await signInUseCase.execute({ email })

    return response.status(200).send()
  }
}
