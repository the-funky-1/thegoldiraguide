import { expect, test } from '@playwright/test'

test('home page renders the canonical H1', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('h1')).toHaveText('The Gold IRA Guide')
})
