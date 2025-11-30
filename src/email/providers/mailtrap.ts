import { env } from '@/env'
import type { EmailProvider, SendMail } from '../email'

import { MailtrapClient } from 'mailtrap'

export class MailTrapProvider implements EmailProvider {
  private client: MailtrapClient

  constructor() {
    this.client = new MailtrapClient({
      token: env.MAILTRAP_API_TOKEN,
      sandbox: true,
      testInboxId: 4219986,
    })
  }

  async sendEmail({ from, to, subject, body }: SendMail): Promise<void> {
    try {
      await this.client.send({
        to: [to],
        from: from ?? {
          email: 'maxmillernuneswork@gmail.com',
        },
        subject,
        html: body,
      })
    } catch (error) {
      console.error(error)

      throw error
    }
  }
}
