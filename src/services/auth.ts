import { isAxiosError } from 'axios'
import i18n from '@/i18n'
import { axios } from '@/lib/axios'
import type { AuthSession, SignInRequest, SignInResponse } from '@/types/auth'

function getSignInErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return i18n.t('signIn.unableToSignIn')
  }

  if (!error.response) {
    return i18n.t('signIn.couldNotReachServer')
  }

  const { status, data } = error.response
  let apiMessage: string | undefined

  if (typeof data === 'string') {
    apiMessage = data
  } else if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof data.message === 'string'
  ) {
    apiMessage = data.message
  }

  if (status === 401 || status === 403 || apiMessage === 'Bad credentials') {
    return i18n.t('signIn.invalidCredentials')
  }

  if (apiMessage) {
    return apiMessage
  }

  return i18n.t('signIn.unableToSignIn')
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
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    throw new Error(getSignInErrorMessage(error))
  }
}
