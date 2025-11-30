export interface SignRequest {
  sub: string
}

export interface AuthProvider {
  sign(data: SignRequest): string
}
