export interface SendMail {
  to: {
    email: string
    name?: string
  }
  from?: {
    email: string
    name?: string
  }
  subject: string
  body: string
}

export interface EmailProvider {
  sendEmail(data: SendMail): Promise<void>
}
