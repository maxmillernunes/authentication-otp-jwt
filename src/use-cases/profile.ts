import { prisma } from '@/lib/prisma'
import type { User } from '@/prisma-client'

export interface ProfileUseCaseRequest {
  id: string
}

export interface ProfileUseCaseResponse {
  user: User
}

export class ProfileUseCase {
  async execute({
    id,
  }: ProfileUseCaseRequest): Promise<ProfileUseCaseResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new Error('Profile does not exists')
    }

    return {
      user,
    }
  }
}
