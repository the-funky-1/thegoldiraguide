import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ROUTES = [
  '/',
  '/ira-rules',
  '/accountability',
  '/economics',
  '/tools',
  '/about',
  '/about/expert-authors',
  '/about/design-system',
  '/tools/fee-drag-analyzer',
  '/tools/roi-calculator',
  '/tools/written-estimate-checklist',
  '/tools/live-spot-prices',
  '/this-route-does-not-exist',
]

for (const route of ROUTES) {
  test(`zero serious/critical axe violations on ${route}`, async ({ page }) => {
    await page.goto(route)
    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'wcag22aaa',
        'best-practice',
      ])
      .analyze()
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })
}
