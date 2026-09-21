const PERSON_IDS_KEY = 'etv-person-ids'

function loadPersonIdMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PERSON_IDS_KEY)
    if (!raw) {
      return {}
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    const map: Record<string, string> = {}
    for (const [username, personId] of Object.entries(parsed)) {
      if (typeof personId === 'string' && personId.length > 0) {
        map[username] = personId
      }
    }
    return map
  } catch {
    return {}
  }
}

export function getPersonIdForUser(username: string) {
  return loadPersonIdMap()[username] ?? null
}

export function savePersonIdForUser(username: string, personId: string) {
  const map = loadPersonIdMap()
  map[username] = personId
  localStorage.setItem(PERSON_IDS_KEY, JSON.stringify(map))
}

export function clearPersonIdForUser(username: string) {
  const map = loadPersonIdMap()
  delete map[username]
  localStorage.setItem(PERSON_IDS_KEY, JSON.stringify(map))
}
