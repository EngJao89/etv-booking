import { isAxiosError } from 'axios'
import i18n from '@/i18n'
import { getApiErrorMessage } from '@/lib/api-error'
import { axios } from '@/lib/axios'
import type { CreatePersonPayload, Person } from '@/types/person'

type PersonApiResponse = {
  id: number
  firstName: string
  lastName: string
  address: string
  gender: string
  enabled: boolean
  profileUrl?: string
  photoUrl?: string
}

function getCreatePersonErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return i18n.t('newUser.unableToCreate')
  }

  if (!error.response) {
    return i18n.t('newUser.couldNotReachServer')
  }

  const { status, data } = error.response

  if (status === 401 || status === 403) {
    return i18n.t('newUser.unauthorized')
  }

  return getApiErrorMessage(data) ?? i18n.t('newUser.unableToCreate')
}

function mapPersonFromApi(data: PersonApiResponse): Person {
  return {
    id: String(data.id),
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    gender: data.gender,
    enabled: data.enabled,
    profileUrl: data.profileUrl ?? '',
    photoUrl: data.photoUrl ?? '',
  }
}

export async function createPerson(payload: CreatePersonPayload): Promise<Person> {
  try {
    const { data } = await axios.post<PersonApiResponse>('/api/person/v1', {
      firstName: payload.firstName,
      lastName: payload.lastName,
      address: payload.address,
      gender: payload.gender,
      enabled: payload.enabled,
      profileUrl: payload.profileUrl,
      photoUrl: payload.photoUrl,
    })

    return mapPersonFromApi(data)
  } catch (error) {
    throw new Error(getCreatePersonErrorMessage(error))
  }
}
