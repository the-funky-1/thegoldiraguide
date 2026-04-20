import { expect, test } from '@playwright/test'
import { ALL_SEEDS } from '../../src/content/strategic/index'

function routeFor(seed: (typeof ALL_SEEDS)[number]): string {
  return `/${seed.pillar}/${seed.slug}`
}

for (const seed of ALL_SEEDS) {
  const path = routeFor(seed)
  test(`${path} renders h1 + meta description`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    const description = await page
      .locator('meta[name="description"]')
      .first()
      .getAttribute('content')
    expect(description).toBe(seed.metaDescription)
  })
}

test('every FAQPage route emits FAQPage JSON-LD', async ({ page }) => {
  const faqPages = ALL_SEEDS.filter((s) => s.schemaJsonLdType === 'FAQPage')
  for (const seed of faqPages) {
    const path = `/${seed.pillar}/${seed.slug}`
    await page.goto(path)
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const types = scripts.flatMap((raw) => {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.map((p) => p['@type']) : [parsed['@type']]
      } catch {
        return []
      }
    })
    expect(types, `${path} JSON-LD types`).toContain('FAQPage')
  }
})
