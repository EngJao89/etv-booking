import type { AuthSession } from '@/types/auth'

const SESSION_KEY = 'etv-session'
const LEGACY_TOKEN_KEY = 'etv-access-token'

export const SESSION_EXPIRED_EVENT = 'etv-session-expired'

function toAuthSession(value: unknown): AuthSession | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const session = value as Partial<AuthSession>
  if (
    typeof session.username !== 'string' ||
    session.username.length === 0 ||
    typeof session.accessToken !== 'string' ||
    session.accessToken.length === 0
  ) {
    return null
  }

  return {
    username: session.username,
    accessToken: session.accessToken,
    refreshToken: typeof session.refreshToken === 'string' ? session.refreshToken : '',
  }
}

export function loadSession(): AuthSession | null {
  try {
    sessionStorage.removeItem(LEGACY_TOKEN_KEY)
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }

    const session = toAuthSession(JSON.parse(raw))
    if (!session) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }

    return session
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

export function expireSession() {
  clearSession()
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

export function getAccessToken() {
  return loadSession()?.accessToken ?? null
}

export function getRefreshToken() {
  return loadSession()?.refreshToken ?? null
}
