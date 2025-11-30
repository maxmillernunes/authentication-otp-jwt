import type { EmailProvider } from '@/email/email'
import { prisma } from '@/lib/prisma'
import type { User } from '@/prisma-client'

interface SignUpUseCaseRequest {
  name: string
  email: string
}

interface SignUpUseCaseResponse {
  user: User
}

export class SignUpUseCase {
  constructor(private emailProvider: EmailProvider) {}

  async execute({
    name,
    email,
  }: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      throw new Error('User already exists.')
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    })

    await this.emailProvider.sendEmail({
      to: {
        email: user.email,
        name: user.name,
      },
      subject: 'Welcome to our plataforma',
      body: `<p>Welcome</p>`,
    })

    return { user }
  }
}
