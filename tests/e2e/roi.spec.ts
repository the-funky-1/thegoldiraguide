import { expect, test } from '@playwright/test'

test('roi calculator surfaces net terminal and net CAGR', async ({ page }) => {
  await page.goto('/tools/roi-calculator')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /roi calculator/i,
  )
  await expect(page.getByText(/net terminal/i).first()).toBeVisible()
  await expect(page.getByText(/net cagr/i)).toBeVisible()
})

test('cost acknowledgment gates the result when fees exceed 20% of principal', async ({
  page,
}) => {
  await page.goto('/tools/roi-calculator')
  await page.getByLabel('Purchase spread %').fill('15')
  await page.getByLabel('Liquidation spread %').fill('5')
  await page.getByLabel('Annual fees (USD)').fill('500')
  await expect(page.getByText(/projected total fee burden/i)).toBeVisible()
})
