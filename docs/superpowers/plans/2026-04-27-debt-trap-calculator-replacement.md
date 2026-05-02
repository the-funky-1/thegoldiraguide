# U.S. Debt Trap Calculator (Replaces Dealer Spread Calculator) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the Dealer Spread and Markup Calculator and ship a U.S. Debt Trap Calculator in its place — a slider-driven tool that converts national debt and an average interest rate into annual, daily, and per-second federal interest cost, presented as the fifth tool in the `tools` pillar so the catalog still contains five tools.

**Architecture:** Mirror the existing tool architecture exactly. Pure compute lives in `src/finance/debt-trap/{schema,compute}.ts` (Zod input + Decimal.js math). UI state lives in a Zustand store at `src/tools/debt-trap/store.ts`. The page route at `src/app/(marketing)/tools/us-debt-trap-calculator/` exports `page.tsx`, `DebtTrapForm.tsx`, and `DebtTrapResult.tsx`, wired through `analyticsToolIds.usDebtTrapCalculator`. Educational long-form content lives in a strategic seed at `src/content/strategic/tools/us-debt-trap-calculator.ts` (which replaces the spread-markup seed slot, preserving the registry's 5-seeds-per-pillar invariant). All references to the old slug — content index, public-tool markdown registry, tools landing list, accountability cross-link, site-map summary, and four e2e specs — are swapped before the legacy `spread-markup-calculator`, `spread-markup`, and analytics ID are deleted.

**Tech Stack:** Next.js 15 App Router, React 19 client components, TypeScript, Zod 3, Zustand, Decimal.js, Vitest, Playwright, Tailwind.

---

## Source spec

The replacement is ported from a self-contained HTML calculator. Key parameters from the source:

- Debt slider: min 20, max 60, step 0.1, default 38.98 (in trillions of USD).
- Rate slider: min 0.5, max 10, step 0.01, default 3.365 (annual percent).
- Annual cost = `debtTrillions * 1e12 * rate / 100`.
- Daily cost = annual / 365.
- Per-second cost = annual / 31,536,000.

A Decimal.js port must reproduce these defaults exactly:

- `38.98 * 1e12 * 0.03365 = 1,311,677,000,000` (annual ≈ $1.312T).
- Daily ≈ $3,593,635,616.44.
- Per second ≈ $41,592.51.

These are the contract values the unit tests will lock in.

## File structure

**Create:**

| Path | Responsibility |
|---|---|
| `src/finance/debt-trap/schema.ts` | Zod schema + defaults for debt-trap inputs |
| `src/finance/debt-trap/compute.ts` | Pure annual/daily/per-second cost math |
| `src/finance/debt-trap/compute.test.ts` | Vitest contract tests |
| `src/tools/debt-trap/store.ts` | Zustand store |
| `src/app/(marketing)/tools/us-debt-trap-calculator/page.tsx` | Page route, breadcrumbs, JSON-LD, FAQ |
| `src/app/(marketing)/tools/us-debt-trap-calculator/DebtTrapForm.tsx` | Form (sliders + numeric inputs) |
| `src/app/(marketing)/tools/us-debt-trap-calculator/DebtTrapResult.tsx` | Result panel + data table |
| `src/content/strategic/tools/us-debt-trap-calculator.ts` | Strategic article seed |
| `src/content/strategic/tools/us-debt-trap-calculator.test.ts` | Seed schema + reading-level + meta + word-count tests |

**Modify:**

| Path | Change |
|---|---|
| `src/content/strategic/citations.ts` | Add `treasury-debt` citation entry |
| `src/analytics/events.ts` | Add `usDebtTrapCalculator: 'us_debt_trap_calculator'`; later remove `spreadMarkupCalculator` |
| `src/content/strategic/index.ts` | Swap tools3 import from `./tools/spread-markup-calculator` to `./tools/us-debt-trap-calculator` |
| `src/content/strategic/about/accountability-standard.ts` | Replace `'tools/spread-markup-calculator'` cross-link with `'tools/us-debt-trap-calculator'` |
| `src/content/tools/public-tools.ts` | Replace the `spread-markup-calculator` PUBLIC_TOOL_PAGES entry with a `us-debt-trap-calculator` entry |
| `src/app/(marketing)/tools/page.tsx` | Replace the tools list entry |
| `src/lib/site-map.ts` | Update the `tools` pillar summary string to mention "U.S. debt trap" instead of "spread markup" |
| `tests/e2e/missing-tools.spec.ts` | Replace the spread-markup test with a debt-trap test |
| `tests/e2e/a11y.spec.ts` | Replace `/tools/spread-markup-calculator` path |
| `tests/e2e/navigation.spec.ts` | Replace `[label, path]` tuple for the tool |
| `tests/e2e/markdown-mirror.spec.ts` | Replace markdown-mirror URL and title-line assertion |

**Delete (in the final cleanup task):**

- `src/app/(marketing)/tools/spread-markup-calculator/` (entire directory)
- `src/finance/spread-markup/` (entire directory)
- `src/tools/spread-markup/` (entire directory)
- `src/content/strategic/tools/spread-markup-calculator.ts`
- `src/content/strategic/tools/spread-markup-calculator.test.ts`

## Out of scope

- The home/pillar pages outside `tools` (already covered by automated registry tests).
- Any change to spot-price plumbing or `useSpotPrice` (the new calculator does not consume live market data).
- Sanity CMS schema changes — the strategic seed registry test enforces shape compatibility automatically.

---

### Task 1: Add the Treasury Fiscal Data citation entry

**Files:**
- Modify: `src/content/strategic/citations.ts`

- [ ] **Step 1: Add the citation under the `CITATIONS` record**

In `src/content/strategic/citations.ts`, add a new entry to the `CITATIONS` object (alphabetically near `secure-2` is fine):

```ts
  'treasury-debt': {
    label: 'U.S. Treasury Fiscal Data: Debt to the Penny',
    url: 'https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny',
    accessed: '2026-04-27',
  },
  'treasury-interest': {
    label: 'U.S. Treasury Fiscal Data: Average Interest Rates on U.S. Treasury Securities',
    url: 'https://fiscaldata.treasury.gov/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities',
    accessed: '2026-04-27',
  },
```

- [ ] **Step 2: Run the citation registry test**

Run: `pnpm vitest run src/content/strategic/registries.test.ts`
Expected: PASS — adding entries does not break the registry.

- [ ] **Step 3: Commit**

```bash
git add src/content/strategic/citations.ts
git commit -m "chore(content): add treasury fiscal data citations for debt-trap tool"
```

---

### Task 2: Add the new analytics tool ID alongside the legacy one

**Files:**
- Modify: `src/analytics/events.ts`

- [ ] **Step 1: Add `usDebtTrapCalculator` to `analyticsToolIds`**

In `src/analytics/events.ts`, add the new key. Keep `spreadMarkupCalculator` in place for now so the legacy components keep type-checking until they are deleted:

```ts
export const analyticsToolIds = {
  correlationMatrix: 'correlation_matrix',
  feeDragAnalyzer: 'fee_drag_analyzer',
  roiCalculator: 'roi_calculator',
  rmdEstimator: 'rmd_estimator',
  spreadMarkupCalculator: 'spread_markup_calculator',
  usDebtTrapCalculator: 'us_debt_trap_calculator',
  writtenEstimateChecklist: 'written_estimate_checklist',
} as const
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/analytics/events.ts
git commit -m "chore(analytics): add usDebtTrapCalculator tool id"
```

---

### Task 3: Write the failing schema test for debt-trap inputs

**Files:**
- Create: `src/finance/debt-trap/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import {
  DEBT_TRAP_DEFAULTS,
  debtTrapInputSchema,
} from './schema'

describe('debtTrapInputSchema', () => {
  it('accepts the documented defaults', () => {
    expect(() => debtTrapInputSchema.parse(DEBT_TRAP_DEFAULTS)).not.toThrow()
  })

  it('rejects negative debt', () => {
    expect(() =>
      debtTrapInputSchema.parse({
        ...DEBT_TRAP_DEFAULTS,
        debtTrillions: -1,
      }),
    ).toThrow()
  })

  it('rejects an interest rate above 100 percent', () => {
    expect(() =>
      debtTrapInputSchema.parse({
        ...DEBT_TRAP_DEFAULTS,
        interestRatePercent: 150,
      }),
    ).toThrow()
  })

  it('coerces string inputs from form fields to numbers', () => {
    const parsed = debtTrapInputSchema.parse({
      debtTrillions: '38.98',
      interestRatePercent: '3.365',
    })
    expect(parsed.debtTrillions).toBe(38.98)
    expect(parsed.interestRatePercent).toBe(3.365)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/finance/debt-trap/schema.test.ts`
Expected: FAIL — the module does not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/finance/debt-trap/schema.test.ts
git commit -m "test(debt-trap): lock contract for input schema and defaults"
```

---

### Task 4: Implement the debt-trap input schema

**Files:**
- Create: `src/finance/debt-trap/schema.ts`

- [ ] **Step 1: Write the schema**

```ts
import { z } from 'zod'

export const debtTrapInputSchema = z.object({
  debtTrillions: z.coerce.number().min(0.1).max(200),
  interestRatePercent: z.coerce.number().min(0).max(100),
})

export type DebtTrapInput = z.infer<typeof debtTrapInputSchema>

export const DEBT_TRAP_DEFAULTS: DebtTrapInput = {
  debtTrillions: 38.98,
  interestRatePercent: 3.365,
}

export const DEBT_TRAP_SLIDER_BOUNDS = {
  debtTrillions: { min: 20, max: 60, step: 0.1 },
  interestRatePercent: { min: 0.5, max: 10, step: 0.01 },
} as const
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `pnpm vitest run src/finance/debt-trap/schema.test.ts`
Expected: PASS — all four cases.

- [ ] **Step 3: Commit**

```bash
git add src/finance/debt-trap/schema.ts
git commit -m "feat(debt-trap): add zod input schema, defaults, and slider bounds"
```

---

### Task 5: Write the failing compute test

**Files:**
- Create: `src/finance/debt-trap/compute.test.ts`

- [ ] **Step 1: Write the failing test**

The expected values come from the source spec at the top of this plan. They are the contract for all downstream UI.

```ts
import { describe, expect, it } from 'vitest'
import { computeDebtTrap } from './compute'

describe('computeDebtTrap', () => {
  it('reproduces the documented defaults', () => {
    const result = computeDebtTrap({
      debtTrillions: 38.98,
      interestRatePercent: 3.365,
    })

    expect(result.annualCostUsd.toFixed(2)).toBe('1311677000000.00')
    expect(result.dailyCostUsd.toFixed(2)).toBe('3593635616.44')
    expect(result.perSecondCostUsd.toFixed(2)).toBe('41592.51')
  })

  it('returns zero cost when the rate is zero', () => {
    const result = computeDebtTrap({
      debtTrillions: 38.98,
      interestRatePercent: 0,
    })

    expect(result.annualCostUsd.toFixed(2)).toBe('0.00')
    expect(result.dailyCostUsd.toFixed(2)).toBe('0.00')
    expect(result.perSecondCostUsd.toFixed(2)).toBe('0.00')
  })

  it('scales linearly with debt size', () => {
    const small = computeDebtTrap({
      debtTrillions: 10,
      interestRatePercent: 5,
    })
    const big = computeDebtTrap({
      debtTrillions: 40,
      interestRatePercent: 5,
    })

    expect(big.annualCostUsd.dividedBy(small.annualCostUsd).toFixed(2)).toBe(
      '4.00',
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/finance/debt-trap/compute.test.ts`
Expected: FAIL — `computeDebtTrap` is not defined.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/finance/debt-trap/compute.test.ts
git commit -m "test(debt-trap): lock annual/daily/per-second cost contract"
```

---

### Task 6: Implement the compute function

**Files:**
- Create: `src/finance/debt-trap/compute.ts`

- [ ] **Step 1: Write the implementation**

```ts
import type Decimal from 'decimal.js'
import { D } from '../decimal'
import type { DebtTrapInput } from './schema'

export type DebtTrapResult = {
  annualCostUsd: Decimal
  dailyCostUsd: Decimal
  perSecondCostUsd: Decimal
}

const SECONDS_PER_YEAR = 31_536_000
const DAYS_PER_YEAR = 365
const TRILLION = '1000000000000'

export function computeDebtTrap(input: DebtTrapInput): DebtTrapResult {
  const totalDebt = D(input.debtTrillions).times(TRILLION)
  const rate = D(input.interestRatePercent).dividedBy(100)
  const annual = totalDebt.times(rate)
  const daily = annual.dividedBy(DAYS_PER_YEAR)
  const perSecond = annual.dividedBy(SECONDS_PER_YEAR)

  return {
    annualCostUsd: annual,
    dailyCostUsd: daily,
    perSecondCostUsd: perSecond,
  }
}
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `pnpm vitest run src/finance/debt-trap/compute.test.ts`
Expected: PASS — all three cases.

- [ ] **Step 3: Commit**

```bash
git add src/finance/debt-trap/compute.ts
git commit -m "feat(debt-trap): compute annual, daily, and per-second cost via decimal.js"
```

---

### Task 7: Add the Zustand store

**Files:**
- Create: `src/tools/debt-trap/store.ts`

- [ ] **Step 1: Write the store**

```ts
import { create } from 'zustand'
import {
  DEBT_TRAP_DEFAULTS,
  type DebtTrapInput,
} from '@/finance/debt-trap/schema'

type Store = {
  input: DebtTrapInput
  setInput: (patch: Partial<DebtTrapInput>) => void
  reset: () => void
}

export const useDebtTrapStore = create<Store>((set) => ({
  input: DEBT_TRAP_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: DEBT_TRAP_DEFAULTS }),
}))
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/tools/debt-trap/store.ts
git commit -m "feat(debt-trap): add zustand store with reset"
```

---

### Task 8: Build the form component (sliders + numeric inputs)

**Files:**
- Create: `src/app/(marketing)/tools/us-debt-trap-calculator/DebtTrapForm.tsx`

The component renders one slider plus one synced numeric input per field, mirroring the source HTML's UX while remaining keyboard- and screen-reader accessible. Tracking events use `analyticsToolIds.usDebtTrapCalculator` and the existing `bucketToolInput` bucketing helper.

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { bucketToolInput } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
import {
  DEBT_TRAP_SLIDER_BOUNDS,
  type DebtTrapInput,
} from '@/finance/debt-trap/schema'
import { useDebtTrapStore } from '@/tools/debt-trap/store'

type FieldKey = keyof DebtTrapInput

type FieldConfig = {
  key: FieldKey
  label: string
  unit: string
  formatValue: (value: number) => string
}

const FIELDS: readonly FieldConfig[] = [
  {
    key: 'debtTrillions',
    label: 'Total National Debt',
    unit: 'trillion USD',
    formatValue: (v) => `$${v.toFixed(2)} Trillion`,
  },
  {
    key: 'interestRatePercent',
    label: 'Average Interest Rate',
    unit: 'percent',
    formatValue: (v) => `${v.toFixed(3)}%`,
  },
]

export function DebtTrapForm() {
  const { input, setInput, reset } = useDebtTrapStore()

  const trackField = (key: FieldKey, value: number) => {
    trackAnalyticsEvent(analyticsEvents.toolInputChanged, {
      field_key: key,
      tool_id: analyticsToolIds.usDebtTrapCalculator,
      value_bucket: bucketToolInput(key, value),
    })
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-6 md:grid-cols-2"
    >
      {FIELDS.map((field) => {
        const bounds = DEBT_TRAP_SLIDER_BOUNDS[field.key]
        const value = input[field.key]
        const numberId = `${field.key}-number`
        const sliderId = `${field.key}-slider`

        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor={sliderId} className="text-sm font-semibold">
                {field.label}
              </label>
              <span className="text-sm tabular-nums text-brand-slate">
                {field.formatValue(value)}
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={bounds.step}
              value={value}
              onChange={(e) =>
                setInput({
                  [field.key]: Number(e.target.value),
                } as Partial<DebtTrapInput>)
              }
              onBlur={(e) => trackField(field.key, Number(e.currentTarget.value))}
              className="block min-h-touch w-full"
              aria-label={`${field.label} slider (${field.unit})`}
            />
            <input
              id={numberId}
              type="number"
              min={bounds.min}
              max={bounds.max}
              step={bounds.step}
              value={value}
              onChange={(e) =>
                setInput({
                  [field.key]: Number(e.target.value),
                } as Partial<DebtTrapInput>)
              }
              onBlur={(e) => trackField(field.key, Number(e.currentTarget.value))}
              className="block min-h-touch w-full rounded border border-brand-slate/40 p-2"
              aria-label={`${field.label} value (${field.unit})`}
            />
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => {
          trackAnalyticsEvent(analyticsEvents.toolReset, {
            tool_id: analyticsToolIds.usDebtTrapCalculator,
          })
          reset()
        }}
        className="inline-flex min-h-touch items-center self-start rounded border border-brand-slate/40 px-4 py-2 text-sm md:col-span-2"
      >
        Reset to defaults
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/tools/us-debt-trap-calculator/DebtTrapForm.tsx
git commit -m "feat(debt-trap): add slider+numeric form with analytics tracking"
```

---

### Task 9: Build the result component

**Files:**
- Create: `src/app/(marketing)/tools/us-debt-trap-calculator/DebtTrapResult.tsx`

This mirrors `SpreadMarkupResult.tsx`: hero stats above, a `ChartDataTable` below, wrapped in `DelayedProgress` to match the existing tool friction pattern.

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { ChartDataTable } from '@/components/charts/ChartDataTable'
import { DelayedProgress } from '@/components/friction/DelayedProgress'
import { formatUsd } from '@/finance/decimal'
import { computeDebtTrap } from '@/finance/debt-trap/compute'
import { useDebtTrapStore } from '@/tools/debt-trap/store'

export function DebtTrapResult() {
  const input = useDebtTrapStore((s) => s.input)
  const result = computeDebtTrap(input)

  const rows = [
    {
      line: 'Annual interest cost',
      value: formatUsd(result.annualCostUsd),
      note: `Total debt of $${input.debtTrillions.toFixed(2)} trillion at ${input.interestRatePercent.toFixed(3)}%`,
    },
    {
      line: 'Cost per day',
      value: formatUsd(result.dailyCostUsd),
      note: 'Annual interest divided by 365',
    },
    {
      line: 'Cost per second',
      value: formatUsd(result.perSecondCostUsd),
      note: 'Annual interest divided by 31,536,000 seconds',
    },
  ]

  return (
    <DelayedProgress delayMs={250} placeholder="Recalculating debt service...">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Annual interest cost</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.annualCostUsd)}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Cost per day</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.dailyCostUsd)}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Cost per second</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.perSecondCostUsd)}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <ChartDataTable
          caption="Debt service cost calculation"
          columns={[
            { key: 'line', label: 'Line item' },
            { key: 'value', label: 'Value', align: 'right' },
            { key: 'note', label: 'Method' },
          ]}
          rows={rows}
        />
      </div>

      <p className="mt-6 max-w-3xl text-sm text-brand-slate">
        Federal interest cost is one of several macroeconomic inputs savers
        sometimes weigh when sizing a precious-metals allocation. The calculator
        is an educational illustration, not a forecast.
      </p>
    </DelayedProgress>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/tools/us-debt-trap-calculator/DebtTrapResult.tsx
git commit -m "feat(debt-trap): add result panel with hero stats and data table"
```

---

### Task 10: Build the page route

**Files:**
- Create: `src/app/(marketing)/tools/us-debt-trap-calculator/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { DebtTrapForm } from './DebtTrapForm'
import { DebtTrapResult } from './DebtTrapResult'

export const metadata: Metadata = {
  title: 'U.S. Debt Trap Calculator',
  description:
    'Convert national debt and average interest rate into annual, daily, and per-second federal interest cost. Educational illustration only.',
  alternates: { canonical: '/tools/us-debt-trap-calculator' },
}

export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/us-debt-trap-calculator`

const faqs = [
  {
    question: 'Where do the default debt and interest figures come from?',
    answer:
      'The default total debt and average interest rate are sourced from the U.S. Treasury Fiscal Data service. The numbers update as new monthly statements are released. Move the sliders to model alternative scenarios.',
  },
  {
    question: 'Is this a forecast of federal spending?',
    answer:
      'No. The calculator multiplies a debt total by an interest rate. It does not forecast future debt levels, future yields, tax revenue, or any other budget line. Treat the output as an educational illustration only.',
  },
]

export default function UsDebtTrapCalculatorPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            {
              label: 'U.S. Debt Trap Calculator',
              path: '/tools/us-debt-trap-calculator',
            },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'U.S. Debt Trap Calculator' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        U.S. Debt Trap Calculator
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Adjust the national debt and average interest rate to see the real-time
        cost of servicing federal debt — annual, daily, and per second.
      </p>

      <section className="mt-10">
        <DebtTrapForm />
      </section>
      <section className="mt-10" aria-live="polite">
        <DebtTrapResult />
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-sm text-brand-slate">
        <h2 className="font-serif text-2xl text-brand-navy">Source Notes</h2>
        <p>
          Default debt level reflects the Treasury Department's published Debt
          to the Penny figure. Default average interest rate reflects the
          Treasury Department's monthly statement of Average Interest Rates on
          U.S. Treasury Securities. Both values move as new statements
          publish.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {faqs.map((qa) => (
            <div key={qa.question}>
              <dt className="font-semibold">{qa.question}</dt>
              <dd className="mt-1 text-sm">{qa.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `pnpm tsc --noEmit && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/tools/us-debt-trap-calculator/page.tsx
git commit -m "feat(debt-trap): add /tools/us-debt-trap-calculator page route"
```

---

### Task 11: Smoke-test the new route in the browser

**Files:**
- None modified.

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev` (in a background shell)

- [ ] **Step 2: Open `http://localhost:3000/tools/us-debt-trap-calculator`**

Verify visually:
- Title `U.S. Debt Trap Calculator` renders.
- Sliders move; numeric inputs reflect slider state and vice versa.
- Hero stats show $1.31T / $3.59B / $41,592.51 with the documented defaults.
- Reset button restores the defaults.

If anything is off, fix the component before continuing — do not move forward on a broken route.

- [ ] **Step 3: Stop the dev server**

(Background process is killed; nothing to commit.)

---

### Task 12: Write the failing strategic seed test

**Files:**
- Create: `src/content/strategic/tools/us-debt-trap-calculator.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from 'vitest'
import { ArticleSeedSchema } from '../types'
import { extractPlainText, fleschKincaidGrade } from '../reading-level'
import { seed } from './us-debt-trap-calculator'

describe('tools/us-debt-trap-calculator', () => {
  it('parses under ArticleSeedSchema', () => {
    expect(() => ArticleSeedSchema.parse(seed)).not.toThrow()
  })

  it('reads at 6.5–8.5 grade level', () => {
    const grade = fleschKincaidGrade(extractPlainText(seed.body))
    expect(grade).toBeGreaterThanOrEqual(6.5)
    expect(grade).toBeLessThanOrEqual(8.5)
  })

  it('has meta within char limits', () => {
    expect(seed.metaTitle.length).toBeLessThanOrEqual(60)
    expect(seed.metaDescription.length).toBeLessThanOrEqual(160)
    expect(seed.metaTitle.length).toBeGreaterThanOrEqual(10)
    expect(seed.metaDescription.length).toBeGreaterThanOrEqual(50)
  })

  it('has body word count in 700–1400 range', () => {
    const prose = extractPlainText(seed.body)
    const words = prose.split(/\s+/).filter((w) => /[a-z]/i.test(w)).length
    expect(words).toBeGreaterThanOrEqual(700)
    expect(words).toBeLessThanOrEqual(1400)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/content/strategic/tools/us-debt-trap-calculator.test.ts`
Expected: FAIL — the seed module does not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/content/strategic/tools/us-debt-trap-calculator.test.ts
git commit -m "test(debt-trap): seed conformance contract"
```

---

### Task 13: Author the strategic article seed

**Files:**
- Create: `src/content/strategic/tools/us-debt-trap-calculator.ts`

The seed must satisfy `ArticleSeedSchema` (see `src/content/strategic/types.ts`) and the reading-level/word-count tests from Task 12. Constraints:

- `_id` exactly `article.tools.us-debt-trap-calculator`.
- `pillar: 'tools'`, `slug: 'us-debt-trap-calculator'`.
- `metaTitle`: 10–60 chars. `metaDescription`: 50–160 chars.
- `crossLinks` must point to existing seeds — use `economics/fiat-devaluation` and `accountability/transactional-spreads`. Both already live in the registry.
- At least one citation. Use both `treasury-debt` and `treasury-interest` from Task 1.
- Body word count 700–1400 at Flesch-Kincaid grade 6.5–8.5. Use short, plain sentences. Tip: when copying tone, mirror the prose style in `tools/correlation-matrix.ts` — short declarative sentences, simple vocabulary.

- [ ] **Step 1: Write the seed**

```ts
import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.tools.us-debt-trap-calculator',
  pillar: 'tools',
  slug: 'us-debt-trap-calculator',
  title: 'U.S. Debt Trap Calculator: Federal Interest Cost Explained',
  summary:
    'A plain-language explainer on how the U.S. Treasury reports total debt and average interest, how debt service cost is calculated, and what the annual, daily, and per-second numbers mean for a saver.',
  metaTitle: 'U.S. Debt Trap Calculator',
  metaDescription:
    'How federal interest cost is calculated from total debt and average interest rate, and what the annual, daily, and per-second numbers actually mean.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-27',
  updatedAt: '2026-04-27',
  authorSlug: 'jane',
  crossLinks: [
    'economics/fiat-devaluation',
    'accountability/transactional-spreads',
  ],
  citations: [citation('treasury-debt'), citation('treasury-interest')],
  body: [
    block(
      'intro',
      p(
        'The U.S. debt trap calculator answers a simple question. How much does the federal government pay each year, each day, and each second to service its debt? The math is straightforward. Total debt is multiplied by an average interest rate. The result is annual cost. Annual cost divided by three hundred sixty-five gives daily cost. Annual cost divided by the seconds in a year gives per-second cost. This page walks through what each input means and how to read the output.',
      ),
    ),
    block('h2-inputs', h2('What the two inputs mean')),
    block('h3-debt', h3('Total national debt')),
    block(
      'debt-1',
      p(
        'The first input is total federal debt held in the form of Treasury securities. The Treasury Department publishes this figure every business day on a page called Debt to the Penny. The total reflects everything the government owes through bills, notes, bonds, and other instruments. The number includes both debt held by the public and debt held in intragovernmental accounts.',
      ),
    ),
    block(
      'debt-2',
      p(
        'A reader can drag the slider above or below the published figure to see how the cost number changes under different debt levels. The slider does not predict future debt. It is a what-if input. The default value matches the most recently published Treasury figure at the time this page was last updated.',
      ),
    ),
    block('h3-rate', h3('Average interest rate')),
    block(
      'rate-1',
      p(
        'The second input is the weighted average interest rate the Treasury pays across the full mix of outstanding securities. The Treasury also publishes this number each month in its Average Interest Rates statement. The figure is a weighted blend. Short bills, longer notes, longer bonds, inflation-protected securities, and other categories each carry their own coupon. The blend gives a single rate that represents the overall cost of carry.',
      ),
    ),
    block(
      'rate-2',
      p(
        'The slider can be moved up to model what happens if rates rise. The slider can be moved down to model what happens if rates fall. Either move is hypothetical. The slider is not a forecast. The default value matches the most recently published weighted average at the time this page was last updated.',
      ),
    ),
    block('h2-math', h2('How the cost numbers are calculated')),
    block(
      'math-1',
      p(
        'The annual cost is the product of total debt and the average interest rate expressed as a decimal. A debt of forty trillion dollars at a four percent average rate produces an annual cost of one point six trillion dollars. The exact figure depends on the inputs, but the formula does not change.',
      ),
    ),
    block(
      'math-2',
      p(
        'The daily cost is the annual figure divided by three hundred sixty-five. The per-second cost is the annual figure divided by thirty-one million five hundred thirty-six thousand, which is the count of seconds in a non-leap year. These two derived figures help a reader picture the size of the annual number on a more familiar time scale.',
      ),
    ),
    block(
      'callout-example',
      callout(
        'info',
        'A working example. Forty trillion dollars of debt at a four percent average rate produces an annual cost near one point six trillion dollars, a daily cost near four point four billion dollars, and a per-second cost near fifty thousand dollars.',
      ),
    ),
    block('h2-interpret', h2('How to read the output')),
    block(
      'interpret-1',
      p(
        'A large annual figure does not, by itself, tell a reader whether the federal interest bill is sustainable. Sustainability depends on the size of the economy, the level of tax receipts, and the path of future borrowing. The calculator does not answer those broader questions. It only shows the cost of carry implied by a single pair of inputs.',
      ),
    ),
    block(
      'interpret-2',
      p(
        'A useful comparison is to look at federal interest cost as a share of federal revenue. When interest cost grows faster than revenue, less room remains for other spending without further borrowing. When interest cost grows slower than revenue, the carrying cost takes a smaller share of the budget. These dynamics are the focus of fiscal policy debate, but they sit outside the simple math this calculator performs.',
      ),
    ),
    block(
      'interpret-3',
      p(
        'A second useful comparison is to look at how the per-second figure changes when the rate moves a single percentage point. A one-point move in the average rate is a large change in dollar terms even when the headline rate appears small. The slider lets a reader feel that sensitivity directly.',
      ),
    ),
    block('h2-context', h2('Why this matters for a precious metals saver')),
    block(
      'context-1',
      p(
        'A growing federal interest bill is one of several macroeconomic factors that some savers weigh when sizing an allocation to physical precious metals. The reasoning is that, all else equal, a larger interest bill puts pressure on the central bank, on the currency, and on long-run purchasing power. Whether that reasoning is correct in any given period is a matter of judgment and outside the scope of this tool.',
      ),
    ),
    block(
      'context-2',
      p(
        'Other savers reach a different conclusion. They note that the same dynamics can support strong dollar demand abroad and steady demand for Treasury securities at home. The calculator does not take a side. It simply makes the headline math easier to see at a glance and on a human time scale.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Where do the default debt and interest figures come from?',
        'The default total debt and average interest rate are sourced from the U.S. Treasury Fiscal Data service. The numbers update as new monthly statements are released. Move the sliders to model alternative scenarios.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Is this a forecast of federal spending?',
        'No. The calculator multiplies a debt total by an interest rate. It does not forecast future debt levels, future yields, tax revenue, or any other budget line. Treat the output as an educational illustration only.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Why is the per-second figure shown at all?',
        'A trillion-dollar annual figure is hard to picture. The per-second figure puts the same number on a familiar time scale. It is a teaching aid, not a forecast or a recommendation.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Where do the default debt and interest figures come from?',
      answer:
        'The default total debt and average interest rate are sourced from the U.S. Treasury Fiscal Data service. The numbers update as new monthly statements are released. Move the sliders to model alternative scenarios.',
    },
    {
      question: 'Is this a forecast of federal spending?',
      answer:
        'No. The calculator multiplies a debt total by an interest rate. It does not forecast future debt levels, future yields, tax revenue, or any other budget line. Treat the output as an educational illustration only.',
    },
    {
      question: 'Why is the per-second figure shown at all?',
      answer:
        'A trillion-dollar annual figure is hard to picture. The per-second figure puts the same number on a familiar time scale. It is a teaching aid, not a forecast or a recommendation.',
    },
  ],
}
```

- [ ] **Step 2: Run the seed test**

Run: `pnpm vitest run src/content/strategic/tools/us-debt-trap-calculator.test.ts`
Expected: PASS — schema, reading level, meta, and word count all in range.

If reading level fails: shorten the longest sentences. If word count fails: tighten or expand the prose, not the structure.

- [ ] **Step 3: Commit**

```bash
git add src/content/strategic/tools/us-debt-trap-calculator.ts
git commit -m "feat(content): add strategic seed for us-debt-trap-calculator"
```

---

### Task 14: Swap the seed into the strategic registry

**Files:**
- Modify: `src/content/strategic/index.ts`

The registry imports five tool seeds (`tools1`–`tools5`). The `tools3` slot is currently `spread-markup-calculator`. Replace it with the new seed so the 5-seeds-per-pillar invariant holds.

- [ ] **Step 1: Edit the import**

Change:

```ts
import { seed as tools3 } from './tools/spread-markup-calculator'
```

to:

```ts
import { seed as tools3 } from './tools/us-debt-trap-calculator'
```

(Do not touch `tools1`, `tools2`, `tools4`, `tools5` — they remain unchanged.)

- [ ] **Step 2: Run the registry tests**

Run: `pnpm vitest run src/content/strategic/index.test.ts src/content/strategic/registries.test.ts`
Expected: PASS — `ALL_SEEDS` still contains 25 seeds, all cross-links resolve, all reading levels in range.

If the cross-link test fails because `accountability/about-the-guide → tools/spread-markup-calculator` no longer resolves, that link is fixed in Task 15.

- [ ] **Step 3: Commit**

```bash
git add src/content/strategic/index.ts
git commit -m "feat(content): swap tools3 to us-debt-trap-calculator seed"
```

---

### Task 15: Repoint the accountability cross-link

**Files:**
- Modify: `src/content/strategic/about/accountability-standard.ts`

- [ ] **Step 1: Replace the cross-link string**

In the `crossLinks` array at line 23, replace `'tools/spread-markup-calculator'` with `'tools/us-debt-trap-calculator'`.

- [ ] **Step 2: Run the cross-link test**

Run: `pnpm vitest run src/content/strategic/index.test.ts`
Expected: PASS — every cross-link points to a real seed.

- [ ] **Step 3: Commit**

```bash
git add src/content/strategic/about/accountability-standard.ts
git commit -m "fix(content): repoint accountability-standard cross-link to debt-trap tool"
```

---

### Task 16: Swap the public-tool markdown registry entry

**Files:**
- Modify: `src/content/tools/public-tools.ts`

The `PUBLIC_TOOL_PAGES` array drives the `/tools/<slug>.md` mirror. Replace the `spread-markup-calculator` entry (currently at lines ~94–118) with a `us-debt-trap-calculator` entry of the same shape.

- [ ] **Step 1: Replace the entry**

```ts
  {
    slug: 'us-debt-trap-calculator',
    title: 'U.S. Debt Trap Calculator',
    summary:
      'Convert national debt and average interest rate into annual, daily, and per-second federal interest cost.',
    updatedAt: '2026-04-27',
    markdown: [
      '## Formula',
      'Annual interest cost equals total national debt multiplied by the average interest rate expressed as a decimal. Daily cost equals annual cost divided by 365. Per-second cost equals annual cost divided by 31,536,000.',
      '',
      '## Inputs',
      '- Total national debt (USD trillions)',
      '- Average interest rate (annual percent)',
      '',
      '## Output',
      'The tool reports annual interest cost, daily interest cost, and per-second interest cost in USD.',
      '',
      '## Limitation',
      'Output is an educational illustration. It does not forecast future debt, future rates, tax revenue, or any other budget line.',
    ].join('\n'),
  },
```

- [ ] **Step 2: Run the markdown-mirror unit tests**

Run: `pnpm vitest run src/content/tools/`
Expected: PASS (if a unit test exists; otherwise skipped).

- [ ] **Step 3: Commit**

```bash
git add src/content/tools/public-tools.ts
git commit -m "feat(public-tools): swap spread-markup entry for us-debt-trap-calculator"
```

---

### Task 17: Swap the tools landing page entry

**Files:**
- Modify: `src/app/(marketing)/tools/page.tsx`

The tools array at lines ~21–62 lists each tool card. Replace the `spread-markup-calculator` entry with the new tool.

- [ ] **Step 1: Replace the entry**

Change:

```ts
  {
    slug: 'spread-markup-calculator',
    title: 'Dealer Spread and Markup Calculator',
    description:
      'Compare quoted product price against spot value and calculate markup.',
  },
```

to:

```ts
  {
    slug: 'us-debt-trap-calculator',
    title: 'U.S. Debt Trap Calculator',
    description:
      'Slider-driven illustration of annual, daily, and per-second federal interest cost.',
  },
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/tools/page.tsx
git commit -m "feat(tools): swap landing card for us-debt-trap-calculator"
```

---

### Task 18: Update the `tools` pillar summary

**Files:**
- Modify: `src/lib/site-map.ts`

The `tools` pillar's `summary` at line 43 currently reads `'Fee drag, ROI, spread markup, RMD, correlation, live spot price, and written-estimate tools.'`. Replace `spread markup` with `U.S. debt trap`.

- [ ] **Step 1: Edit the string**

Change:

```ts
    summary:
      'Fee drag, ROI, spread markup, RMD, correlation, live spot price, and written-estimate tools.',
```

to:

```ts
    summary:
      'Fee drag, ROI, U.S. debt trap, RMD, correlation, live spot price, and written-estimate tools.',
```

- [ ] **Step 2: Run site-map tests**

Run: `pnpm vitest run src/lib/site-map.test.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/site-map.ts
git commit -m "chore(site-map): update tools pillar summary to mention debt trap"
```

---

### Task 19: Update the e2e test suite

**Files:**
- Modify: `tests/e2e/missing-tools.spec.ts`
- Modify: `tests/e2e/a11y.spec.ts`
- Modify: `tests/e2e/navigation.spec.ts`
- Modify: `tests/e2e/markdown-mirror.spec.ts`

Each spec hard-codes the spread-markup path, label, or expected text. Update each to point at the new tool. The spread-markup tests must be retired entirely — the route ceases to exist in Task 21.

- [ ] **Step 1: Replace the spread-markup test in `tests/e2e/missing-tools.spec.ts`**

Replace the first test (lines 3–17) with:

```ts
test('us debt trap calculator computes federal interest cost', async ({ page }) => {
  await page.goto('/tools/us-debt-trap-calculator')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /u\.s\. debt trap calculator/i,
    }),
  ).toBeVisible()
  await page
    .getByLabel('Total National Debt value (trillion USD)')
    .fill('40')
  await page
    .getByLabel('Average Interest Rate value (percent)')
    .fill('5')
  await expect(page.getByText('$2,000,000,000,000.00').first()).toBeVisible()
})
```

- [ ] **Step 2: Replace the path in `tests/e2e/a11y.spec.ts`**

Change `/tools/spread-markup-calculator` (line 17) to `/tools/us-debt-trap-calculator`.

- [ ] **Step 3: Replace the entry in `tests/e2e/navigation.spec.ts`**

Change the tuple at line 57 from:

```ts
['Dealer Spread and Markup Calculator', '/tools/spread-markup-calculator'],
```

to:

```ts
['U.S. Debt Trap Calculator', '/tools/us-debt-trap-calculator'],
```

- [ ] **Step 4: Replace the assertions in `tests/e2e/markdown-mirror.spec.ts`**

Change lines 25–32 to:

```ts
test('public tool .md mirror returns formula context', async ({ request }) => {
  const response = await request.get('/tools/us-debt-trap-calculator.md')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/markdown')
  const body = await response.text()
  expect(body).toContain('# U.S. Debt Trap Calculator')
  expect(body).toContain('## Formula')
})
```

- [ ] **Step 5: Run the e2e suite against the new tool**

Run: `pnpm exec playwright test missing-tools navigation a11y markdown-mirror`
Expected: PASS — the new route is up; the legacy route still exists but is no longer referenced anywhere in tests.

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/missing-tools.spec.ts tests/e2e/a11y.spec.ts tests/e2e/navigation.spec.ts tests/e2e/markdown-mirror.spec.ts
git commit -m "test(e2e): retarget spread-markup paths to us-debt-trap-calculator"
```

---

### Task 20: Verify nothing references the legacy slug or analytics ID

**Files:**
- None modified.

- [ ] **Step 1: Grep for stragglers**

Run:

```bash
git grep -n "spread-markup-calculator\|spread-markup\|spread_markup_calculator\|spreadMarkupCalculator\|Dealer Spread" -- 'src' 'tests' 'docs/superpowers/plans' ':(exclude)docs/superpowers/plans/2026-04-27-debt-trap-calculator-replacement.md'
```

Expected: only matches inside the legacy directories listed in Task 21 (the files that will be deleted next). If any other file matches, fix it before continuing.

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS — every reference outside the legacy directories has been updated.

(No commit if nothing changed; otherwise fix and commit with a `chore:` message describing the missed reference.)

---

### Task 21: Delete the legacy spread-markup files

**Files:**
- Delete: `src/app/(marketing)/tools/spread-markup-calculator/` (whole directory)
- Delete: `src/finance/spread-markup/` (whole directory)
- Delete: `src/tools/spread-markup/` (whole directory)
- Delete: `src/content/strategic/tools/spread-markup-calculator.ts`
- Delete: `src/content/strategic/tools/spread-markup-calculator.test.ts`
- Modify: `src/analytics/events.ts` (remove `spreadMarkupCalculator` line added in Task 2)

- [ ] **Step 1: Remove the directories and files**

Run:

```bash
git rm -r src/app/\(marketing\)/tools/spread-markup-calculator
git rm -r src/finance/spread-markup
git rm -r src/tools/spread-markup
git rm src/content/strategic/tools/spread-markup-calculator.ts
git rm src/content/strategic/tools/spread-markup-calculator.test.ts
```

- [ ] **Step 2: Drop the legacy analytics ID**

In `src/analytics/events.ts`, remove the line:

```ts
spreadMarkupCalculator: 'spread_markup_calculator',
```

The remaining `analyticsToolIds` object should still type-check because no surviving code references the deleted key (verified in Task 20).

- [ ] **Step 3: Type-check, lint, and run vitest**

Run: `pnpm tsc --noEmit && pnpm lint && pnpm vitest run`
Expected: PASS — no dangling imports, no orphaned references.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove legacy dealer spread and markup calculator"
```

---

### Task 22: Final verification

**Files:**
- None modified.

- [ ] **Step 1: Run the full vitest suite**

Run: `pnpm vitest run`
Expected: PASS — including the seed registry test (25 seeds, 5 per pillar, all cross-links valid, all reading levels 6.5–8.5).

- [ ] **Step 2: Run the full e2e suite**

Run: `pnpm exec playwright test`
Expected: PASS.

- [ ] **Step 3: Run the production build**

Run: `pnpm build`
Expected: PASS — no broken imports, no dead routes.

- [ ] **Step 4: Smoke-test the new route in dev**

Run: `pnpm dev` (background); open `http://localhost:3000/tools/us-debt-trap-calculator`. Move both sliders, observe the three hero stats update, click Reset, observe defaults restore. Open `/tools` and confirm the U.S. Debt Trap Calculator card replaces the dealer spread card. Open `http://localhost:3000/tools/us-debt-trap-calculator.md` and confirm the markdown mirror serves the new formula. Stop the dev server when done.

- [ ] **Step 5: Push the branch**

```bash
git push -u origin HEAD
```

The plan is complete when all tests pass, the dev server smoke test is green, and the branch is pushed.

---

## Self-review notes

- Spec coverage: every spec parameter (debt slider bounds, rate slider bounds, defaults, three derived costs) is locked into a unit test in Task 5/6. The replacement-of-old-tool requirement is locked into Tasks 14–21.
- Type consistency: `DebtTrapInput` keys (`debtTrillions`, `interestRatePercent`) are referenced identically across schema, store, form, result, and tests. `analyticsToolIds.usDebtTrapCalculator` is the single analytics identifier.
- Registry invariants: ALL_SEEDS stays at 25 (Task 14 swaps the same slot). Every cross-link still resolves (Task 15). Reading level / word count / meta length checks have a dedicated test (Task 12).
- No placeholders: every code block contains the actual implementation, not a TODO. Every command shows expected output. Every "fix it before continuing" branch references a concrete next step.
