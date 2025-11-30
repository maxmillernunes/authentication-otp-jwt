import jwt from 'jsonwebtoken'
import { env } from '@/env'
import type { AuthProvider, SignRequest } from '../auth'

export class JWTProvider implements AuthProvider {
  sign({ sub }: SignRequest): string {
    const token = jwt.sign({}, env.JWT_SECRET, {
      subject: sub,
      expiresIn: '1h',
    })

    return token
  }
}
