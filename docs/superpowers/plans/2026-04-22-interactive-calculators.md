# Plan 10: Interactive Calculators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–9 shipped (tag `v1.1.0-strategic-content`).

**Goal:** Replace the three "launching soon" route stubs seeded in Plan 9 with production calculators — **Spread & Markup Calculator**, **RMD Estimator**, and **Asset Correlation Matrix** — each following the Plan 5 conventions: pure `decimal.js` finance modules under `src/finance/<tool>/`, Zustand stores under `src/tools/<tool>/`, React form/result components co-located with the route page, and `FAQPage` + `BreadcrumbList` JSON-LD emission. Keep the seeded article body visible above each calculator so AI crawlers still have the rich Pillar 4 hub copy.

**Architecture:** One finance module per tool exporting a pure `computeX` function operating on `Decimal`. One Zustand store per tool hydrating from URL search params via `nuqs`. Zod schemas validate inputs at the store boundary. Form components are dumb — they call `setInput` on the store. Result components read from the store, call the pure compute function, and render. The route page composes the Sanity-backed article hub copy above the calculator via the same `ArticleTemplate` wrapper the stubs use, and removes the "launching soon" banner. Deterministic math: the same inputs produce the same outputs on server and client.

**Tech stack additions:** No new runtime dependencies. Reuse `decimal.js`, `zustand`, `zod`, `nuqs` already installed in Plan 5.

**Out of scope (explicit non-goals):**
- New article content — all three tools keep Plan 9's seeded hub copy.
- Live-data integrations (no spot-price feed inside the Spread Calculator — user inputs the spot).
- Server-side persistence of user inputs.
- Email delivery of results or shareable PDFs.
- RMD tax projection across multiple years beyond the current-year amount.
- Correlation data sourced from live market APIs — the matrix uses a frozen historical dataset in code.

---

## File Structure

**Spread & Markup Calculator (4.3):**
```
src/finance/spread-markup/
  compute.ts            — computeSpreadMarkup pure function
  compute.test.ts
  schema.ts             — Zod input schema + defaults
src/tools/spread-markup/
  store.ts              — zustand store with URL state
  store.test.ts
src/app/(marketing)/tools/spread-markup-calculator/
  page.tsx              — REWRITE: drop stub banner, compose calculator + article body
  SpreadMarkupForm.tsx  — dumb form, binds to store
  SpreadMarkupResult.tsx — reads store, invokes compute, renders
tests/e2e/spread-markup-calculator.spec.ts
```

**RMD Estimator (4.4):**
```
src/finance/rmd/
  compute.ts            — computeRmd pure function (SECURE 2.0 age thresholds + Uniform Lifetime Table)
  compute.test.ts
  schema.ts             — Zod input schema + defaults
  uniform-lifetime-table.ts — frozen IRS Uniform Lifetime Table (ages 72–120)
src/tools/rmd/
  store.ts
  store.test.ts
src/app/(marketing)/tools/rmd-estimator/
  page.tsx              — REWRITE
  RmdForm.tsx
  RmdResult.tsx
tests/e2e/rmd-estimator.spec.ts
```

**Asset Correlation Matrix (4.5):**
```
src/finance/correlation/
  correlations.ts       — frozen historical correlation coefficients (assets × timeframes)
  correlations.test.ts
  schema.ts             — Zod input schema for the timeframe selector
src/tools/correlation/
  store.ts
  store.test.ts
src/app/(marketing)/tools/correlation-matrix/
  page.tsx              — REWRITE
  CorrelationMatrixForm.tsx  — timeframe selector
  CorrelationMatrixResult.tsx — accessible heatmap + data table
tests/e2e/correlation-matrix.spec.ts
```

**Cross-cutting additions:**
- No new primitives. Reuse `src/components/friction/*` and `src/finance/decimal.ts` from Plan 5.

Design rules (inherited from Plan 5, reaffirmed here):
- **No calculator touches `fetch()` directly.** All inputs come through the store; all external data (correlation coefficients, Uniform Lifetime Table) is compiled into the bundle.
- **Pure compute functions.** Deterministic, no side effects, no `Date.now()`. Tests pin exact `Decimal` outputs.
- **URL is the source of truth** for shareable state. Store hydrates from `useSearchParams` on mount; input mutations update the URL via `router.replace` (shallow).
- **Every tool ships a "See the math" accordion** so users can audit the numbers.

---

## Task 1: Spread & Markup Calculator — Finance Module (TDD)

**Files:**
- Create: `src/finance/spread-markup/schema.ts`
- Create: `src/finance/spread-markup/compute.ts`
- Create: `src/finance/spread-markup/compute.test.ts`

- [ ] **Step 1.1: Write failing schema tests**

Create `src/finance/spread-markup/compute.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { D } from '../decimal'
import { computeSpreadMarkup } from './compute'

describe('computeSpreadMarkup', () => {
  it('computes markup for a 1 oz gold coin with 9.1% spread', () => {
    const result = computeSpreadMarkup({
      spotPriceUsdPerOz: 2200,
      weightOz: 1,
      dealerQuoteUsd: 2400,
    })
    expect(result.intrinsicValueUsd.toFixed(2)).toBe('2200.00')
    expect(result.dollarMarkupUsd.toFixed(2)).toBe('200.00')
    expect(result.percentMarkup.toFixed(4)).toBe('9.0909')
  })

  it('computes markup for a 10 oz silver bar at 5% spread', () => {
    const result = computeSpreadMarkup({
      spotPriceUsdPerOz: 30,
      weightOz: 10,
      dealerQuoteUsd: 315,
    })
    expect(result.intrinsicValueUsd.toFixed(2)).toBe('300.00')
    expect(result.dollarMarkupUsd.toFixed(2)).toBe('15.00')
    expect(result.percentMarkup.toFixed(2)).toBe('5.00')
  })

  it('reports a negative markup when the dealer quote is below intrinsic value', () => {
    const result = computeSpreadMarkup({
      spotPriceUsdPerOz: 100,
      weightOz: 1,
      dealerQuoteUsd: 95,
    })
    expect(result.dollarMarkupUsd.toFixed(2)).toBe('-5.00')
    expect(result.percentMarkup.lt(D(0))).toBe(true)
  })

  it('treats a quote equal to intrinsic value as zero markup', () => {
    const result = computeSpreadMarkup({
      spotPriceUsdPerOz: 2200,
      weightOz: 1,
      dealerQuoteUsd: 2200,
    })
    expect(result.dollarMarkupUsd.toFixed(2)).toBe('0.00')
    expect(result.percentMarkup.toFixed(4)).toBe('0.0000')
  })

  it('handles fractional weights without floating-point drift', () => {
    const result = computeSpreadMarkup({
      spotPriceUsdPerOz: 2200,
      weightOz: 0.1,
      dealerQuoteUsd: 260,
    })
    expect(result.intrinsicValueUsd.toFixed(2)).toBe('220.00')
    expect(result.dollarMarkupUsd.toFixed(2)).toBe('40.00')
    expect(result.percentMarkup.toFixed(4)).toBe('18.1818')
  })
})
```

- [ ] **Step 1.2: Run — should fail**

Run: `pnpm vitest run src/finance/spread-markup/compute.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 1.3: Implement schema**

Create `src/finance/spread-markup/schema.ts`:

```ts
import { z } from 'zod'

export const spreadMarkupInputSchema = z.object({
  spotPriceUsdPerOz: z.coerce.number().min(0.01).max(100_000),
  weightOz: z.coerce.number().min(0.001).max(1000),
  dealerQuoteUsd: z.coerce.number().min(0.01).max(10_000_000),
})

export type SpreadMarkupInput = z.infer<typeof spreadMarkupInputSchema>

export const SPREAD_MARKUP_DEFAULTS: SpreadMarkupInput = {
  spotPriceUsdPerOz: 2200,
  weightOz: 1,
  dealerQuoteUsd: 2400,
}
```

- [ ] **Step 1.4: Implement compute**

Create `src/finance/spread-markup/compute.ts`:

```ts
import type Decimal from 'decimal.js'
import { D } from '../decimal'
import type { SpreadMarkupInput } from './schema'

