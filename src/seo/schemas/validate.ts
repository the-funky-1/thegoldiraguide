const URL_FIELDS = new Set(['url', 'item', 'logo', 'sameAs'])

export type ValidationResult = { ok: boolean; errors: string[] }

function isHttpsUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

function walk(node: unknown, path: string, errors: string[]): void {
  if (node === null || typeof node !== 'object') return
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`, errors))
    return
  }
  const obj = node as Record<string, unknown>
  for (const [key, value] of Object.entries(obj)) {
    if (URL_FIELDS.has(key)) {
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (!isHttpsUrl(v))
            errors.push(`relative url at ${path}.${key}[${i}]: ${String(v)}`)
        })
      } else if (typeof value === 'string' && !isHttpsUrl(value)) {
        errors.push(`relative url at ${path}.${key}: ${value}`)
      }
    }
    walk(value, `${path}.${key}`, errors)
  }
}

export function validateJsonLd(data: unknown): ValidationResult {
  const errors: string[] = []
  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['payload is not an object'] }
  }
  const obj = data as Record<string, unknown>
  if (obj['@context'] !== 'https://schema.org') errors.push('missing @context')
  if (typeof obj['@type'] !== 'string') errors.push('missing @type')
  walk(obj, '$', errors)
  return { ok: errors.length === 0, errors }
}
