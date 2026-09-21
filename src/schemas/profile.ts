import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createProfileSchema(t: TFunction) {
  return z.object({
    firstName: z.string().trim().min(1, t('newUser.firstNameRequired')),
    lastName: z.string().trim().min(1, t('newUser.lastNameRequired')),
    address: z.string().trim().min(1, t('newUser.addressRequired')),
    gender: z.string().trim().min(1, t('newUser.genderRequired')),
    enabled: z.boolean(),
    profileUrl: z.string().trim(),
    photoUrl: z.string().trim(),
  })
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
