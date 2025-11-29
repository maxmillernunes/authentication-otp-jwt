import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith('postgres://'),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(z.treeifyError(_env.error), null, 2)
  )

  throw new Error('Invalid environment variables')
}

export const env = _env.data
