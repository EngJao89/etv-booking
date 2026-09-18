import { isAxiosError } from 'axios'
import i18n from '@/i18n'
import { getApiErrorMessage } from '@/lib/api-error'
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
  const apiMessage = getApiErrorMessage(data)

  if (status === 401 || status === 403 || apiMessage === 'Bad credentials') {
    return i18n.t('signIn.invalidCredentials')
  }

  return apiMessage ?? i18n.t('signIn.unableToSignIn')
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