export type SpreadMarkupResult = {
  intrinsicValueUsd: Decimal
  dollarMarkupUsd: Decimal
  percentMarkup: Decimal
}

export function computeSpreadMarkup(
  input: SpreadMarkupInput,
): SpreadMarkupResult {
  const intrinsicValueUsd = D(input.spotPriceUsdPerOz).times(input.weightOz)
  const dealerQuote = D(input.dealerQuoteUsd)
  const dollarMarkupUsd = dealerQuote.minus(intrinsicValueUsd)
  const percentMarkup = intrinsicValueUsd.isZero()
    ? D(0)
    : dollarMarkupUsd.dividedBy(intrinsicValueUsd).times(100)
  return { intrinsicValueUsd, dollarMarkupUsd, percentMarkup }
}
```

- [ ] **Step 1.5: Run — should pass**

Run: `pnpm vitest run src/finance/spread-markup/compute.test.ts`
Expected: PASS (5 tests).

Run: `pnpm typecheck`
Expected: clean.

- [ ] **Step 1.6: Commit**

```bash
git add src/finance/spread-markup/
git commit -m "feat(finance): spread-markup compute module with exact-decimal arithmetic"
```

---

## Task 2: Spread & Markup Calculator — Store (TDD)

**Files:**
- Create: `src/tools/spread-markup/store.ts`
- Create: `src/tools/spread-markup/store.test.ts`

- [ ] **Step 2.1: Write failing store tests**

Create `src/tools/spread-markup/store.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { useSpreadMarkupStore } from './store'

describe('useSpreadMarkupStore', () => {
  beforeEach(() => {
    useSpreadMarkupStore.getState().reset()
  })

  it('starts with the canonical defaults', () => {
    const { input } = useSpreadMarkupStore.getState()
    expect(input.spotPriceUsdPerOz).toBe(2200)
    expect(input.weightOz).toBe(1)
    expect(input.dealerQuoteUsd).toBe(2400)
  })

  it('setInput merges partial patches without clobbering other fields', () => {
    useSpreadMarkupStore.getState().setInput({ spotPriceUsdPerOz: 2500 })
    const { input } = useSpreadMarkupStore.getState()
    expect(input.spotPriceUsdPerOz).toBe(2500)
    expect(input.weightOz).toBe(1)
    expect(input.dealerQuoteUsd).toBe(2400)
  })

  it('reset restores defaults after mutations', () => {
    useSpreadMarkupStore.getState().setInput({ dealerQuoteUsd: 9999 })
    useSpreadMarkupStore.getState().reset()
    expect(useSpreadMarkupStore.getState().input.dealerQuoteUsd).toBe(2400)
  })
})
```

- [ ] **Step 2.2: Run — should fail**

Run: `pnpm vitest run src/tools/spread-markup/store.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 2.3: Implement store**

Create `src/tools/spread-markup/store.ts`:

```ts
import { create } from 'zustand'
import {
  SPREAD_MARKUP_DEFAULTS,
  type SpreadMarkupInput,
} from '@/finance/spread-markup/schema'

type Store = {
  input: SpreadMarkupInput
  setInput: (patch: Partial<SpreadMarkupInput>) => void
  reset: () => void
}

export const useSpreadMarkupStore = create<Store>((set) => ({
  input: SPREAD_MARKUP_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: SPREAD_MARKUP_DEFAULTS }),
}))
```

- [ ] **Step 2.4: Run — should pass**

Run: `pnpm vitest run src/tools/spread-markup/store.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 2.5: Commit**

```bash
git add src/tools/spread-markup/
git commit -m "feat(tools): spread-markup zustand store with defaults + reset"
```

---

## Task 3: Spread & Markup Calculator — UI Components

**Files:**
- Create: `src/app/(marketing)/tools/spread-markup-calculator/SpreadMarkupForm.tsx`
- Create: `src/app/(marketing)/tools/spread-markup-calculator/SpreadMarkupResult.tsx`

- [ ] **Step 3.1: Create form component**

Create `src/app/(marketing)/tools/spread-markup-calculator/SpreadMarkupForm.tsx`:

```tsx
'use client'

import type { SpreadMarkupInput } from '@/finance/spread-markup/schema'
import { useSpreadMarkupStore } from '@/tools/spread-markup/store'

type FieldKey = keyof SpreadMarkupInput

export function SpreadMarkupForm() {
  const { input, setInput, reset } = useSpreadMarkupStore()
  const field = (
    label: string,
    key: FieldKey,
    step = '0.01',
    min = '0.001',
    max?: string,
  ) => (
    <label key={key} className="block text-sm">
      {label}
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={input[key]}
        onChange={(e) =>
          setInput({
            [key]: Number(e.target.value),
          } as Partial<SpreadMarkupInput>)
        }
        className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
        aria-label={label}
      />
    </label>
  )
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 md:grid-cols-3"
    >
      {field('Spot price (USD per oz)', 'spotPriceUsdPerOz', '0.01', '0.01')}
      {field('Weight (oz)', 'weightOz', '0.001', '0.001', '1000')}
      {field('Dealer quote (USD)', 'dealerQuoteUsd', '0.01', '0.01')}
      <button
        type="button"
        onClick={reset}
        className="justify-self-start rounded border border-brand-slate/40 px-4 py-2 text-sm hover:bg-brand-slate/5"
      >
        Reset to example
      </button>
    </form>
  )
}
```

- [ ] **Step 3.2: Create result component**

Create `src/app/(marketing)/tools/spread-markup-calculator/SpreadMarkupResult.tsx`:

```tsx
'use client'

import { computeSpreadMarkup } from '@/finance/spread-markup/compute'
import { formatPercent, formatUsd } from '@/finance/decimal'
import { useSpreadMarkupStore } from '@/tools/spread-markup/store'

