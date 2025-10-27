import { z } from 'zod'
import { usernameSchema } from '../user'

export const signInSchema = z
  .object({
    identifier: z.string().transform((value) => value.toLowerCase()),
    password: z.string().min(8),
  })
  .refine(
    (value) => {
      return value.identifier.includes('@')
        ? z.string().email().parse(value.identifier)
        : usernameSchema.parse(value.identifier)
    },
    { message: 'InvalidCredentials' }
  )

export type SignInDto = z.infer<typeof signInSchema>
