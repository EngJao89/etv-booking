function isHtml(value: string) {
  const normalized = value.trim().toLowerCase()
  return (
    normalized.startsWith('<!doctype') ||
    normalized.startsWith('<html') ||
    /<\/?[a-z][\s\S]*>/i.test(value)
  )
}

export function getApiErrorMessage(data: unknown) {
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (!trimmed || isHtml(trimmed)) {
      return undefined
    }
    return trimmed
  }

  if (!data || typeof data !== 'object') {
    return undefined
  }

  if ('message' in data && typeof data.message === 'string' && data.message.trim()) {
    return isHtml(data.message) ? undefined : data.message
  }

  if ('detail' in data && typeof data.detail === 'string' && data.detail.trim()) {
    return isHtml(data.detail) ? undefined : data.detail
  }

  return undefined
}

export function isHtmlErrorBody(data: unknown) {
  return typeof data === 'string' && isHtml(data)
}
