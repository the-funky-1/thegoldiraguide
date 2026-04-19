import { expect, test } from '@playwright/test'

test('home page renders the canonical H1 and pillar cards', async ({
  page,
}) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('h1')).toHaveText('The Gold IRA Guide')
  for (const label of [
    'IRA Rules',
    'Written Accountability',
    'Precious Metals Economics',
    'Interactive Tools',
    'Institutional Accountability',
  ]) {
    await expect(page.getByRole('link', { name: label })).toBeVisible()
  }
})
