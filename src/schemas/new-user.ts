import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createNewUserSchema(t: TFunction) {
  return z.object({
    username: z.string().trim().min(1, t('newUser.usernameRequired')),
    password: z.string().min(1, t('newUser.passwordRequired')),
    fullname: z.string().trim().min(1, t('newUser.fullnameRequired')),
  })
}

export type NewUserFormValues = z.infer<ReturnType<typeof createNewUserSchema>>
