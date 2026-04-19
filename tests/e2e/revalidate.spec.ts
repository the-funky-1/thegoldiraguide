import { expect, test } from '@playwright/test'

test('rejects requests without a valid signature', async ({ request }) => {
  const response = await request.post('/api/revalidate', {
    data: { _type: 'article', slug: { current: 'x' } },
    headers: { 'sanity-webhook-signature': 'bad' },
  })
  expect([401, 403]).toContain(response.status())
})

test('accepts requests with a valid HMAC signature', async ({ request }) => {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  test.skip(!secret, 'SANITY_REVALIDATE_SECRET not set in this env')

  const body = JSON.stringify({
    _type: 'article',
    slug: { current: 'test-article' },
  })
  const crypto = await import('node:crypto')
  const sig = crypto
    .createHmac('sha256', secret as string)
    .update(body)
    .digest('hex')

  const response = await request.post('/api/revalidate', {
    data: body,
    headers: {
      'content-type': 'application/json',
      'sanity-webhook-signature': `t=${Date.now()},v1=${sig}`,
    },
  })
  expect(response.status()).toBe(200)
  const json = await response.json()
  expect(json).toMatchObject({
    revalidated: true,
    tags: expect.arrayContaining(['article:test-article', 'article']),
  })
})
