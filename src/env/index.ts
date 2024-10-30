import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),

  // Authentication
  JWT_SECRET_KEY: z.string().min(35),
})

export const env = envSchema.parse(process.env)

