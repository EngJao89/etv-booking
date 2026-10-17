import { z } from 'zod'

type Translate = (key: string) => string

export function createNewUserSchema(t: Translate) {
  return z.object({
    username: z.string().trim().min(1, t('newUser.usernameRequired')),
    password: z.string().min(1, t('newUser.passwordRequired')),
    fullname: z.string().trim().min(1, t('newUser.fullnameRequired')),
  })
}

export type NewUserFormValues = z.infer<ReturnType<typeof createNewUserSchema>>
