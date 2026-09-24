const PHOTO_URLS_KEY = 'etv-photo-urls'

function loadPhotoUrlMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PHOTO_URLS_KEY)
    if (!raw) {
      return {}
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    const map: Record<string, string> = {}
    for (const [username, photoUrl] of Object.entries(parsed)) {
      if (typeof photoUrl === 'string' && photoUrl.length > 0) {
        map[username] = photoUrl
      }
    }
    return map
  } catch {
    return {}
  }
}

export function getPhotoUrlForUser(username: string) {
  return loadPhotoUrlMap()[username] ?? null
}

export function savePhotoUrlForUser(username: string, photoUrl: string) {
  const map = loadPhotoUrlMap()
  const trimmed = photoUrl.trim()

  if (trimmed) {
    map[username] = trimmed
  } else {
    delete map[username]
  }

  localStorage.setItem(PHOTO_URLS_KEY, JSON.stringify(map))
}

export function clearPhotoUrlForUser(username: string) {
  const map = loadPhotoUrlMap()
  delete map[username]
  localStorage.setItem(PHOTO_URLS_KEY, JSON.stringify(map))
}