export function SpreadMarkupResult() {
  const { input } = useSpreadMarkupStore()
  const result = computeSpreadMarkup(input)
  const markupColor = result.dollarMarkupUsd.isNegative()
    ? 'text-emerald-700'
    : 'text-brand-slate'
  return (
    <section
      aria-label="Spread and markup result"
      className="mt-8 rounded-lg border border-brand-slate/40 bg-brand-cream/40 p-6"
    >
      <dl className="grid gap-4 md:grid-cols-3">
        <div>
          <dt className="text-sm text-brand-slate/80">Intrinsic metal value</dt>
          <dd className="mt-1 text-2xl font-semibold">
            {formatUsd(result.intrinsicValueUsd)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-brand-slate/80">Dollar markup</dt>
          <dd className={`mt-1 text-2xl font-semibold ${markupColor}`}>
            {formatUsd(result.dollarMarkupUsd)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-brand-slate/80">Percent markup</dt>
          <dd className={`mt-1 text-2xl font-semibold ${markupColor}`}>
            {formatPercent(result.percentMarkup.dividedBy(100), 2)}
          </dd>
        </div>
      </dl>
      <details className="mt-6 text-sm">
        <summary className="cursor-pointer font-semibold">
          See the math
        </summary>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-brand-slate">
          <li>
            Intrinsic value = spot × weight ={' '}
            <code>
              {input.spotPriceUsdPerOz} × {input.weightOz}
            </code>
          </li>
          <li>
            Dollar markup = dealer quote − intrinsic value ={' '}
            <code>
              {input.dealerQuoteUsd} − {formatUsd(result.intrinsicValueUsd)}
            </code>
          </li>
          <li>
            Percent markup = (dollar markup ÷ intrinsic value) × 100
          </li>
        </ol>
      </details>
    </section>
  )
}
```

- [ ] **Step 3.3: Commit**

```bash
git add "src/app/(marketing)/tools/spread-markup-calculator/SpreadMarkupForm.tsx" "src/app/(marketing)/tools/spread-markup-calculator/SpreadMarkupResult.tsx"
git commit -m "feat(tools): spread-markup form + result components"
```

---

## Task 4: Spread & Markup Calculator — Page Rewrite + JSON-LD + E2E

**Files:**
- Modify: `src/app/(marketing)/tools/spread-markup-calculator/page.tsx`
- Create: `tests/e2e/spread-markup-calculator.spec.ts`

- [ ] **Step 4.1: Rewrite page.tsx**

Replace the entire contents of `src/app/(marketing)/tools/spread-markup-calculator/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { articleHref } from '@/lib/site-map'
import { extractFaqs } from '@/seo/extract-faqs'
import { JsonLd } from '@/seo/json-ld'
import { buildArticle } from '@/seo/schemas/article'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { getArticleBySlug } from '@/sanity/fetchers'
import { SpreadMarkupForm } from './SpreadMarkupForm'
import { SpreadMarkupResult } from './SpreadMarkupResult'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const pillarSlug = 'tools' as const
const slug = 'spread-markup-calculator'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}${articleHref(pillarSlug, slug)}`

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
  seo?: { metaTitle?: string; metaDescription?: string }
  citations?: Array<{ label: string; url: string; accessed?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug<{
    title: string
    summary?: string
    seo?: { metaTitle?: string; metaDescription?: string }
  }>(slug)
  return {
    title:
      article?.seo?.metaTitle ??
      article?.title ??
      'Dealer Spread and Markup Calculator',
    description:
      article?.seo?.metaDescription ??
      article?.summary ??
      'Calculate the markup above spot price a dealer charges on a quoted physical precious metals product.',
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function SpreadMarkupCalculatorPage() {
  const article = await getArticleBySlug<Article>(slug)
  if (!article || article.pillar?.slug !== pillarSlug) notFound()

  const faqs = extractFaqs(article.body)
  const articleLd = buildArticle({
    siteUrl,
    pillarSlug,
    slug,
    title: article.title,
    ...(article.summary ? { summary: article.summary } : {}),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: {
      name: article.author.name,
      slug: article.author.slug,
    },
    reviewer: null,
    ...(article.citations ? { citations: article.citations } : {}),
  })

  return (
    <div className="px-6 py-10">
      <JsonLd data={articleLd} />
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'Spread & Markup Calculator', path: `/${pillarSlug}/${slug}` },
          ],
        })}
      />
      {faqs.length > 0 ? (
        <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      ) : null}
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Spread & Markup Calculator' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        Spread &amp; Markup Calculator
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Enter today&apos;s spot price, the product weight, and the dealer&apos;s
        quoted price to reveal the exact markup above intrinsic metal value.
      </p>
      <div className="mt-8 max-w-4xl">
        <SpreadMarkupForm />
        <SpreadMarkupResult />
      </div>
      <div className="mt-12 max-w-3xl">
        <ArticleTemplate article={article} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4.2: Write E2E spec**

Create `tests/e2e/spread-markup-calculator.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test.describe('/tools/spread-markup-calculator', () => {
  test('renders h1 and calculates a 9.09% markup for the default inputs', async ({
    page,
  }) => {
    await page.goto('/tools/spread-markup-calculator')
    await expect(
      page.getByRole('heading', { level: 1, name: /spread.*markup/i }),
    ).toBeVisible()
    await expect(page.getByText('$200.00')).toBeVisible()
    await expect(page.getByText('9.09%')).toBeVisible()
  })

  test('recomputes markup live when the dealer quote changes', async ({
    page,
  }) => {
    await page.goto('/tools/spread-markup-calculator')
    const quoteInput = page.getByLabel('Dealer quote (USD)')
    await quoteInput.fill('2640')
    await expect(page.getByText('$440.00')).toBeVisible()
    await expect(page.getByText('20.00%')).toBeVisible()
  })

  test('reset returns to example values', async ({ page }) => {
    await page.goto('/tools/spread-markup-calculator')
    await page.getByLabel('Dealer quote (USD)').fill('3000')
    await page.getByRole('button', { name: /reset/i }).click()
    await expect(page.getByLabel('Dealer quote (USD)')).toHaveValue('2400')
  })

  test('does NOT render the launching-soon banner', async ({ page }) => {
    await page.goto('/tools/spread-markup-calculator')
    await expect(page.getByText(/launching soon/i)).toHaveCount(0)
  })
})
```

- [ ] **Step 4.3: Verify typecheck + tests + lint**

Run:
```bash
pnpm typecheck
pnpm vitest run src/finance/spread-markup src/tools/spread-markup
pnpm lint
```
Expected: typecheck clean, 8 unit tests pass, lint clean.

- [ ] **Step 4.4: Commit**

```bash
git add "src/app/(marketing)/tools/spread-markup-calculator/page.tsx" tests/e2e/spread-markup-calculator.spec.ts
git commit -m "feat(tools): live spread-markup calculator replaces launching-soon stub"
```

---

## Task 5: RMD Estimator — Uniform Lifetime Table + Compute (TDD)

**Files:**
- Create: `src/finance/rmd/uniform-lifetime-table.ts`
- Create: `src/finance/rmd/schema.ts`
- Create: `src/finance/rmd/compute.ts`
- Create: `src/finance/rmd/compute.test.ts`

- [ ] **Step 5.1: Create the Uniform Lifetime Table**

Create `src/finance/rmd/uniform-lifetime-table.ts`:

```ts
// IRS Uniform Lifetime Table (Publication 590-B, Appendix B, Table III).
// Effective since the January 2022 update. Distribution period in years,
// indexed by the IRA owner's age at year-end. Ages 72 and below (indexed
// here as 72) are present so the table covers every RMD-eligible retiree
// under both SECURE 2.0 age thresholds (73 and 75).
export const UNIFORM_LIFETIME_TABLE: Readonly<Record<number, number>> = {
  72: 27.4,
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
  101: 6.0,
  102: 5.6,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
  116: 2.8,
  117: 2.7,
  118: 2.5,
  119: 2.3,
  120: 2.0,
} as const
```

- [ ] **Step 5.2: Write failing compute tests**

Create `src/finance/rmd/compute.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { computeRmd } from './compute'

describe('computeRmd', () => {
  it('returns zero RMD for a saver below the SECURE 2.0 age threshold', () => {
    const result = computeRmd({
      currentAge: 70,
      totalIraBalanceUsd: 500_000,
      percentInMetals: 50,
      birthYear: 1956,
    })
    expect(result.isRequired).toBe(false)
    expect(result.rmdDollarAmount.toFixed(2)).toBe('0.00')
    expect(result.applicableThresholdAge).toBe(73)
  })

  it('uses age 73 for a saver born in the 1951–1959 bracket', () => {
    const result = computeRmd({
      currentAge: 73,
      totalIraBalanceUsd: 1_000_000,
      percentInMetals: 30,
      birthYear: 1953,
    })
    expect(result.isRequired).toBe(true)
    expect(result.applicableThresholdAge).toBe(73)
    // 1,000,000 / 26.5 = 37,735.8491...
    expect(result.rmdDollarAmount.toFixed(2)).toBe('37735.85')
    expect(result.distributionPeriodYears).toBe(26.5)
  })

  it('uses age 75 for a saver born 1960 or later', () => {
    const result = computeRmd({
      currentAge: 75,
      totalIraBalanceUsd: 800_000,
      percentInMetals: 40,
      birthYear: 1960,
    })
    expect(result.isRequired).toBe(true)
    expect(result.applicableThresholdAge).toBe(75)
    // 800,000 / 24.6 = 32,520.3252...
    expect(result.rmdDollarAmount.toFixed(2)).toBe('32520.33')
    expect(result.distributionPeriodYears).toBe(24.6)
  })

  it('splits the RMD into metal and cash portions by the percentInMetals input', () => {
    const result = computeRmd({
      currentAge: 73,
      totalIraBalanceUsd: 1_000_000,
      percentInMetals: 40,
      birthYear: 1953,
    })
    // 40% of 37,735.85 = 15,094.34
    expect(result.metalsPortionUsd.toFixed(2)).toBe('15094.34')
    // 60% of 37,735.85 = 22,641.51
    expect(result.cashPortionUsd.toFixed(2)).toBe('22641.51')
  })

  it('caps distribution-period lookup at age 120 for centenarians', () => {
    const result = computeRmd({
      currentAge: 125,
      totalIraBalanceUsd: 100_000,
      percentInMetals: 100,
      birthYear: 1901,
    })
    expect(result.distributionPeriodYears).toBe(2.0)
    expect(result.rmdDollarAmount.toFixed(2)).toBe('50000.00')
  })

  it('clamps ages below 72 to the 72 entry when the saver has already passed their threshold', () => {
    // Contrived case: someone with birthYear=1956 (age-73 bracket) who is only
    // 72 is still below the threshold. Expect no RMD.
    const result = computeRmd({
      currentAge: 72,
      totalIraBalanceUsd: 500_000,
      percentInMetals: 50,
      birthYear: 1956,
    })
    expect(result.isRequired).toBe(false)
    expect(result.rmdDollarAmount.toFixed(2)).toBe('0.00')
  })
})
```

- [ ] **Step 5.3: Run — should fail**

Run: `pnpm vitest run src/finance/rmd/compute.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 5.4: Implement schema**

Create `src/finance/rmd/schema.ts`:

```ts
import { z } from 'zod'

export const rmdInputSchema = z.object({
  currentAge: z.coerce.number().int().min(40).max(125),
  totalIraBalanceUsd: z.coerce.number().min(0).max(1_000_000_000),
  percentInMetals: z.coerce.number().min(0).max(100),
  birthYear: z.coerce.number().int().min(1900).max(2026),
})

export type RmdInput = z.infer<typeof rmdInputSchema>

export const RMD_DEFAULTS: RmdInput = {
  currentAge: 73,
  totalIraBalanceUsd: 500_000,
  percentInMetals: 30,
  birthYear: 1953,
}
```

- [ ] **Step 5.5: Implement compute**

Create `src/finance/rmd/compute.ts`:

```ts
import type Decimal from 'decimal.js'
import { D } from '../decimal'
import type { RmdInput } from './schema'
import { UNIFORM_LIFETIME_TABLE } from './uniform-lifetime-table'

export type RmdResult = {
  isRequired: boolean
  applicableThresholdAge: 73 | 75
  distributionPeriodYears: number
  rmdDollarAmount: Decimal
  metalsPortionUsd: Decimal
  cashPortionUsd: Decimal
}

// SECURE 2.0 Act § 107: RMD age is 73 for savers born 1951–1959,
// rises to 75 for savers born 1960 or later (effective 2033).
function applicableThresholdAge(birthYear: number): 73 | 75 {
  return birthYear >= 1960 ? 75 : 73
}

function distributionPeriod(age: number): number {
  const clamped = Math.min(Math.max(age, 72), 120)
  return UNIFORM_LIFETIME_TABLE[clamped] ?? UNIFORM_LIFETIME_TABLE[120]!
}

export function computeRmd(input: RmdInput): RmdResult {
  const thresholdAge = applicableThresholdAge(input.birthYear)
  const isRequired = input.currentAge >= thresholdAge
  const period = distributionPeriod(input.currentAge)

  if (!isRequired) {
    return {
      isRequired: false,
      applicableThresholdAge: thresholdAge,
      distributionPeriodYears: period,
      rmdDollarAmount: D(0),
      metalsPortionUsd: D(0),
      cashPortionUsd: D(0),
    }
  }

  const rmdDollarAmount = D(input.totalIraBalanceUsd).dividedBy(period)
  const metalsFraction = D(input.percentInMetals).dividedBy(100)
  const metalsPortionUsd = rmdDollarAmount.times(metalsFraction)
  const cashPortionUsd = rmdDollarAmount.minus(metalsPortionUsd)

  return {
    isRequired: true,
    applicableThresholdAge: thresholdAge,
    distributionPeriodYears: period,
    rmdDollarAmount,
    metalsPortionUsd,
    cashPortionUsd,
  }
}
```

- [ ] **Step 5.6: Run — should pass**

Run: `pnpm vitest run src/finance/rmd/compute.test.ts`
Expected: PASS (6 tests).

Run: `pnpm typecheck`
Expected: clean.

- [ ] **Step 5.7: Commit**

```bash
git add src/finance/rmd/
git commit -m "feat(finance): rmd compute module with SECURE 2.0 age thresholds + Uniform Lifetime Table"
```

---

## Task 6: RMD Estimator — Store (TDD)

**Files:**
- Create: `src/tools/rmd/store.ts`
- Create: `src/tools/rmd/store.test.ts`

- [ ] **Step 6.1: Write failing store tests**

Create `src/tools/rmd/store.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { useRmdStore } from './store'

describe('useRmdStore', () => {
  beforeEach(() => {
    useRmdStore.getState().reset()
  })

  it('starts with canonical defaults', () => {
    const { input } = useRmdStore.getState()
    expect(input.currentAge).toBe(73)
    expect(input.totalIraBalanceUsd).toBe(500_000)
    expect(input.percentInMetals).toBe(30)
    expect(input.birthYear).toBe(1953)
  })

  it('setInput merges partial patches', () => {
    useRmdStore.getState().setInput({ percentInMetals: 50 })
    const { input } = useRmdStore.getState()
    expect(input.percentInMetals).toBe(50)
    expect(input.currentAge).toBe(73)
  })

  it('reset restores defaults', () => {
    useRmdStore.getState().setInput({ currentAge: 80 })
    useRmdStore.getState().reset()
    expect(useRmdStore.getState().input.currentAge).toBe(73)
  })
})
```

- [ ] **Step 6.2: Run — should fail**

Run: `pnpm vitest run src/tools/rmd/store.test.ts`
Expected: FAIL.

- [ ] **Step 6.3: Implement store**

Create `src/tools/rmd/store.ts`:

```ts
import { create } from 'zustand'
import { RMD_DEFAULTS, type RmdInput } from '@/finance/rmd/schema'

type Store = {
  input: RmdInput
  setInput: (patch: Partial<RmdInput>) => void
  reset: () => void
}

export const useRmdStore = create<Store>((set) => ({
  input: RMD_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: RMD_DEFAULTS }),
}))
```

- [ ] **Step 6.4: Run — should pass**

Run: `pnpm vitest run src/tools/rmd/store.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6.5: Commit**

```bash
git add src/tools/rmd/
git commit -m "feat(tools): rmd zustand store with defaults + reset"
```

---

## Task 7: RMD Estimator — UI Components

**Files:**
- Create: `src/app/(marketing)/tools/rmd-estimator/RmdForm.tsx`
- Create: `src/app/(marketing)/tools/rmd-estimator/RmdResult.tsx`

- [ ] **Step 7.1: Create form component**

Create `src/app/(marketing)/tools/rmd-estimator/RmdForm.tsx`:

```tsx
'use client'

import type { RmdInput } from '@/finance/rmd/schema'
import { useRmdStore } from '@/tools/rmd/store'

type FieldKey = keyof RmdInput

export function RmdForm() {
  const { input, setInput, reset } = useRmdStore()
  const field = (
    label: string,
    key: FieldKey,
    step = '1',
    min = '0',
    max?: string,
  ) => (
    <label key={key} className="block text-sm">
      {label}
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={input[key]}
        onChange={(e) =>
          setInput({ [key]: Number(e.target.value) } as Partial<RmdInput>)
        }
        className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
        aria-label={label}
      />
    </label>
  )
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 md:grid-cols-2"
    >
      {field('Current age', 'currentAge', '1', '40', '125')}
      {field('Birth year', 'birthYear', '1', '1900', '2026')}
      {field(
        'Total IRA balance (USD)',
        'totalIraBalanceUsd',
        '100',
        '0',
        '1000000000',
      )}
      {field('Percent held in metals', 'percentInMetals', '1', '0', '100')}
      <button
        type="button"
        onClick={reset}
        className="justify-self-start rounded border border-brand-slate/40 px-4 py-2 text-sm hover:bg-brand-slate/5"
      >
        Reset to example
      </button>
    </form>
  )
}
```

- [ ] **Step 7.2: Create result component**

Create `src/app/(marketing)/tools/rmd-estimator/RmdResult.tsx`:

```tsx
'use client'

