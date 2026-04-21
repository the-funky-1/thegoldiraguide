import { expect, test } from '@playwright/test'
import { ALL_SEEDS } from '../../src/content/strategic/index'

function routeFor(seed: (typeof ALL_SEEDS)[number]): string {
  return `/${seed.pillar}/${seed.slug}`
}

// Seeds whose slugs collide with pre-existing routes that aren't Sanity-driven:
// - tools/fee-drag-analyzer: Plan 5 tool page with its own hardcoded metadata.
// - tools/spot-price-dashboard: the live tool ships at /tools/live-spot-prices,
//   not this slug — the seed is for llms.txt discoverability only.
// - about/expert-authors: Plan 3 owns /about/expert-authors as the authors
//   index; the seeded article is not meant to replace that index page.
// These seeds exist in Sanity for generative-SEO coverage (llms.txt / .md mirror
// endpoints), but the rendered /pillar/slug route is not driven by the seed.
const NON_SANITY_DRIVEN_ROUTES = new Set<string>([
  '/tools/fee-drag-analyzer',
  '/tools/spot-price-dashboard',
  '/about/expert-authors',
])

const SANITY_DRIVEN_SEEDS = ALL_SEEDS.filter(
  (seed) => !NON_SANITY_DRIVEN_ROUTES.has(routeFor(seed)),
)

for (const seed of SANITY_DRIVEN_SEEDS) {
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
  const faqPages = SANITY_DRIVEN_SEEDS.filter(
    (s) => s.schemaJsonLdType === 'FAQPage',
  )
  for (const seed of faqPages) {
    const path = `/${seed.pillar}/${seed.slug}`
    await page.goto(path)
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const types = scripts.flatMap((raw) => {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed)
          ? parsed.map((p) => p['@type'])
          : [parsed['@type']]
      } catch {
        return []
      }
    })
    expect(types, `${path} JSON-LD types`).toContain('FAQPage')
  }
})
