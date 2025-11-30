import { z } from 'zod'
import { Request, Response } from 'express'
import { SignUpUseCase } from '@/use-cases/sign-up'
import { MailTrapProvider } from '@/email/providers/mailtrap'

const signUpSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
})

export class SignUpController {
  constructor() {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email } = signUpSchema.parse(request.body)

    const mailProvider = new MailTrapProvider()
    const signInUseCase = new SignUpUseCase(mailProvider)

    const user = await signInUseCase.execute({ name, email })

    return response.status(200).json(user)
  }
}