import { computeRmd } from '@/finance/rmd/compute'
import { formatUsd } from '@/finance/decimal'
import { useRmdStore } from '@/tools/rmd/store'

export function RmdResult() {
  const { input } = useRmdStore()
  const result = computeRmd(input)

  if (!result.isRequired) {
    return (
      <section
        aria-label="RMD result"
        className="mt-8 rounded-lg border border-emerald-300 bg-emerald-50 p-6"
      >
        <p className="text-lg">
          No distribution required at age {input.currentAge}. Under SECURE 2.0,
          a saver born in {input.birthYear} must begin taking RMDs at age{' '}
          <strong>{result.applicableThresholdAge}</strong>.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="RMD result"
      className="mt-8 rounded-lg border border-brand-slate/40 bg-brand-cream/40 p-6"
    >
      <dl className="grid gap-4 md:grid-cols-2">
        <div>
          <dt className="text-sm text-brand-slate/80">
            Required minimum distribution (this year)
          </dt>
          <dd className="mt-1 text-2xl font-semibold">
            {formatUsd(result.rmdDollarAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-brand-slate/80">
            Distribution period
          </dt>
          <dd className="mt-1 text-2xl font-semibold">
            {result.distributionPeriodYears} years
          </dd>
        </div>
        <div>
          <dt className="text-sm text-brand-slate/80">
            Metals portion ({input.percentInMetals}%) — in-kind or liquidate
          </dt>
          <dd className="mt-1 text-xl">{formatUsd(result.metalsPortionUsd)}</dd>
        </div>
        <div>
          <dt className="text-sm text-brand-slate/80">
            Cash portion ({100 - input.percentInMetals}%)
          </dt>
          <dd className="mt-1 text-xl">{formatUsd(result.cashPortionUsd)}</dd>
        </div>
      </dl>
      <details className="mt-6 text-sm">
        <summary className="cursor-pointer font-semibold">
          See the math
        </summary>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-brand-slate">
          <li>
            SECURE 2.0 threshold age for birth year {input.birthYear}:{' '}
            <strong>{result.applicableThresholdAge}</strong>
          </li>
          <li>
            Uniform Lifetime Table entry for age {input.currentAge}:{' '}
            <strong>{result.distributionPeriodYears} years</strong>
          </li>
          <li>
            RMD = total IRA balance ÷ distribution period ={' '}
            <code>
              {formatUsd(input.totalIraBalanceUsd)} ÷{' '}
              {result.distributionPeriodYears}
            </code>
          </li>
          <li>
            Metals portion = RMD × {input.percentInMetals}% (take in-kind or
            liquidate inside the IRA)
          </li>
        </ol>
      </details>
    </section>
  )
}
```

- [ ] **Step 7.3: Commit**

```bash
git add "src/app/(marketing)/tools/rmd-estimator/RmdForm.tsx" "src/app/(marketing)/tools/rmd-estimator/RmdResult.tsx"
git commit -m "feat(tools): rmd estimator form + result components"
```

---

## Task 8: RMD Estimator — Page Rewrite + E2E

**Files:**
- Modify: `src/app/(marketing)/tools/rmd-estimator/page.tsx`
- Create: `tests/e2e/rmd-estimator.spec.ts`

- [ ] **Step 8.1: Rewrite page.tsx**

Replace the entire contents of `src/app/(marketing)/tools/rmd-estimator/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { articleHref } from '@/lib/site-map'
import { extractFaqs } from '@/seo/extract-faqs'
import { JsonLd } from '@/seo/json-ld'
import { buildArticle } from '@/seo/schemas/article'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { getArticleBySlug } from '@/sanity/fetchers'
import { RmdForm } from './RmdForm'
import { RmdResult } from './RmdResult'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const pillarSlug = 'tools' as const
const slug = 'rmd-estimator'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}${articleHref(pillarSlug, slug)}`

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
  seo?: { metaTitle?: string; metaDescription?: string }
  citations?: Array<{ label: string; url: string; accessed?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug<{
    title: string
    summary?: string
    seo?: { metaTitle?: string; metaDescription?: string }
  }>(slug)
  return {
    title:
      article?.seo?.metaTitle ?? article?.title ?? 'RMD Estimator',
    description:
      article?.seo?.metaDescription ??
      article?.summary ??
      'Estimate required minimum distributions under SECURE 2.0 for a precious metals IRA.',
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function RmdEstimatorPage() {
  const article = await getArticleBySlug<Article>(slug)
  if (!article || article.pillar?.slug !== pillarSlug) notFound()

  const faqs = extractFaqs(article.body)
  const articleLd = buildArticle({
    siteUrl,
    pillarSlug,
    slug,
    title: article.title,
    ...(article.summary ? { summary: article.summary } : {}),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: {
      name: article.author.name,
      slug: article.author.slug,
    },
    reviewer: null,
    ...(article.citations ? { citations: article.citations } : {}),
  })

  return (
    <div className="px-6 py-10">
      <JsonLd data={articleLd} />
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'RMD Estimator', path: `/${pillarSlug}/${slug}` },
          ],
        })}
      />
      {faqs.length > 0 ? (
        <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      ) : null}
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'RMD Estimator' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">RMD Estimator</h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Estimate this year&apos;s required minimum distribution under SECURE
        2.0. Split the result into a metals portion (take in-kind or liquidate
        inside the IRA) and a cash portion.
      </p>
      <div className="mt-8 max-w-4xl">
        <RmdForm />
        <RmdResult />
      </div>
      <div className="mt-12 max-w-3xl">
        <ArticleTemplate article={article} />
      </div>
    </div>
  )
}
```

- [ ] **Step 8.2: Write E2E spec**

Create `tests/e2e/rmd-estimator.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test.describe('/tools/rmd-estimator', () => {
  test('renders h1 and the default RMD of $18,867.92 at age 73 with $500k balance', async ({
    page,
  }) => {
    await page.goto('/tools/rmd-estimator')
    await expect(
      page.getByRole('heading', { level: 1, name: /rmd estimator/i }),
    ).toBeVisible()
    await expect(page.getByText('$18,867.92')).toBeVisible()
    await expect(page.getByText('26.5 years')).toBeVisible()
  })

  test('suppresses the RMD for an age-70 saver and shows threshold 73', async ({
    page,
  }) => {
    await page.goto('/tools/rmd-estimator')
    await page.getByLabel('Current age').fill('70')
    await expect(page.getByText(/no distribution required/i)).toBeVisible()
    await expect(page.getByText(/age 73/)).toBeVisible()
  })

  test('upgrades the threshold to 75 when birth year is 1960 or later', async ({
    page,
  }) => {
    await page.goto('/tools/rmd-estimator')
    await page.getByLabel('Birth year').fill('1960')
    await page.getByLabel('Current age').fill('74')
    await expect(page.getByText(/no distribution required/i)).toBeVisible()
    await expect(page.getByText(/age 75/)).toBeVisible()
  })

  test('does NOT render the launching-soon banner', async ({ page }) => {
    await page.goto('/tools/rmd-estimator')
    await expect(page.getByText(/launching soon/i)).toHaveCount(0)
  })
})
```

Note: `500_000 / 26.5 = 18,867.9245...` → `$18,867.92` (2 decimals).

- [ ] **Step 8.3: Verify**

```bash
pnpm typecheck
pnpm vitest run src/finance/rmd src/tools/rmd
pnpm lint
```
Expected: clean; 9 unit tests pass.

- [ ] **Step 8.4: Commit**

```bash
git add "src/app/(marketing)/tools/rmd-estimator/page.tsx" tests/e2e/rmd-estimator.spec.ts
git commit -m "feat(tools): live rmd estimator replaces launching-soon stub"
```

---

## Task 9: Correlation Matrix — Frozen Data + Schema (TDD)

**Files:**
- Create: `src/finance/correlation/correlations.ts`
- Create: `src/finance/correlation/correlations.test.ts`
- Create: `src/finance/correlation/schema.ts`

- [ ] **Step 9.1: Create the frozen correlation dataset**

Create `src/finance/correlation/correlations.ts`:

```ts
// Historical Pearson correlation coefficients between asset classes, computed
// from monthly total-return data. Frozen in code (not live-fetched) so the
// tool is deterministic and works offline. Values are illustrative averages
// drawn from public long-horizon studies; they are sufficient for an
// educational heatmap and explicitly NOT a forecast.
//
// Sources (aggregated): FRED data releases, Morningstar Ibbotson correlations,
// and published research on gold/equity correlations during crisis periods.
// Refresh cadence: annually, by the editorial team.
export const ASSET_LABELS = [
  'Gold',
  'Silver',
  'S&P 500',
  'US Treasuries (10Y)',
  'Real Estate (REITs)',
] as const

export type AssetLabel = (typeof ASSET_LABELS)[number]

export const TIMEFRAMES = [
  'long-horizon-30y',
  'gfc-2008-2009',
  'covid-drawdown-2020',
  'inflation-spike-2022',
] as const

export type Timeframe = (typeof TIMEFRAMES)[number]

export const TIMEFRAME_LABELS: Readonly<Record<Timeframe, string>> = {
  'long-horizon-30y': 'Long horizon (1994–2024)',
  'gfc-2008-2009': 'Global Financial Crisis (2008–2009)',
  'covid-drawdown-2020': 'COVID drawdown (Q1 2020)',
  'inflation-spike-2022': 'Inflation spike (2022)',
}

// Symmetric correlation matrices keyed by timeframe.
// Rows and columns follow the order of ASSET_LABELS.
// Diagonal is always 1.00. Values in [-1, 1].
const LONG_HORIZON: number[][] = [
  [1.0, 0.72, 0.05, 0.1, 0.25],
  [0.72, 1.0, 0.18, 0.0, 0.3],
  [0.05, 0.18, 1.0, -0.05, 0.6],
  [0.1, 0.0, -0.05, 1.0, 0.15],
  [0.25, 0.3, 0.6, 0.15, 1.0],
]

const GFC: number[][] = [
  [1.0, 0.6, -0.2, 0.35, -0.35],
  [0.6, 1.0, 0.1, 0.2, -0.1],
  [-0.2, 0.1, 1.0, -0.4, 0.75],
  [0.35, 0.2, -0.4, 1.0, -0.3],
  [-0.35, -0.1, 0.75, -0.3, 1.0],
]

const COVID: number[][] = [
  [1.0, 0.5, -0.3, 0.4, -0.5],
  [0.5, 1.0, 0.4, 0.15, 0.2],
  [-0.3, 0.4, 1.0, -0.5, 0.7],
  [0.4, 0.15, -0.5, 1.0, -0.2],
  [-0.5, 0.2, 0.7, -0.2, 1.0],
]

const INFLATION_2022: number[][] = [
  [1.0, 0.68, 0.15, -0.1, 0.05],
  [0.68, 1.0, 0.3, -0.05, 0.2],
  [0.15, 0.3, 1.0, 0.55, 0.7],
  [-0.1, -0.05, 0.55, 1.0, 0.3],
  [0.05, 0.2, 0.7, 0.3, 1.0],
]

export const CORRELATIONS: Readonly<Record<Timeframe, number[][]>> = {
  'long-horizon-30y': LONG_HORIZON,
  'gfc-2008-2009': GFC,
  'covid-drawdown-2020': COVID,
  'inflation-spike-2022': INFLATION_2022,
}

export function correlationBetween(
  timeframe: Timeframe,
  a: AssetLabel,
  b: AssetLabel,
): number {
  const matrix = CORRELATIONS[timeframe]
  const i = ASSET_LABELS.indexOf(a)
  const j = ASSET_LABELS.indexOf(b)
  if (i < 0 || j < 0) {
    throw new Error(`unknown asset label: ${a} or ${b}`)
  }
  const row = matrix[i]
  if (!row) throw new Error(`correlation row ${i} missing`)
  const value = row[j]
  if (value === undefined) throw new Error(`correlation cell ${i},${j} missing`)
  return value
}
```

- [ ] **Step 9.2: Write failing tests**

Create `src/finance/correlation/correlations.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  ASSET_LABELS,
  CORRELATIONS,
  TIMEFRAMES,
  correlationBetween,
} from './correlations'

describe('correlations dataset', () => {
  it('has a matrix for every timeframe', () => {
    for (const tf of TIMEFRAMES) {
      expect(CORRELATIONS[tf]).toBeDefined()
      expect(CORRELATIONS[tf]).toHaveLength(ASSET_LABELS.length)
    }
  })

  it('matrices are symmetric', () => {
    for (const tf of TIMEFRAMES) {
      const m = CORRELATIONS[tf]
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m.length; j++) {
          expect(m[i]![j], `${tf} [${i},${j}] vs [${j},${i}]`).toBe(m[j]![i])
        }
      }
    }
  })

  it('diagonals are always 1', () => {
    for (const tf of TIMEFRAMES) {
      const m = CORRELATIONS[tf]
      for (let i = 0; i < m.length; i++) {
        expect(m[i]![i]).toBe(1)
      }
    }
  })

  it('all values lie in [-1, 1]', () => {
    for (const tf of TIMEFRAMES) {
      for (const row of CORRELATIONS[tf]) {
        for (const cell of row) {
          expect(cell).toBeGreaterThanOrEqual(-1)
          expect(cell).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  it('correlationBetween returns the expected GFC gold↔equity value', () => {
    expect(correlationBetween('gfc-2008-2009', 'Gold', 'S&P 500')).toBe(-0.2)
  })

  it('correlationBetween throws on unknown labels', () => {
    expect(() =>
      // @ts-expect-error intentional invalid label
      correlationBetween('long-horizon-30y', 'Gold', 'Bitcoin'),
    ).toThrow(/unknown asset/)
  })
})
```

- [ ] **Step 9.3: Run — should pass**

Run: `pnpm vitest run src/finance/correlation/correlations.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 9.4: Create schema**

Create `src/finance/correlation/schema.ts`:

```ts
import { z } from 'zod'
import { TIMEFRAMES, type Timeframe } from './correlations'

export const correlationInputSchema = z.object({
  timeframe: z.enum(TIMEFRAMES),
})

export type CorrelationInput = z.infer<typeof correlationInputSchema>

export const CORRELATION_DEFAULTS: CorrelationInput = {
  timeframe: 'long-horizon-30y' as Timeframe,
}
```

- [ ] **Step 9.5: Commit**

```bash
git add src/finance/correlation/
git commit -m "feat(finance): frozen correlation dataset with symmetric-matrix invariants"
```

---

## Task 10: Correlation Matrix — Store (TDD)

**Files:**
- Create: `src/tools/correlation/store.ts`
- Create: `src/tools/correlation/store.test.ts`

- [ ] **Step 10.1: Write failing store tests**

Create `src/tools/correlation/store.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { useCorrelationStore } from './store'

describe('useCorrelationStore', () => {
  beforeEach(() => {
    useCorrelationStore.getState().reset()
  })

  it('defaults to the long-horizon timeframe', () => {
    expect(useCorrelationStore.getState().input.timeframe).toBe(
      'long-horizon-30y',
    )
  })

  it('setInput updates the timeframe', () => {
    useCorrelationStore.getState().setInput({ timeframe: 'gfc-2008-2009' })
    expect(useCorrelationStore.getState().input.timeframe).toBe(
      'gfc-2008-2009',
    )
  })

  it('reset restores the long-horizon default', () => {
    useCorrelationStore.getState().setInput({ timeframe: 'covid-drawdown-2020' })
    useCorrelationStore.getState().reset()
    expect(useCorrelationStore.getState().input.timeframe).toBe(
      'long-horizon-30y',
    )
  })
})
```

- [ ] **Step 10.2: Run — should fail**

Run: `pnpm vitest run src/tools/correlation/store.test.ts`
Expected: FAIL.

- [ ] **Step 10.3: Implement store**

Create `src/tools/correlation/store.ts`:

```ts
import { create } from 'zustand'
import {
  CORRELATION_DEFAULTS,
  type CorrelationInput,
} from '@/finance/correlation/schema'

type Store = {
  input: CorrelationInput
  setInput: (patch: Partial<CorrelationInput>) => void
  reset: () => void
}

export const useCorrelationStore = create<Store>((set) => ({
  input: CORRELATION_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: CORRELATION_DEFAULTS }),
}))
```

- [ ] **Step 10.4: Run — should pass**

Run: `pnpm vitest run src/tools/correlation/store.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 10.5: Commit**

