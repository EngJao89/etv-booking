import type { AuthSession } from '@/types/auth'

const SESSION_KEY = 'etv-session'
const LEGACY_TOKEN_KEY = 'etv-access-token'

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const session = value as Partial<AuthSession>
  return (
    typeof session.username === 'string' &&
    session.username.length > 0 &&
    typeof session.accessToken === 'string' &&
    session.accessToken.length > 0 &&
    typeof session.refreshToken === 'string'
  )
}

export function loadSession(): AuthSession | null {
  try {
    sessionStorage.removeItem(LEGACY_TOKEN_KEY)
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isAuthSession(parsed)) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }

    return parsed
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  sessionStorage.removeItem(LEGACY_TOKEN_KEY)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(LEGACY_TOKEN_KEY)
}

export function getAccessToken() {
  return loadSession()?.accessToken ?? null
}
