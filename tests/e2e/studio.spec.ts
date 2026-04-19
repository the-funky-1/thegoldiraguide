import { expect, test } from '@playwright/test'

test('studio root serves the Sanity app shell', async ({ request }) => {
  // Studio is a client-rendered React app behind Sanity auth — full hydration
  // can't complete in CI without credentials. Smoke the server response:
  // 200 with a body that includes Next's static chunk references. The Studio
  // itself is validated by Sanity's own test suite.
  const response = await request.get('/studio')
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body).toContain('<!DOCTYPE html>')
  expect(body).toMatch(/_next\/static\/chunks/)
})
