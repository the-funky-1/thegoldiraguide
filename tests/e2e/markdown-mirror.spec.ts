import { expect, test } from '@playwright/test'

// The markdown mirror must work even when no articles are seeded: a miss
// returns 404. The tests below exercise the routing layer, not the fetched
// article content.

test('missing article .md → 404', async ({ request }) => {
  const response = await request.get('/ira-rules/nope.md')
  expect(response.status()).toBe(404)
  expect(response.headers()['content-type']).toContain('text/plain')
})

test('missing article via Accept: text/markdown → 404', async ({ request }) => {
  const response = await request.get('/ira-rules/nope', {
    headers: { accept: 'text/markdown' },
  })
  expect(response.status()).toBe(404)
})

test('invalid pillar .md → 404', async ({ request }) => {
  const response = await request.get('/unknown-pillar/slug.md')
  expect(response.status()).toBe(404)
})

test('public tool .md mirror returns formula context', async ({ request }) => {
  const response = await request.get('/tools/spread-markup-calculator.md')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/markdown')
  const body = await response.text()
  expect(body).toContain('# Dealer Spread and Markup Calculator')
  expect(body).toContain('## Formula')
})