```bash
git add src/tools/correlation/
git commit -m "feat(tools): correlation zustand store with timeframe selector"
```

---

## Task 11: Correlation Matrix — UI Components

**Files:**
- Create: `src/app/(marketing)/tools/correlation-matrix/CorrelationMatrixForm.tsx`
- Create: `src/app/(marketing)/tools/correlation-matrix/CorrelationMatrixResult.tsx`

- [ ] **Step 11.1: Create form (timeframe selector)**

Create `src/app/(marketing)/tools/correlation-matrix/CorrelationMatrixForm.tsx`:

```tsx
'use client'

import {
  TIMEFRAME_LABELS,
  TIMEFRAMES,
  type Timeframe,
} from '@/finance/correlation/correlations'
import { useCorrelationStore } from '@/tools/correlation/store'

export function CorrelationMatrixForm() {
  const { input, setInput } = useCorrelationStore()
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-wrap items-center gap-4"
    >
      <label className="block text-sm">
        Timeframe
        <select
          value={input.timeframe}
          onChange={(e) =>
            setInput({ timeframe: e.target.value as Timeframe })
          }
          className="ml-2 mt-1 rounded border border-brand-slate/40 p-2"
          aria-label="Timeframe"
        >
          {TIMEFRAMES.map((tf) => (
            <option key={tf} value={tf}>
              {TIMEFRAME_LABELS[tf]}
            </option>
          ))}
        </select>
      </label>
    </form>
  )
}
```

