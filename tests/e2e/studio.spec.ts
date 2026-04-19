import { expect, test } from '@playwright/test'

test('studio root responds 200 and loads the Sanity app shell', async ({
  page,
}) => {
  const response = await page.goto('/studio')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(/The Gold IRA Guide|Sanity/i)
})
