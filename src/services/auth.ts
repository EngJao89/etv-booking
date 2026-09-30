import { isAxiosError } from 'axios'
import { translate } from '@/i18n'
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
    return translate('signIn.unableToSignIn')
  }

  if (!error.response) {
    return translate('signIn.couldNotReachServer')
  }

  const { status, data } = error.response
  const apiMessage = getApiErrorMessage(data)

  if (status === 401 || status === 403 || apiMessage === 'Bad credentials') {
    return translate('signIn.invalidCredentials')
  }

  return apiMessage ?? translate('signIn.unableToSignIn')
}

function getCreateUserErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return translate('newUser.unableToCreate')
  }

  if (!error.response) {
    return translate('newUser.couldNotReachServer')
  }

  const { status, data } = error.response
  const apiMessage = getApiErrorMessage(data)

  if (status === 409) {
    return apiMessage ?? translate('newUser.alreadyExists')
  }

  return apiMessage ?? translate('newUser.unableToCreate')
}

export async function signIn(payload: SignInRequest): Promise<AuthSession> {
  try {
    const { data } = await axios.post<SignInResponse>('/auth/signin', payload)

    if (!data.accessToken) {
      throw new Error(translate('signIn.unableToSignIn'))
    }

    return {
      username: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? '',
    }
  } catch (error) {
    throw new Error(getSignInErrorMessage(error), { cause: error })
  }
}

export async function createUser(payload: CreateUserRequest): Promise<void> {
  try {
    await axios.post('/auth/createUser', payload)
  } catch (error) {
    throw new Error(getCreateUserErrorMessage(error), { cause: error })
  }
}