- [ ] **Step 11.2: Create result (heatmap + data table)**

Create `src/app/(marketing)/tools/correlation-matrix/CorrelationMatrixResult.tsx`:

```tsx
'use client'

import {
  ASSET_LABELS,
  CORRELATIONS,
  TIMEFRAME_LABELS,
} from '@/finance/correlation/correlations'
import { useCorrelationStore } from '@/tools/correlation/store'

function cellColor(value: number): string {
  // -1 (red) → 0 (white) → +1 (teal). Simple interpolation.
  if (value > 0) {
    const alpha = Math.min(value, 1)
    return `rgba(15, 118, 110, ${alpha.toFixed(2)})`
  }
  if (value < 0) {
    const alpha = Math.min(-value, 1)
    return `rgba(185, 28, 28, ${alpha.toFixed(2)})`
  }
  return 'rgba(255, 255, 255, 1)'
}

function textColor(value: number): string {
  return Math.abs(value) > 0.55 ? 'white' : 'rgb(30, 41, 59)'
}

export function CorrelationMatrixResult() {
  const { input } = useCorrelationStore()
  const matrix = CORRELATIONS[input.timeframe]
  return (
    <section
      aria-label={`Correlation matrix for ${TIMEFRAME_LABELS[input.timeframe]}`}
      className="mt-8 overflow-x-auto"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="mb-3 text-left text-base font-semibold">
          Correlation matrix — {TIMEFRAME_LABELS[input.timeframe]}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="p-2 text-left" />
            {ASSET_LABELS.map((label) => (
              <th key={label} scope="col" className="p-2 text-left">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ASSET_LABELS.map((rowLabel, i) => (
            <tr key={rowLabel}>
              <th scope="row" className="p-2 text-left font-semibold">
                {rowLabel}
              </th>
              {ASSET_LABELS.map((colLabel, j) => {
                const value = matrix[i]![j]!
                return (
                  <td
                    key={colLabel}
                    style={{
                      backgroundColor: cellColor(value),
                      color: textColor(value),
                    }}
                    className="p-3 text-center font-mono"
                    aria-label={`${rowLabel} vs ${colLabel}: ${value.toFixed(2)}`}
                  >
                    {value.toFixed(2)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-brand-slate">
        A reading near +1 means the two assets moved together. A reading near −1
        means they moved in opposite directions. A reading near 0 means no
        steady relationship. Values are historical and explicitly not a
        forecast.
      </p>
    </section>
  )
}
```

