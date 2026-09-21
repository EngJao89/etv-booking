import { isAxiosError } from 'axios'
import i18n from '@/i18n'
import { getApiErrorMessage } from '@/lib/api-error'
import { axios } from '@/lib/axios'
import {
  getPersonIdForUser,
  savePersonIdForUser,
} from '@/lib/person-id'
import type { CreatePersonPayload, Person } from '@/types/person'

export type UpdatePersonPayload = CreatePersonPayload & {
  id: string
}

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

function getPersonErrorMessage(
  error: unknown,
  fallbackKey: 'profile.unableToLoad' | 'profile.unableToSave',
) {
  if (!isAxiosError(error)) {
    return i18n.t(fallbackKey)
  }

  if (!error.response) {
    return i18n.t('profile.couldNotReachServer')
  }

  const { status, data } = error.response

  if (status === 401 || status === 403) {
    return i18n.t('profile.unauthorized')
  }

  if (status === 404) {
    return i18n.t('profile.notFound')
  }

  return getApiErrorMessage(data) ?? i18n.t(fallbackKey)
}

function isPersonApiResponse(value: unknown): value is PersonApiResponse {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'id' in value &&
      'firstName' in value &&
      'lastName' in value,
  )
}

function extractPersonList(data: unknown): PersonApiResponse[] {
  if (Array.isArray(data)) {
    return data.filter(isPersonApiResponse)
  }

  if (!data || typeof data !== 'object') {
    return []
  }

  if ('content' in data && Array.isArray(data.content)) {
    return data.content.filter(isPersonApiResponse)
  }

  if ('_embedded' in data && data._embedded && typeof data._embedded === 'object') {
    for (const value of Object.values(data._embedded as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        return value.filter(isPersonApiResponse)
      }
    }
  }

  return []
}

export function mapPersonFromApi(data: PersonApiResponse): Person {
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

export async function getPerson(id: string): Promise<Person> {
  try {
    const { data } = await axios.get<unknown>(`/api/person/v1/${encodeURIComponent(id)}`)

    if (!isPersonApiResponse(data)) {
      throw new Error(i18n.t('profile.unableToLoad'))
    }

    return mapPersonFromApi(data)
  } catch (error) {
    if (error instanceof Error && !isAxiosError(error)) {
      throw error
    }

    throw new Error(getPersonErrorMessage(error, 'profile.unableToLoad'))
  }
}

export async function findPeopleByName(firstName: string): Promise<Person[]> {
  const { data } = await axios.get<unknown>(
    `/api/person/v1/findPeopleByName/${encodeURIComponent(firstName)}`,
    {
      params: {
        page: 0,
        size: 12,
        direction: 'asc',
      },
    },
  )

  return extractPersonList(data).map(mapPersonFromApi)
}

export async function resolveProfilePerson(username: string): Promise<Person> {
  const storedId = getPersonIdForUser(username)

  if (storedId) {
    try {
      const person = await getPerson(storedId)
      savePersonIdForUser(username, person.id)
      return person
    } catch {
      // fall through and try by name
    }
  }

  try {
    const people = await findPeopleByName(username)
    const person =
      people.find(
        (item) => item.firstName.toLowerCase() === username.toLowerCase(),
      ) ?? people[0]

    if (!person) {
      throw new Error(i18n.t('profile.notFound'))
    }

    savePersonIdForUser(username, person.id)
    return person
  } catch (error) {
    if (error instanceof Error && !isAxiosError(error)) {
      throw error
    }

    throw new Error(getPersonErrorMessage(error, 'profile.unableToLoad'))
  }
}

export async function updatePerson(payload: UpdatePersonPayload): Promise<Person> {
  try {
    const { data } = await axios.put<PersonApiResponse>('/api/person/v1', {
      id: Number(payload.id),
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
    throw new Error(getPersonErrorMessage(error, 'profile.unableToSave'))
  }
}
