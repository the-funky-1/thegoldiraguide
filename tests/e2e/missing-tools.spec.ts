import { expect, test } from '@playwright/test'

test('spread markup calculator computes quoted spread', async ({ page }) => {
  await page.goto('/tools/spread-markup-calculator')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /dealer spread and markup calculator/i,
    }),
  ).toBeVisible()
  await page.getByLabel('Spot price per ounce (USD)').fill('2500')
  await page.getByLabel('Product ounces').fill('1')
  await page.getByLabel('Quantity').fill('10')
  await page.getByLabel('Quoted unit price (USD)').fill('2650')
  await expect(page.getByText('$1,500.00').first()).toBeVisible()
  await expect(page.getByText('6.00%').first()).toBeVisible()
})

test('rmd estimator computes an IRS table divisor estimate', async ({ page }) => {
  await page.goto('/tools/rmd-estimator')
  await page.getByLabel('Birth year').fill('1953')
  await page.getByLabel('Distribution year').fill('2026')
  await page.getByLabel('Prior year-end IRA value (USD)').fill('100000')
  await expect(page.getByText('$3,773.58').first()).toBeVisible()
  await expect(page.getByText('26.5').first()).toBeVisible()
})

test('correlation matrix switches sample windows', async ({ page }) => {
  await page.goto('/tools/correlation-matrix')
  await expect(
    page.getByRole('heading', { level: 1, name: /correlation matrix/i }),
  ).toBeVisible()
  await page.getByLabel('Sample window').selectOption('stress')
  await expect(page.getByText(/equity drawdown months/i)).toBeVisible()
  await expect(page.getByRole('table')).toBeVisible()
})
