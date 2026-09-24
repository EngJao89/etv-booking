import { z } from 'zod'
import type { TFunction } from 'i18next'

export const PERSON_GENDERS = ['Male', 'Female'] as const
export type PersonGender = (typeof PERSON_GENDERS)[number]

export function normalizePersonGender(value: string): PersonGender | '' {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'male' || normalized === 'm' || normalized === 'masculino') {
    return 'Male'
  }

  if (
    normalized === 'female' ||
    normalized === 'f' ||
    normalized === 'feminino'
  ) {
    return 'Female'
  }

  return PERSON_GENDERS.includes(value as PersonGender) ? (value as PersonGender) : ''
}

export function createProfileSchema(t: TFunction) {
  return z.object({
    firstName: z.string().trim().min(1, t('newUser.firstNameRequired')),
    lastName: z.string().trim().min(1, t('newUser.lastNameRequired')),
    address: z.string().trim().min(1, t('newUser.addressRequired')),
    gender: z.enum(PERSON_GENDERS, {
      message: t('newUser.genderInvalid'),
    }),
    enabled: z.boolean(),
    profileUrl: z.string().trim(),
    photoUrl: z.string().trim(),
  })
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