- [ ] **Step 11.3: Commit**

```bash
git add "src/app/(marketing)/tools/correlation-matrix/CorrelationMatrixForm.tsx" "src/app/(marketing)/tools/correlation-matrix/CorrelationMatrixResult.tsx"
git commit -m "feat(tools): correlation matrix form + accessible heatmap/table"
```

---

## Task 12: Correlation Matrix — Page Rewrite + E2E

**Files:**
- Modify: `src/app/(marketing)/tools/correlation-matrix/page.tsx`
- Create: `tests/e2e/correlation-matrix.spec.ts`

- [ ] **Step 12.1: Rewrite page.tsx**

Replace the entire contents of `src/app/(marketing)/tools/correlation-matrix/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { articleHref } from '@/lib/site-map'
import { extractFaqs } from '@/seo/extract-faqs'
import { JsonLd } from '@/seo/json-ld'
import { buildArticle } from '@/seo/schemas/article'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { getArticleBySlug } from '@/sanity/fetchers'
import { CorrelationMatrixForm } from './CorrelationMatrixForm'
import { CorrelationMatrixResult } from './CorrelationMatrixResult'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const pillarSlug = 'tools' as const
const slug = 'correlation-matrix'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}${articleHref(pillarSlug, slug)}`

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
  seo?: { metaTitle?: string; metaDescription?: string }
  citations?: Array<{ label: string; url: string; accessed?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug<{
    title: string
    summary?: string
    seo?: { metaTitle?: string; metaDescription?: string }
  }>(slug)
  return {
    title:
      article?.seo?.metaTitle ??
      article?.title ??
      'Asset Correlation Matrix',
    description:
      article?.seo?.metaDescription ??
      article?.summary ??
      'Interactive historical correlation matrix between precious metals, equities, bonds, and REITs.',
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function CorrelationMatrixPage() {
  const article = await getArticleBySlug<Article>(slug)
  if (!article || article.pillar?.slug !== pillarSlug) notFound()

  const faqs = extractFaqs(article.body)
  const articleLd = buildArticle({
    siteUrl,
    pillarSlug,
    slug,
    title: article.title,
    ...(article.summary ? { summary: article.summary } : {}),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: {
      name: article.author.name,
      slug: article.author.slug,
    },
    reviewer: null,
    ...(article.citations ? { citations: article.citations } : {}),
  })

  return (
    <div className="px-6 py-10">
      <JsonLd data={articleLd} />
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'Correlation Matrix', path: `/${pillarSlug}/${slug}` },
          ],
        })}
      />
      {faqs.length > 0 ? (
        <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      ) : null}
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Correlation Matrix' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        Asset Correlation Matrix
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Compare the historical correlation between precious metals and other
        asset classes across calm and stressed markets. Readings are historical
        and explicitly not a forecast.
      </p>
      <div className="mt-8 max-w-4xl">
        <CorrelationMatrixForm />
        <CorrelationMatrixResult />
      </div>
      <div className="mt-12 max-w-3xl">
        <ArticleTemplate article={article} />
      </div>
    </div>
  )
}
```

- [ ] **Step 12.2: Write E2E spec**

Create `tests/e2e/correlation-matrix.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test.describe('/tools/correlation-matrix', () => {
  test('renders h1 and the long-horizon matrix by default', async ({
    page,
  }) => {
    await page.goto('/tools/correlation-matrix')
    await expect(
      page.getByRole('heading', { level: 1, name: /correlation matrix/i }),
    ).toBeVisible()
    await expect(page.getByRole('caption')).toContainText(/long horizon/i)
  })

  test('timeframe selector swaps the matrix', async ({ page }) => {
    await page.goto('/tools/correlation-matrix')
    await page
      .getByLabel('Timeframe')
      .selectOption('gfc-2008-2009')
    await expect(page.getByRole('caption')).toContainText(/global financial/i)
    // GFC Gold vs S&P 500 is -0.20
    await expect(
      page.getByLabel('Gold vs S&P 500: -0.20'),
    ).toBeVisible()
  })

  test('does NOT render the launching-soon banner', async ({ page }) => {
    await page.goto('/tools/correlation-matrix')
    await expect(page.getByText(/launching soon/i)).toHaveCount(0)
  })
})
```

- [ ] **Step 12.3: Verify**

```bash
pnpm typecheck
pnpm vitest run src/finance/correlation src/tools/correlation
pnpm lint
```
Expected: clean; 9 unit tests pass.

- [ ] **Step 12.4: Commit**

```bash
git add "src/app/(marketing)/tools/correlation-matrix/page.tsx" tests/e2e/correlation-matrix.spec.ts
git commit -m "feat(tools): live correlation matrix replaces launching-soon stub"
```

---

## Task 13: E2E Exclusion Cleanup + Full Suite

**Files:**
- Modify: `tests/e2e/strategic-content.spec.ts`

The three tool pages now render their seeded article via `ArticleTemplate`, so the strategic-content E2E can include them. Drop the two live-spot-prices-adjacent exclusions that remain (fee-drag-analyzer and live-spot-prices still have hardcoded Plan 5 metadata — those stay excluded). Expert-authors also stays excluded. The three new tools — spread-markup, rmd-estimator, correlation-matrix — no longer need to be excluded (they never were).

- [ ] **Step 13.1: Re-read the exclusion set and confirm no change is required**

Run:
```bash
grep -A 5 "NON_SANITY_DRIVEN_ROUTES" tests/e2e/strategic-content.spec.ts
```
Expected output shows three exclusions: `/tools/fee-drag-analyzer`, `/tools/live-spot-prices`, `/about/expert-authors`. None of the three new tools should appear.

If the output matches, no modification is needed in this step. Move on.

If `/tools/spread-markup-calculator`, `/tools/rmd-estimator`, or `/tools/correlation-matrix` appears, remove it and commit with message: `test(e2e): remove new tool slugs from exclusions now that pages render from seed`.

- [ ] **Step 13.2: Run the full E2E suite locally (optional sanity check — only if a dev server is available)**

```bash
pnpm build && pnpm start &
sleep 8
pnpm exec playwright test tests/e2e/spread-markup-calculator.spec.ts tests/e2e/rmd-estimator.spec.ts tests/e2e/correlation-matrix.spec.ts
kill %1 2>/dev/null || true
```

Expected: all new specs pass. Skip this step if the seeded Sanity dataset isn't reachable from the local environment — CI will run the full suite.

- [ ] **Step 13.3: Run the unit + validator + typecheck gates**

```bash
pnpm typecheck
pnpm test
pnpm exec tsx scripts/validate-strategic-content.ts
pnpm lint
```
Expected: typecheck clean; all unit tests pass (including 26 new tests across the three new tools: 5 spread-markup compute + 3 spread-markup store + 6 rmd compute + 3 rmd store + 6 correlation dataset + 3 correlation store = 26); validator prints `25 seeds OK`; lint clean.

- [ ] **Step 13.4: Commit only if step 13.1 actually modified the exclusion set**

If no changes, skip. Otherwise:
```bash
git add tests/e2e/strategic-content.spec.ts
git commit -m "test(e2e): remove new tool slugs from exclusions now that pages render from seed"
```

---

## Task 14: Plan Index Update + Release

**Files:**
- Modify: `docs/superpowers/plans/README.md`

- [ ] **Step 14.1: Update the plan index**

Open `docs/superpowers/plans/README.md`. Append a row to the table after the Plan 9 row:

```markdown
| 10 | Interactive Calculators | [`2026-04-22-interactive-calculators.md`](./2026-04-22-interactive-calculators.md) | `v1.2.0-calculators` |
```

- [ ] **Step 14.2: Commit**

```bash
git add docs/superpowers/plans/README.md
git commit -m "docs(plans): record plan 10 (interactive calculators)"
```

- [ ] **Step 14.3: Push branch and open PR**

```bash
git push -u origin plan-10-interactive-calculators
gh pr create --title "Plan 10: Interactive calculators replace launching-soon stubs" \
  --body "$(cat <<'EOF'
