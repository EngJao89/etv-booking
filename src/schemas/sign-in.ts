import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createSignInSchema(t: TFunction) {
  return z.object({
    username: z.string().trim().min(1, t('signIn.usernameRequired')),
    password: z.string().min(1, t('signIn.passwordRequired')),
  })
}

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>
