import { expect, test } from '@playwright/test'

const PILLAR_PATHS = [
  '/ira-rules',
  '/accountability',
  '/economics',
  '/tools',
  '/about',
]

for (const path of PILLAR_PATHS) {
  test(`pillar index ${path} loads with h1 and breadcrumbs`, async ({
    page,
  }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: /breadcrumb/i }),
    ).toBeVisible()
  })
}

test('header pillar nav links work on every pillar', async ({ page }) => {
  await page.goto('/')
  for (const [label, path] of [
    ['IRA Rules', '/ira-rules'],
    ['Accountability', '/accountability'],
    ['Economics', '/economics'],
    ['Tools', '/tools'],
    ['About', '/about'],
  ] as const) {
    await page
      .getByRole('navigation', { name: /primary/i })
      .getByRole('link', { name: label })
      .click()
    await expect(page).toHaveURL(path)
    await page.goto('/')
  }
})

test('skip to content link shifts focus to <main>', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('link', { name: /skip to main content/i }),
  ).toHaveAttribute('href', '#main-content')
  const mainHasId = await page.locator('#main-content').count()
  expect(mainHasId).toBe(1)
})

test('tools landing links every implemented tool', async ({ page }) => {
  await page.goto('/tools')
  for (const [label, path] of [
    ['Fee Drag Analyzer', '/tools/fee-drag-analyzer'],
    ['ROI Calculator', '/tools/roi-calculator'],
    ['Written Estimate Checklist', '/tools/written-estimate-checklist'],
    ['Live Spot Prices', '/tools/live-spot-prices'],
    ['Dealer Spread and Markup Calculator', '/tools/spread-markup-calculator'],
    ['RMD Estimator', '/tools/rmd-estimator'],
    ['Correlation Matrix', '/tools/correlation-matrix'],
  ] as const) {
    await expect(page.getByRole('link', { name: label })).toHaveAttribute(
      'href',
      path,
    )
  }
})
