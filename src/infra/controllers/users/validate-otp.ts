import { JWTProvider } from '@/auth/provider/jwt'
import { ValidateOtpUseCase } from '@/use-cases/validate-otp'
import { Request, Response } from 'express'
import z from 'zod'

const validateOtpSchema = z.object({
  otp: z.string().length(6),
  otpId: z.uuid(),
})

export class ValidateOtpController {
  constructor() {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { otpId, otp } = validateOtpSchema.parse(request.body)

    const jwtProvider = new JWTProvider()
    const validateOtpUseCase = new ValidateOtpUseCase(jwtProvider)

    const user = await validateOtpUseCase.execute({
      id: otpId,
      otp,
    })

    return response.status(200).json(user)
  }
}
