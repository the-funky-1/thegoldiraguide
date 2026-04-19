import { expect, test } from '@playwright/test'

test('fee drag analyzer recalculates on input change', async ({ page }) => {
  await page.goto('/tools/fee-drag-analyzer')
  await expect(
    page.getByRole('heading', { level: 1, name: /fee drag analyzer/i }),
  ).toBeVisible()

  const horizon = page.getByLabel('Horizon (years)')
  await horizon.fill('30')
  await expect(page.getByText('Flat-rate ending balance')).toBeVisible()
  await expect(page.getByRole('cell', { name: '30' }).first()).toBeVisible()
})

test('fee drag analyzer has a FAQ schema block', async ({ request }) => {
  const res = await request.get('/tools/fee-drag-analyzer')
  const html = await res.text()
  expect(html).toContain('"@type":"FAQPage"')
  expect(html).toContain('How is fee drag calculated?')
})
