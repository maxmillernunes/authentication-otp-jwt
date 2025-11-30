import type { AuthProvider } from '@/auth/auth'
import { prisma } from '@/lib/prisma'
import type { User } from '@/prisma-client'

interface ValidateOtpUseCaseRequest {
  id: string
  otp: string
}

interface ValidateOtpUseCaseResponse {
  user: User
  token: string
}

export class ValidateOtpUseCase {
  constructor(private auth: AuthProvider) {}

  async execute({
    otp,
    id,
  }: ValidateOtpUseCaseRequest): Promise<ValidateOtpUseCaseResponse> {
    const date = new Date()

    const userOtp = await prisma.otp.findFirst({
      where: {
        id,
        code: otp,
        used: false,
        expiresAt: {
          gt: date,
        },
      },
      include: {
        user: true,
      },
    })

    if (!userOtp) {
      throw new Error('Invalid or expired OTP.')
    }

    const token = this.auth.sign({ sub: userOtp.user.id })

    await prisma.otp.update({
      where: {
        id,
      },
      data: {
        used: true,
      },
    })

    return { token, user: userOtp.user }
  }
}
