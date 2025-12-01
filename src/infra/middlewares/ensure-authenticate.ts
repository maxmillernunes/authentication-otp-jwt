import { env } from '@/env'
import type { NextFunction, Request, Response } from 'express'
import json from 'jsonwebtoken'

interface Payload {
  sub: string
}

export async function ensureAuthenticate(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new Error('Token missing')
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub } = json.verify(token, env.JWT_SECRET) as Payload

    request.user = {
      sub,
    }

    next()
  } catch (error) {
    throw new Error('Invalid token')
  }
}
