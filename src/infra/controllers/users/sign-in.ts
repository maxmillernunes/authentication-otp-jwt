import { z } from 'zod'
import { Request, Response } from 'express'
import { SignInUseCase } from '@/use-cases/sign-in'
import { MailTrapProvider } from '@/email/providers/mailtrap'

const signInSchema = z.object({
  email: z.email(),
})

export class SignInController {
  constructor() {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = signInSchema.parse(request.body)

    const mailProvider = new MailTrapProvider()
    const signInUseCase = new SignInUseCase(mailProvider)

    const otpId = await signInUseCase.execute({ email })

    return response.status(200).json(otpId)
  }
}
