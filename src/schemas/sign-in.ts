import { z } from 'zod'

type Translate = (key: string) => string

export function createSignInSchema(t: Translate) {
  return z.object({
    username: z.string().trim().min(1, t('signIn.usernameRequired')),
    password: z.string().min(1, t('signIn.passwordRequired')),
  })
}

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>
