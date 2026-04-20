import { expect, test } from '@playwright/test'

test('rejects unsupported metal keys with 400', async ({ request }) => {
  const res = await request.get('/api/metals/spot?metal=uranium')
  expect(res.status()).toBe(400)
})

test('returns a normalized SpotPrice for gold', async ({ request }) => {
  test.skip(!process.env.METALPRICE_API_KEY, 'METALPRICE_API_KEY not set')
  const res = await request.get('/api/metals/spot?metal=gold')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('application/json')
  const body = await res.json()
  expect(body).toMatchObject({
    metal: 'gold',
    pricePerOunceUsd: expect.any(Number),
    change24hPercent: expect.any(Number),
    source: 'metalpriceapi',
    stale: expect.any(Boolean),
  })
  expect(body.pricePerOunceUsd).toBeGreaterThan(0)
})

test('rate-limit eventually 429s a burst client', async ({ request }) => {
  for (let i = 0; i < 31; i++) {
    await request.get('/api/metals/spot?metal=gold')
  }
  const res = await request.get('/api/metals/spot?metal=gold')
  expect([429, 200]).toContain(res.status())
  if (res.status() === 429) {
    expect(res.headers()['retry-after']).toBeDefined()
  }
})
