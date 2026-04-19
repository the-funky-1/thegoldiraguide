import { expect, test } from '@playwright/test'

test('/llms.txt is text/plain, starts with H1, and lists every pillar', async ({
  request,
}) => {
  const response = await request.get('/llms.txt')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  const body = await response.text()
  expect(body).toMatch(/^# The Gold IRA Guide/)
  expect(body).toContain('> ')
  for (const pillar of [
    'IRA Rules',
    'Accountability',
    'Economics',
    'Tools',
    'About',
  ]) {
    expect(body).toContain(pillar)
  }
})

test('/llms-full.txt is text/plain', async ({ request }) => {
  const response = await request.get('/llms-full.txt')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  const body = await response.text()
  expect(body.length).toBeGreaterThan(20)
  // If any article exists, there should be at least one separator block.
  if (body.includes('\n# ')) {
    expect(body).toContain('\n---\n')
  }
})
