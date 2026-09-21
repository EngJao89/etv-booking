import { isAxiosError } from 'axios'
import i18n from '@/i18n'
import { getApiErrorMessage } from '@/lib/api-error'
import { axios } from '@/lib/axios'
import type {
  AuthSession,
  CreateUserRequest,
  SignInRequest,
  SignInResponse,
} from '@/types/auth'

function getSignInErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return i18n.t('signIn.unableToSignIn')
  }

  if (!error.response) {
    return i18n.t('signIn.couldNotReachServer')
  }

  const { status, data } = error.response
  const apiMessage = getApiErrorMessage(data)

  if (status === 401 || status === 403 || apiMessage === 'Bad credentials') {
    return i18n.t('signIn.invalidCredentials')
  }

  return apiMessage ?? i18n.t('signIn.unableToSignIn')
}

function getCreateUserErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return i18n.t('newUser.unableToCreate')
  }

  if (!error.response) {
    return i18n.t('newUser.couldNotReachServer')
  }

  const { status, data } = error.response
  const apiMessage = getApiErrorMessage(data)

  if (status === 409) {
    return apiMessage ?? i18n.t('newUser.alreadyExists')
  }

  return apiMessage ?? i18n.t('newUser.unableToCreate')
}

export async function signIn(payload: SignInRequest): Promise<AuthSession> {
  try {
    const { data } = await axios.post<SignInResponse>('/auth/signin', payload)

    if (!data.accessToken) {
      throw new Error(i18n.t('signIn.unableToSignIn'))
    }

    return {
      username: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? '',
    }
  } catch (error) {
    throw new Error(getSignInErrorMessage(error))
  }
}

export async function createUser(payload: CreateUserRequest): Promise<void> {
  try {
    await axios.post('/auth/createUser', payload)
  } catch (error) {
    throw new Error(getCreateUserErrorMessage(error))
  }
}
