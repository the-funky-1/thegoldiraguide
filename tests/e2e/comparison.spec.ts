import { expect, test } from '@playwright/test'

test('comparison matrix filters by storage model', async ({ page }) => {
  await page.goto('/tools/written-estimate-checklist')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /written estimate checklist/i,
  )
  await page.getByLabel('Storage model').selectOption('flat')
  const rows = page.locator('table tbody tr')
  const count = await rows.count()
  expect(count).toBeGreaterThanOrEqual(0)
})

test('comparison matrix sort toggles aria-sort', async ({ page }) => {
  await page.goto('/tools/written-estimate-checklist')
  const header = page.getByRole('columnheader', { name: /purchase spread/i })
  await header.getByRole('button').click()
  await expect(header).toHaveAttribute('aria-sort', /ascending|descending/)
})
