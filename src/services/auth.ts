import { isAxiosError } from 'axios'
import { axios } from '@/lib/axios'
import type { AuthSession, SignInRequest, SignInResponse } from '@/types/auth'

function getSignInErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return 'Unable to sign in. Please try again.'
  }

  if (!error.response) {
    return 'Could not reach the server. Please try again.'
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
    return 'Invalid username or password.'
  }

  if (apiMessage) {
    return apiMessage
  }

  return 'Unable to sign in. Please try again.'
}

export async function signIn(payload: SignInRequest): Promise<AuthSession> {
  try {
    const { data } = await axios.post<SignInResponse>('/auth/signin', payload)

    return {
      username: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    throw new Error(getSignInErrorMessage(error))
  }
}
