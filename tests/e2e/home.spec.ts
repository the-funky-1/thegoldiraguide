import { expect, test } from '@playwright/test'

test('home page renders the canonical H1 and all key regions', async ({
  page,
}) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  await expect(page.locator('h1')).toHaveText('The Gold IRA Guide')

  // MarketPulseCard (client component) should mount; assert the landmark label
  // rather than wait for a specific price, which is time-sensitive.
  await expect(
    page.getByRole('complementary', { name: /market pulse/i }),
  ).toBeVisible()

  // Site signals strip
  await expect(page.getByLabel(/site signals/i)).toBeVisible()

  // Pillars region with 1 featured h2 + 4 h3s
  const pillars = page.getByRole('region', { name: /pillars/i })
  await expect(pillars).toBeVisible()
  await expect(pillars.locator('h2')).toHaveCount(1)
  await expect(pillars.locator('h3')).toHaveCount(4)

  // Hero CTAs
  await expect(
    page.getByRole('link', { name: /start with ira rules/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /see live spot prices/i }),
  ).toBeVisible()
})
