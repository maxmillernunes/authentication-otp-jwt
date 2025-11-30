import type { EmailProvider } from '@/email/email'
import { prisma } from '@/lib/prisma'
import type { Otp } from '@/prisma-client'

interface SignInUseCaseRequest {
  email: string
}

interface SignInUseCaseResponse {
  otpId: string
}

export class SignInUseCase {
  constructor(private emailProvider: EmailProvider) {}

  async execute({
    email,
  }: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error('User not found.')
    }

    const code = this.generateCode()

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30)

    const otp = await prisma.otp.create({
      data: {
        code,
        expiresAt,
        userId: user.id,
      },
    })

    await this.emailProvider.sendEmail({
      to: {
        email: user.email,
        name: user.name,
      },
      subject: 'Your sign-in code',
      body: `<p>Your sign-in code is: <strong>${code}</strong></p>`,
    })

    return { otpId: otp.id }
  }

  private generateCode(): string {
    const codeLength = 6

    let otpArray: number[] = []

    for (let i = 0; i < codeLength; i++) {
      const randomDigit = Math.floor(Math.random() * 9)

      otpArray.push(randomDigit)
    }

    return otpArray.join('')
  }
}
