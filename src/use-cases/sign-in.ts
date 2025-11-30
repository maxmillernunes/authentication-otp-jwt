import { prisma } from '@/lib/prisma'

interface SignInUseCaseRequest {
  email: string
}

export class SignInUseCase {
  constructor() {}

  async execute({ email }: SignInUseCaseRequest): Promise<void> {
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

    await prisma.otp.create({
      data: {
        code,
        expiresAt,
        userId: user.id,
      },
    })
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
