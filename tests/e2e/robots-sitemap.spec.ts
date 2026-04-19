import { expect, test } from '@playwright/test'

test('/robots.txt references sitemap and disallows /studio', async ({
  request,
}) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body).toContain('Disallow: /studio')
  expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/)
  expect(body).toMatch(/\/llms\.txt/)
})

test('/sitemap.xml is valid XML and includes every pillar', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')
  const body = await response.text()
  expect(body).toMatch(/^<\?xml /)
  for (const seg of [
    '/ira-rules',
    '/accountability',
    '/economics',
    '/tools',
    '/about',
  ]) {
    expect(body).toContain(seg)
  }
})