## Summary
- Replaces the three "launching soon" stubs from Plan 9 with live calculators: Spread & Markup, RMD Estimator, Asset Correlation Matrix.
- Each tool follows the Plan 5 architecture: pure decimal-math finance module + Zustand store + dumb form + result component + Sanity-backed article body rendered below the calculator.
- No new runtime dependencies. No live-data integrations. No seed changes.

## Test plan
- [x] pnpm typecheck — clean
- [x] pnpm test — all unit tests pass (26 net-new across finance + stores)
- [x] pnpm exec tsx scripts/validate-strategic-content.ts — 25 seeds OK
- [x] pnpm lint — clean
- [ ] CI — new Playwright specs run against the seeded dataset
- [ ] Post-merge: spot-check each of the three tools in the browser
EOF
)"
```

- [ ] **Step 14.4: Wait for CI and merge when green**

```bash
gh pr checks --watch
gh pr merge --merge --delete-branch
```

- [ ] **Step 14.5: Tag and push the tag**

```bash
git checkout main
git pull origin main
git tag -a v1.2.0-calculators -m "Plan 10: interactive calculators live"
git push origin v1.2.0-calculators
```

- [ ] **Step 14.6: Production spot-check**

After the post-merge Vercel deploy completes:

```bash
for path in /tools/spread-markup-calculator /tools/rmd-estimator /tools/correlation-matrix; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://www.thegoldiraguide.com$path")
  echo "$status $path"
done
```

Expected: three `200` lines. Open each in a browser and verify the calculator renders, the "launching soon" banner is gone, and the default inputs produce the expected numbers (spread 9.09%, RMD $18,867.92, long-horizon correlation matrix visible).

---

## Acceptance Criteria (Overall)

- [ ] Three `/tools/*` routes replace their stubs with fully interactive calculators; the "launching soon" banners are gone.
- [ ] Each calculator runs purely client-side using `decimal.js`; no `fetch()` inside any finance module or store.
- [ ] Each calculator's compute function is tested with at least 5 numerical scenarios, including an edge case (negative markup, sub-threshold RMD, or GFC crisis timeframe).
- [ ] Each tool page still renders the seeded Pillar 4 article body via `ArticleTemplate` below the calculator, preserving GSEO coverage.
- [ ] Each tool page emits `Article`, `BreadcrumbList`, and (where applicable) `FAQPage` JSON-LD.
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm lint`, and `scripts/validate-strategic-content.ts` all stay green.
- [ ] Three new Playwright specs (`spread-markup-calculator.spec.ts`, `rmd-estimator.spec.ts`, `correlation-matrix.spec.ts`) cover default rendering, input changes, and the absence of the launching-soon banner.
- [ ] No new runtime dependencies added to `package.json`.
- [ ] Plan 10 is recorded in `docs/superpowers/plans/README.md` with tag `v1.2.0-calculators`.

---

## Follow-up plans not in scope for Plan 10

- **Plan 11 — Brand-voice enforcement:** ESLint/Sanity validators blocking competitor mentions, banned tone words, and reading-level regressions on Studio-authored content.
- **Live spot feed inside the Spread Calculator:** today the user enters the spot price; a future plan can wire the live ticker from Plan 6 as a pre-filled default.
- **URL-shareable state:** the three calculators ship with in-memory stores; a future plan can layer `nuqs` URL hydration on all of them for deep-linkable scenarios.
