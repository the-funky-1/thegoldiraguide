import { expect, test } from '@playwright/test'

test('fee drag analyzer renders the balance figure + companion table', async ({
  page,
}) => {
  await page.goto('/tools/fee-drag-analyzer')
  const figure = page.getByRole('figure', { name: /balance trajectory/i })
  await expect(figure).toBeVisible()
  // Collapsible starts open — table should already be visible.
  await expect(
    page.getByRole('table', { name: /balance trajectory/i }),
  ).toBeVisible()
})

test('fee drag analyzer renders the cost-attribution waterfall', async ({
  page,
}) => {
  await page.goto('/tools/fee-drag-analyzer')
  await expect(
    page.getByRole('figure', { name: /cost attribution/i }),
  ).toBeVisible()
})

test('live spot prices page renders the 30-day history chart or graceful fallback', async ({
  page,
}) => {
  await page.goto('/tools/live-spot-prices')
  const figure = page.getByRole('figure', {
    name: /30-day spot price history/i,
  })
  const fallback = page.getByTestId('history-unavailable')
  await expect(figure.or(fallback)).toBeVisible({ timeout: 20_000 })
})
