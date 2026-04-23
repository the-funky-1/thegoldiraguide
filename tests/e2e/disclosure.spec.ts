import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/definitely-not-a-real-page']

for (const route of ROUTES) {
  test(`disclosure banner is visible on ${route}`, async ({ page }) => {
    await page.goto(route)
    const region = page.getByRole('region', { name: /ftc disclosure/i })
    await expect(region).toBeVisible()
    await expect(region).toContainText('Liberty Gold Silver')
    await expect(region).toContainText('No products are sold on this site')
  })
}
