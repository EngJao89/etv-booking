import Axios, { type InternalAxiosRequestConfig } from 'axios'
import { isHtmlErrorBody } from '@/lib/api-error'
import {
  expireSession,
  getAccessToken,
  loadSession,
  saveSession,
} from '@/lib/session'
import type { AuthSession, SignInResponse } from '@/types/auth'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete axios.defaults.headers.common.Authorization
}

const storedToken = getAccessToken()
if (storedToken) {
  setAuthToken(storedToken)
}

function isAuthUrl(url = '') {
  return (
    url.includes('/auth/signin') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/createUser')
  )
}

function shouldRefresh(status: number | undefined, data: unknown) {
  if (status === 401 || status === 403) {
    return true
  }

  return status === 500 && isHtmlErrorBody(data)
}

let refreshRequest: Promise<AuthSession> | null = null

async function refreshSession() {
  const session = loadSession()
  if (!session?.refreshToken) {
    throw new Error('Missing refresh token')
  }

  const { data } = await axios.put<SignInResponse>(
    `/auth/refresh/${encodeURIComponent(session.username)}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${session.refreshToken}`,
      },
    },
  )

  if (!data.accessToken) {
    throw new Error('Invalid refresh response')
  }

  const nextSession: AuthSession = {
    username: data.username || session.username,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || session.refreshToken,
  }

  saveSession(nextSession)
  setAuthToken(nextSession.accessToken)
  return nextSession
}

axios.interceptors.request.use((config) => {
  if (isAuthUrl(config.url)) {
    return config
  }

  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryConfig | undefined
    const status = error.response?.status
    const data = error.response?.data

    if (!config || config._retry || isAuthUrl(config.url) || !shouldRefresh(status, data)) {
      throw error
    }

    const session = loadSession()
    if (!session?.refreshToken) {
      expireSession()
      setAuthToken(null)
      throw error
    }

    config._retry = true

    try {
      refreshRequest ??= refreshSession().finally(() => {
        refreshRequest = null
      })
      const nextSession = await refreshRequest
      config.headers.Authorization = `Bearer ${nextSession.accessToken}`
      return axios(config)
    } catch {
      expireSession()
      setAuthToken(null)
      throw error
    }
  },
)
