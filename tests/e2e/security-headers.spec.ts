import { expect, test } from '@playwright/test'

test('home response carries required security headers', async ({ request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)

  const headers = response.headers()

  expect(headers['strict-transport-security']).toBe(
    'max-age=31536000; includeSubDomains; preload',
  )
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['permissions-policy']).toBe(
    'camera=(), microphone=(), geolocation=()',
  )

  const csp = headers['content-security-policy']
  expect(csp).toBeDefined()
  expect(csp).toMatch(/default-src 'self'/)
  expect(csp).toMatch(/script-src [^;]*'nonce-[A-Za-z0-9+/=]+'/)
  expect(csp).toMatch(/'strict-dynamic'/)
  expect(csp).toMatch(/frame-ancestors 'none'/)
  expect(csp).toMatch(/object-src 'none'/)
  expect(csp).toMatch(/base-uri 'self'/)
  expect(csp).toMatch(/upgrade-insecure-requests/)
})

test('nonce differs across two requests', async ({ request }) => {
  const a = await request.get('/')
  const b = await request.get('/')
  const extract = (h: Record<string, string>): string | null => {
    const match = h['content-security-policy']?.match(/'nonce-([^']+)'/)
    return match ? (match[1] ?? null) : null
  }
  const nonceA = extract(a.headers())
  const nonceB = extract(b.headers())
  expect(nonceA).not.toBeNull()
  expect(nonceB).not.toBeNull()
  expect(nonceA).not.toBe(nonceB)
})

test('x-powered-by header is absent', async ({ request }) => {
  const response = await request.get('/')
  expect(response.headers()['x-powered-by']).toBeUndefined()
})
