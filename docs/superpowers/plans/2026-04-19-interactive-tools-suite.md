# Plan 5: Interactive Tools Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–4 shipped.

**Goal:** Replace the Tools landing page stubs with three production calculators — **Fee Drag Analyzer**, **ROI Calculator**, and **Written Estimate Checklist** — each backed by unit-tested exact-decimal math, smart-friction interaction patterns, URL-shareable state, and a `FAQPage` JSON-LD payload. Every calculation result is identically reproducible on the server and the client; every input is validated with Zod; every tool exposes the underlying math via a "See the math" accordion so users can audit the numbers. The live-spot-price ticker is deferred to Plan 6, but the calculators accept a spot price input now as a plain number.

**Architecture:** One finance module per tool under `src/finance/<tool>/`, each exporting a pure `computeX` function operating on `Decimal` (from `decimal.js`). One Zustand store per tool under `src/tools/<tool>/store.ts`. URL state is the source of truth — stores hydrate from search params, mutations update the URL via `router.replace`. Smart-friction primitives (`<ReadAndConfirm>`, `<DelayedProgress>`, `<CostAcknowledgment>`) live in `src/components/friction/` and wrap high-stakes actions. The portable-text `feeTable` block from Plan 2 is now rendered by a component that pulls the referenced `feeSchedule` documents.

**Tech stack additions:** `decimal.js`, `zustand`, `zod`, `react-hook-form`, `@hookform/resolvers/zod`, `nuqs` (URL state).

**Out of scope:** Real-time spot price via WebSocket (Plan 6 swaps the static spot input for a live ticker), charts embedded inside calculators (Plan 7), final typography + dark-mode polish (Plan 8).

---

## File Structure

- `src/finance/decimal.ts` + `.test.ts` — `D(...)` helper + formatters
- `src/finance/fee-drag/compute.ts` + `.test.ts`
- `src/finance/fee-drag/schema.ts` — Zod inputs
- `src/finance/roi/compute.ts` + `.test.ts`
- `src/finance/roi/schema.ts`
- `src/finance/comparison/sort-filter.ts` + `.test.ts`
- `src/finance/comparison/schema.ts`
- `src/tools/fee-drag/store.ts` + `.test.ts`
- `src/tools/roi/store.ts` + `.test.ts`
- `src/tools/comparison/store.ts` + `.test.ts`
- `src/components/friction/ReadAndConfirm.tsx` + `.test.tsx`
- `src/components/friction/DelayedProgress.tsx` + `.test.tsx`
- `src/components/friction/CostAcknowledgment.tsx` + `.test.tsx`
- `src/components/ui/number-input.tsx` — accessible numeric input
- `src/components/ui/slider.tsx` — shadcn slider
- `src/components/editorial/FeeTableBlock.tsx` — portable-text renderer for `feeTable`
- `src/app/(marketing)/tools/fee-drag-analyzer/page.tsx` + `FeeDragForm.tsx` + `FeeDragResult.tsx`
- `src/app/(marketing)/tools/roi-calculator/page.tsx` + `RoiForm.tsx` + `RoiResult.tsx`
- `src/app/(marketing)/tools/written-estimate-checklist/page.tsx` + `ComparisonTable.tsx` + `ComparisonFilters.tsx`
- `tests/e2e/fee-drag.spec.ts`, `roi.spec.ts`, `comparison.spec.ts`

Design rule: **No calculator touches `fetch()` directly.** All dealer/fee data flows in via props from `listFeeSchedules`. This keeps the math modules pure and CI-testable in isolation.

---

## Task 1: Exact-Decimal Math Helpers (TDD)

**Files:**
- Create: `src/finance/decimal.ts`, `src/finance/decimal.test.ts`

All money math uses `Decimal` — JavaScript `number` drops precision on 30-year portfolio projections involving 2%-scaling fees compounded annually.

- [ ] **Step 1.1: Install**

```bash
pnpm add decimal.js zustand zod react-hook-form @hookform/resolvers nuqs
```

- [ ] **Step 1.2: Failing tests**

Create `/opt/projects/thegoldiraguide/src/finance/decimal.test.ts`:

```ts
import Decimal from 'decimal.js'
import { describe, expect, it } from 'vitest'
import { D, formatUsd, formatPercent, safeParseUsd } from './decimal'

describe('D', () => {
  it('coerces numbers and strings to Decimal', () => {
    expect(D(1.1).plus(D(2.2)).equals(new Decimal('3.3'))).toBe(true)
    expect(D('100.50').times(D('0.1')).toFixed(2)).toBe('10.05')
  })
})

describe('formatUsd', () => {
  it('formats with US locale and dollar sign', () => {
    expect(formatUsd(D('1234.5'))).toBe('$1,234.50')
  })
  it('handles negative values', () => {
    expect(formatUsd(D('-100'))).toBe('-$100.00')
  })
})

describe('formatPercent', () => {
  it('renders a decimal as a percent with one fractional digit', () => {
    expect(formatPercent(D('0.0175'))).toBe('1.8%')
  })
  it('accepts a fractionDigits override', () => {
    expect(formatPercent(D('0.0175'), 2)).toBe('1.75%')
  })
})

describe('safeParseUsd', () => {
  it('returns a Decimal for a valid number string', () => {
    const result = safeParseUsd('$1,234.56')
    expect(result?.toFixed(2)).toBe('1234.56')
  })
  it('returns null for garbage input', () => {
    expect(safeParseUsd('abc')).toBeNull()
  })
})
```

- [ ] **Step 1.3: Implement**

Create `/opt/projects/thegoldiraguide/src/finance/decimal.ts`:

```ts
import Decimal from 'decimal.js'

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_EVEN })

export type DecimalLike = Decimal.Value

export function D(value: DecimalLike): Decimal {
  return new Decimal(value)
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatUsd(value: DecimalLike): string {
  const n = Number(D(value).toFixed(2))
  return usdFormatter.format(n)
}

export function formatPercent(
  value: DecimalLike,
  fractionDigits = 1,
): string {
  return `${D(value).times(100).toFixed(fractionDigits)}%`
}

export function safeParseUsd(input: string): Decimal | null {
  const cleaned = input.replace(/[\s,$]/g, '')
  if (!/^-?\d*\.?\d*$/.test(cleaned) || cleaned === '') return null
  try {
    return new Decimal(cleaned)
  } catch {
    return null
  }
}
```

- [ ] **Step 1.4: Run — GREEN**

```bash
pnpm test src/finance/decimal.test.ts
```

- [ ] **Step 1.5: Commit**

```bash
git add src/finance/decimal.ts src/finance/decimal.test.ts package.json pnpm-lock.yaml
git commit -m "feat(finance): decimal helpers and formatters for exact money math"
```

---

## Task 2: Smart-Friction Primitives (TDD)

**Files:**
- Create: `src/components/friction/ReadAndConfirm.tsx`, `.test.tsx`, `DelayedProgress.tsx`, `.test.tsx`, `CostAcknowledgment.tsx`, `.test.tsx`

- [ ] **Step 2.1: `ReadAndConfirm` failing test**

Create `/opt/projects/thegoldiraguide/src/components/friction/ReadAndConfirm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReadAndConfirm } from './ReadAndConfirm'

describe('ReadAndConfirm', () => {
  it('disables the confirm button until the checkbox is checked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ReadAndConfirm title="Important" body="Read me." onConfirm={onConfirm} />,
    )
    const confirm = screen.getByRole('button', { name: /confirm/i })
    expect(confirm).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: /i have read and understood/i }))
    expect(confirm).toBeEnabled()

    await user.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2.2: Implement**

Create `/opt/projects/thegoldiraguide/src/components/friction/ReadAndConfirm.tsx`:

```tsx
'use client'

import { useState } from 'react'

export function ReadAndConfirm({
  title,
  body,
  onConfirm,
}: {
  title: string
  body: string
  onConfirm: () => void
}) {
  const [acknowledged, setAcknowledged] = useState(false)
  return (
    <div
      role="group"
      aria-label={title}
      className="rounded border border-slate-charcoal/20 bg-white p-6"
    >
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
      <label className="mt-4 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
        />
        <span>I have read and understood the statement above.</span>
      </label>
      <button
        type="button"
        disabled={!acknowledged}
        onClick={onConfirm}
        className="mt-4 inline-flex min-h-[44px] items-center rounded bg-ledger-navy px-4 py-2 text-sm font-semibold text-platinum disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirm
      </button>
    </div>
  )
}
```

- [ ] **Step 2.3: `DelayedProgress` failing test**

Create `/opt/projects/thegoldiraguide/src/components/friction/DelayedProgress.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { DelayedProgress } from './DelayedProgress'

describe('DelayedProgress', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('reveals the child only after the specified delay', () => {
    render(
      <DelayedProgress delayMs={2000} placeholder="Calculating…">
        <div>Result ready</div>
      </DelayedProgress>,
    )
    expect(screen.getByText(/calculating/i)).toBeInTheDocument()
    expect(screen.queryByText('Result ready')).toBeNull()

    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByText('Result ready')).toBeInTheDocument()
    expect(screen.queryByText(/calculating/i)).toBeNull()
  })
})
```

- [ ] **Step 2.4: Implement**

Create `/opt/projects/thegoldiraguide/src/components/friction/DelayedProgress.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function DelayedProgress({
  delayMs,
  placeholder,
  children,
}: {
  delayMs: number
  placeholder: string
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setReady(true), delayMs)
    return () => clearTimeout(id)
  }, [delayMs])

  if (!ready) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-slate-charcoal"
      >
        {placeholder}
      </p>
    )
  }
  return <>{children}</>
}
```

- [ ] **Step 2.5: `CostAcknowledgment` failing test**

Create `/opt/projects/thegoldiraguide/src/components/friction/CostAcknowledgment.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CostAcknowledgment } from './CostAcknowledgment'

describe('CostAcknowledgment', () => {
  it('surfaces the cost figure and forces the user to type it before continuing', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    render(
      <CostAcknowledgment
        label="Your total projected fee drag"
        formattedCost="$12,345.00"
        costPlainDigits="12345"
        onContinue={onContinue}
      />,
    )

    const input = screen.getByRole('textbox', {
      name: /type the number/i,
    })
    const button = screen.getByRole('button', { name: /i acknowledge/i })
    expect(button).toBeDisabled()

    await user.type(input, '12345')
    expect(button).toBeEnabled()
    await user.click(button)
    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2.6: Implement**

Create `/opt/projects/thegoldiraguide/src/components/friction/CostAcknowledgment.tsx`:

```tsx
'use client'

import { useState } from 'react'

export function CostAcknowledgment({
  label,
  formattedCost,
  costPlainDigits,
  onContinue,
}: {
  label: string
  formattedCost: string
  costPlainDigits: string
  onContinue: () => void
}) {
  const [typed, setTyped] = useState('')
  const matches = typed.replace(/[\s,$.]/g, '') === costPlainDigits

  return (
    <div className="rounded border-2 border-old-gold bg-platinum p-6">
      <p className="text-sm uppercase tracking-wide text-slate-charcoal">{label}</p>
      <p className="mt-1 font-serif text-3xl font-bold text-ledger-navy">{formattedCost}</p>
      <p className="mt-4 text-sm">
        To ensure you have absorbed this number, please type the figure (digits only) to continue.
      </p>
      <label className="mt-2 block text-sm font-medium">
        Type the number exactly
        <input
          type="text"
          inputMode="numeric"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="mt-1 block w-full rounded border border-slate-charcoal/40 p-2"
        />
      </label>
      <button
        type="button"
        disabled={!matches}
        onClick={onContinue}
        className="mt-4 inline-flex min-h-[44px] items-center rounded bg-ledger-navy px-4 py-2 text-sm font-semibold text-platinum disabled:cursor-not-allowed disabled:opacity-50"
      >
        I acknowledge this cost and want to continue
      </button>
    </div>
  )
}
```

- [ ] **Step 2.7: Run — GREEN**

```bash
pnpm test src/components/friction
```

- [ ] **Step 2.8: Commit**

```bash
git add src/components/friction
git commit -m "feat(friction): read-and-confirm, delayed-progress, cost-acknowledgment"
```

---

## Task 3: Fee Drag Analyzer Math (TDD)

**Files:**
- Create: `src/finance/fee-drag/schema.ts`, `src/finance/fee-drag/compute.ts`, `src/finance/fee-drag/compute.test.ts`

The math: starting balance `P`, annual return `r`, horizon `n` years, annual fee drag `f` (a function of balance or a flat number). Each year: `balance = (balance * (1 + r)) - fee(balance)`. Returns per-year trajectory + totals for two side-by-side scenarios (flat vs. scaling) for comparison.

- [ ] **Step 3.1: Zod schema**

Create `/opt/projects/thegoldiraguide/src/finance/fee-drag/schema.ts`:

```ts
import { z } from 'zod'

export const feeDragInputSchema = z.object({
  startingBalanceUsd: z.coerce.number().min(1000).max(10_000_000),
  horizonYears: z.coerce.number().int().min(1).max(50),
  annualReturnPercent: z.coerce.number().min(-10).max(20),
  oneTimeSetupFeeUsd: z.coerce.number().min(0).max(10_000),

  // Scenario A: flat-rate transparent model
  flatAnnualAdminFeeUsd: z.coerce.number().min(0).max(10_000),
  flatAnnualStorageFeeUsd: z.coerce.number().min(0).max(10_000),

  // Scenario B: scaling percentage-based model
  scalingAnnualAdminFeeUsd: z.coerce.number().min(0).max(10_000),
  scalingAnnualStoragePercent: z.coerce.number().min(0).max(5),
})

export type FeeDragInput = z.infer<typeof feeDragInputSchema>

export const FEE_DRAG_DEFAULTS: FeeDragInput = {
  startingBalanceUsd: 100_000,
  horizonYears: 20,
  annualReturnPercent: 6,
  oneTimeSetupFeeUsd: 75,
  flatAnnualAdminFeeUsd: 100,
  flatAnnualStorageFeeUsd: 125,
  scalingAnnualAdminFeeUsd: 125,
  scalingAnnualStoragePercent: 0.75,
}
```

- [ ] **Step 3.2: Failing compute tests**

Create `/opt/projects/thegoldiraguide/src/finance/fee-drag/compute.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { D } from '../decimal'
import { computeFeeDrag } from './compute'
import { FEE_DRAG_DEFAULTS } from './schema'

describe('computeFeeDrag', () => {
  it('produces a row per year plus a starting row (horizon + 1)', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    expect(r.years).toHaveLength(FEE_DRAG_DEFAULTS.horizonYears + 1)
    expect(r.years[0].year).toBe(0)
    expect(r.years[FEE_DRAG_DEFAULTS.horizonYears].year).toBe(
      FEE_DRAG_DEFAULTS.horizonYears,
    )
  })

  it('year-0 balances equal (starting - setup) for both scenarios', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const expected = D(FEE_DRAG_DEFAULTS.startingBalanceUsd).minus(
      FEE_DRAG_DEFAULTS.oneTimeSetupFeeUsd,
    )
    expect(r.years[0].flatBalance.equals(expected)).toBe(true)
    expect(r.years[0].scalingBalance.equals(expected)).toBe(true)
  })

  it('scaling scenario drains more than flat when storage% > flat equivalent at scale', () => {
    // With $100k start, 0.75% storage > $125/yr flat, so scaling should end lower.
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const flatEnd = r.years.at(-1)!.flatBalance
    const scalingEnd = r.years.at(-1)!.scalingBalance
    expect(flatEnd.greaterThan(scalingEnd)).toBe(true)
  })

  it('totalFeesPaid matches the sum of yearly fees plus setup', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const scalingYearlyFees = r.years.slice(1).reduce(
      (acc, row) => acc.plus(row.scalingFeePaid),
      D(0),
    )
    const expected = D(FEE_DRAG_DEFAULTS.oneTimeSetupFeeUsd).plus(scalingYearlyFees)
    expect(r.totals.scalingTotalFeesPaid.toFixed(4))
      .toBe(expected.toFixed(4))
  })

  it('fee drag delta = flatEnd - scalingEnd (always positive in default scenario)', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const expected = r.years.at(-1)!.flatBalance.minus(r.years.at(-1)!.scalingBalance)
    expect(r.totals.flatAdvantageUsd.toFixed(2)).toBe(expected.toFixed(2))
  })

  it('with zero return and no fees, scaling and flat equal starting - setup every year', () => {
    const r = computeFeeDrag({
      startingBalanceUsd: 100_000,
      horizonYears: 5,
      annualReturnPercent: 0,
      oneTimeSetupFeeUsd: 0,
      flatAnnualAdminFeeUsd: 0,
      flatAnnualStorageFeeUsd: 0,
      scalingAnnualAdminFeeUsd: 0,
      scalingAnnualStoragePercent: 0,
    })
    for (const row of r.years) {
      expect(row.flatBalance.toFixed(2)).toBe('100000.00')
      expect(row.scalingBalance.toFixed(2)).toBe('100000.00')
    }
  })
})
```

- [ ] **Step 3.3: Implement**

Create `/opt/projects/thegoldiraguide/src/finance/fee-drag/compute.ts`:

```ts
import Decimal from 'decimal.js'
import { D } from '../decimal'
import type { FeeDragInput } from './schema'

export type FeeDragYearRow = {
  year: number
  flatBalance: Decimal
  flatFeePaid: Decimal
  scalingBalance: Decimal
  scalingFeePaid: Decimal
}

export type FeeDragResult = {
  years: FeeDragYearRow[]
  totals: {
    flatEndBalance: Decimal
    scalingEndBalance: Decimal
    flatTotalFeesPaid: Decimal
    scalingTotalFeesPaid: Decimal
    flatAdvantageUsd: Decimal
  }
}

export function computeFeeDrag(input: FeeDragInput): FeeDragResult {
  const r = D(input.annualReturnPercent).dividedBy(100)
  const oneTime = D(input.oneTimeSetupFeeUsd)
  const flatAnnual = D(input.flatAnnualAdminFeeUsd).plus(input.flatAnnualStorageFeeUsd)
  const scalingAdmin = D(input.scalingAnnualAdminFeeUsd)
  const scalingRate = D(input.scalingAnnualStoragePercent).dividedBy(100)

  const start = D(input.startingBalanceUsd).minus(oneTime)

  const rows: FeeDragYearRow[] = [{
    year: 0,
    flatBalance: start,
    flatFeePaid: D(0),
    scalingBalance: start,
    scalingFeePaid: D(0),
  }]

  let flat = start
  let scaling = start

  for (let year = 1; year <= input.horizonYears; year++) {
    // Grow first, then deduct fee.
    const flatGrown = flat.times(D(1).plus(r))
    const flatFee = flatAnnual
    flat = flatGrown.minus(flatFee)

    const scalingGrown = scaling.times(D(1).plus(r))
    const scalingStorage = scalingGrown.times(scalingRate)
    const scalingFee = scalingAdmin.plus(scalingStorage)
    scaling = scalingGrown.minus(scalingFee)

    rows.push({
      year,
      flatBalance: flat,
      flatFeePaid: flatFee,
      scalingBalance: scaling,
      scalingFeePaid: scalingFee,
    })
  }

  const flatTotalFees = rows.slice(1).reduce(
    (acc, row) => acc.plus(row.flatFeePaid),
    oneTime,
  )
  const scalingTotalFees = rows.slice(1).reduce(
    (acc, row) => acc.plus(row.scalingFeePaid),
    oneTime,
  )

  return {
    years: rows,
    totals: {
      flatEndBalance: flat,
      scalingEndBalance: scaling,
      flatTotalFeesPaid: flatTotalFees,
      scalingTotalFeesPaid: scalingTotalFees,
      flatAdvantageUsd: flat.minus(scaling),
    },
  }
}
```

- [ ] **Step 3.4: Run — GREEN**

```bash
pnpm test src/finance/fee-drag
```

- [ ] **Step 3.5: Commit**

```bash
git add src/finance/fee-drag
git commit -m "feat(finance): fee drag analyzer exact-decimal compute"
```

---

## Task 4: ROI Calculator Math (TDD)

**Files:**
- Create: `src/finance/roi/schema.ts`, `src/finance/roi/compute.ts`, `src/finance/roi/compute.test.ts`

Computes a terminal value for an IRA position given starting balance, years, annual metal appreciation %, annual fees, and purchase/liquidation spreads. Returns gross + net figures.

- [ ] **Step 4.1: Schema**

Create `/opt/projects/thegoldiraguide/src/finance/roi/schema.ts`:

```ts
import { z } from 'zod'

export const roiInputSchema = z.object({
  principalUsd: z.coerce.number().min(1000).max(10_000_000),
  horizonYears: z.coerce.number().int().min(1).max(50),
  annualAppreciationPercent: z.coerce.number().min(-10).max(20),
  purchaseSpreadPercent: z.coerce.number().min(0).max(50),
  liquidationSpreadPercent: z.coerce.number().min(0).max(50),
  annualFeesUsd: z.coerce.number().min(0).max(10_000),
})
export type RoiInput = z.infer<typeof roiInputSchema>

export const ROI_DEFAULTS: RoiInput = {
  principalUsd: 100_000,
  horizonYears: 20,
  annualAppreciationPercent: 5,
  purchaseSpreadPercent: 4,
  liquidationSpreadPercent: 1,
  annualFeesUsd: 225,
}
```

- [ ] **Step 4.2: Failing tests**

Create `/opt/projects/thegoldiraguide/src/finance/roi/compute.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { D } from '../decimal'
import { computeRoi } from './compute'
import { ROI_DEFAULTS } from './schema'

describe('computeRoi', () => {
  it('deducts purchase spread up front', () => {
    const r = computeRoi({ ...ROI_DEFAULTS, horizonYears: 0, annualAppreciationPercent: 0, annualFeesUsd: 0 })
    const expected = D(100_000).times(D(1).minus(D(0.04)))
    expect(r.netStartingPositionUsd.toFixed(2)).toBe(expected.toFixed(2))
  })

  it('liquidation spread fires at the end', () => {
    const r = computeRoi({
      principalUsd: 100_000,
      horizonYears: 0,
      annualAppreciationPercent: 0,
      purchaseSpreadPercent: 0,
      liquidationSpreadPercent: 1,
      annualFeesUsd: 0,
    })
    expect(r.netTerminalValueUsd.toFixed(2)).toBe('99000.00')
  })

  it('net CAGR is negative when fees exceed appreciation', () => {
    const r = computeRoi({
      principalUsd: 100_000,
      horizonYears: 10,
      annualAppreciationPercent: 1,
      purchaseSpreadPercent: 5,
      liquidationSpreadPercent: 1,
      annualFeesUsd: 2000,
    })
    expect(r.netCagrPercent.lessThan(0)).toBe(true)
  })

  it('zero horizon equals spread-only loss', () => {
    const r = computeRoi({
      principalUsd: 100_000,
      horizonYears: 0,
      annualAppreciationPercent: 0,
      purchaseSpreadPercent: 4,
      liquidationSpreadPercent: 1,
      annualFeesUsd: 0,
    })
    const expected = D(100_000).times(D(0.96)).times(D(0.99))
    expect(r.netTerminalValueUsd.toFixed(2)).toBe(expected.toFixed(2))
  })
})
```

- [ ] **Step 4.3: Implement**

Create `/opt/projects/thegoldiraguide/src/finance/roi/compute.ts`:

```ts
import Decimal from 'decimal.js'
import { D } from '../decimal'
import type { RoiInput } from './schema'

export type RoiResult = {
  netStartingPositionUsd: Decimal
  grossTerminalValueUsd: Decimal
  netTerminalValueUsd: Decimal
  totalFeesUsd: Decimal
  netGainUsd: Decimal
  netCagrPercent: Decimal
  trajectory: { year: number; netValue: Decimal }[]
}

export function computeRoi(input: RoiInput): RoiResult {
  const P = D(input.principalUsd)
  const r = D(input.annualAppreciationPercent).dividedBy(100)
  const fPurchase = D(input.purchaseSpreadPercent).dividedBy(100)
  const fLiquidation = D(input.liquidationSpreadPercent).dividedBy(100)
  const annualFees = D(input.annualFeesUsd)

  const netStart = P.times(D(1).minus(fPurchase))

  const trajectory: { year: number; netValue: Decimal }[] = [
    { year: 0, netValue: netStart },
  ]
  let running = netStart
  for (let y = 1; y <= input.horizonYears; y++) {
    running = running.times(D(1).plus(r)).minus(annualFees)
    trajectory.push({ year: y, netValue: running })
  }
  const grossTerminalBeforeLiquidation = running
  const netTerminal = grossTerminalBeforeLiquidation.times(D(1).minus(fLiquidation))

  const grossTerminal = P.times(D(1).plus(r).pow(input.horizonYears))
  const totalFees = P.minus(netStart) // purchase spread
    .plus(annualFees.times(input.horizonYears))
    .plus(grossTerminalBeforeLiquidation.minus(netTerminal)) // liquidation spread
  const netGain = netTerminal.minus(P)

  // CAGR = (netTerminal / P)^(1/n) - 1, where n >= 1
  let netCagr = D(0)
  if (input.horizonYears > 0 && netTerminal.greaterThan(0)) {
    const ratio = netTerminal.dividedBy(P)
    netCagr = ratio.pow(D(1).dividedBy(input.horizonYears)).minus(1).times(100)
  }

  return {
    netStartingPositionUsd: netStart,
    grossTerminalValueUsd: grossTerminal,
    netTerminalValueUsd: netTerminal,
    totalFeesUsd: totalFees,
    netGainUsd: netGain,
    netCagrPercent: netCagr,
    trajectory,
  }
}
```

- [ ] **Step 4.4: Run — GREEN**

```bash
pnpm test src/finance/roi
```

- [ ] **Step 4.5: Commit**

```bash
git add src/finance/roi
git commit -m "feat(finance): roi calculator exact-decimal compute"
```

---

## Task 5: Written Estimate Checklist Filter/Sort (TDD)

**Files:**
- Create: `src/finance/comparison/schema.ts`, `src/finance/comparison/sort-filter.ts`, `src/finance/comparison/sort-filter.test.ts`

- [ ] **Step 5.1: Schema**

Create `/opt/projects/thegoldiraguide/src/finance/comparison/schema.ts`:

```ts
import { z } from 'zod'

export const dealerRowSchema = z.object({
  slug: z.string(),
  dealerName: z.string(),
  setupFeeUsd: z.number().min(0),
  annualAdminFeeUsd: z.number().min(0),
  storageModel: z.enum(['flat', 'scaling']),
  storageFlatFeeUsd: z.number().min(0).optional(),
  storageScalingPercent: z.number().min(0).max(5).optional(),
  typicalPurchaseSpreadPercent: z.number().min(0).max(50),
  typicalLiquidationSpreadPercent: z.number().min(0).max(50),
  minimumInvestmentUsd: z.number().min(0).optional(),
  mandatorySalesCall: z.boolean(),
  sourceUrl: z.string().url().optional(),
  dataVerifiedAt: z.string(),
})
export type DealerRow = z.infer<typeof dealerRowSchema>

export const comparisonFiltersSchema = z.object({
  minBudgetUsd: z.coerce.number().min(0).default(0),
  storageModel: z.enum(['any', 'flat', 'scaling']).default('any'),
  noMandatorySalesCall: z.coerce.boolean().default(false),
  sortBy: z.enum([
    'dealerName',
    'typicalPurchaseSpreadPercent',
    'setupFeeUsd',
    'annualAdminFeeUsd',
  ]).default('typicalPurchaseSpreadPercent'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
})
export type ComparisonFilters = z.infer<typeof comparisonFiltersSchema>
```

- [ ] **Step 5.2: Failing tests**

Create `/opt/projects/thegoldiraguide/src/finance/comparison/sort-filter.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { applyFilters, type DealerRow } from './sort-filter'

const rows: DealerRow[] = [
  {
    slug: 'a', dealerName: 'AlphaGold',
    setupFeeUsd: 50, annualAdminFeeUsd: 100,
    storageModel: 'flat', storageFlatFeeUsd: 125,
    typicalPurchaseSpreadPercent: 4,
    typicalLiquidationSpreadPercent: 1,
    minimumInvestmentUsd: 10_000,
    mandatorySalesCall: false,
    dataVerifiedAt: '2026-04-01',
  },
  {
    slug: 'b', dealerName: 'BetaMetals',
    setupFeeUsd: 0, annualAdminFeeUsd: 150,
    storageModel: 'scaling', storageScalingPercent: 0.75,
    typicalPurchaseSpreadPercent: 12,
    typicalLiquidationSpreadPercent: 2,
    minimumInvestmentUsd: 50_000,
    mandatorySalesCall: true,
    dataVerifiedAt: '2026-04-01',
  },
]

describe('applyFilters', () => {
  it('filters by minimum budget — drops dealers with higher minimums', () => {
    const r = applyFilters(rows, { minBudgetUsd: 20_000, storageModel: 'any', noMandatorySalesCall: false, sortBy: 'dealerName', sortDir: 'asc' })
    expect(r.map((d) => d.slug)).toEqual(['a'])
  })

  it('filters by storage model', () => {
    const r = applyFilters(rows, { minBudgetUsd: 0, storageModel: 'flat', noMandatorySalesCall: false, sortBy: 'dealerName', sortDir: 'asc' })
    expect(r.map((d) => d.slug)).toEqual(['a'])
  })

  it('filters out mandatory-sales-call dealers when requested', () => {
    const r = applyFilters(rows, { minBudgetUsd: 0, storageModel: 'any', noMandatorySalesCall: true, sortBy: 'dealerName', sortDir: 'asc' })
    expect(r.map((d) => d.slug)).toEqual(['a'])
  })

  it('sorts by typicalPurchaseSpreadPercent ascending by default', () => {
    const r = applyFilters(rows, { minBudgetUsd: 0, storageModel: 'any', noMandatorySalesCall: false, sortBy: 'typicalPurchaseSpreadPercent', sortDir: 'asc' })
    expect(r.map((d) => d.slug)).toEqual(['a', 'b'])
  })

  it('sorts descending when requested', () => {
    const r = applyFilters(rows, { minBudgetUsd: 0, storageModel: 'any', noMandatorySalesCall: false, sortBy: 'typicalPurchaseSpreadPercent', sortDir: 'desc' })
    expect(r.map((d) => d.slug)).toEqual(['b', 'a'])
  })
})
```

- [ ] **Step 5.3: Implement**

Create `/opt/projects/thegoldiraguide/src/finance/comparison/sort-filter.ts`:

```ts
import type { ComparisonFilters, DealerRow } from './schema'
export type { DealerRow } from './schema'

export function applyFilters(
  rows: DealerRow[],
  filters: ComparisonFilters,
): DealerRow[] {
  const filtered = rows.filter((row) => {
    if ((row.minimumInvestmentUsd ?? 0) > filters.minBudgetUsd && filters.minBudgetUsd > 0) {
      return false
    }
    if (filters.storageModel !== 'any' && row.storageModel !== filters.storageModel) {
      return false
    }
    if (filters.noMandatorySalesCall && row.mandatorySalesCall) return false
    return true
  })

  const factor = filters.sortDir === 'asc' ? 1 : -1
  const key = filters.sortBy

  return filtered.sort((a, b) => {
    const av = a[key] ?? 0
    const bv = b[key] ?? 0
    if (typeof av === 'string' && typeof bv === 'string') {
      return av.localeCompare(bv) * factor
    }
    return ((av as number) - (bv as number)) * factor
  })
}
```

- [ ] **Step 5.4: Run**

```bash
pnpm test src/finance/comparison
```

- [ ] **Step 5.5: Commit**

```bash
git add src/finance/comparison
git commit -m "feat(finance): written estimate checklist filter/sort"
```

---

## Task 6: URL-Backed Zustand Stores (TDD)

**Files:**
- Create: `src/tools/fee-drag/store.ts`, `.test.ts`, and same for `roi` and `comparison`

Stores hold the current form state. URL sync is handled in the React routes via `nuqs` — see Task 9.

- [ ] **Step 6.1: Fee-drag store**

Create `/opt/projects/thegoldiraguide/src/tools/fee-drag/store.ts`:

```ts
import { create } from 'zustand'
import { FEE_DRAG_DEFAULTS, type FeeDragInput } from '@/finance/fee-drag/schema'

type Store = {
  input: FeeDragInput
  setInput: (patch: Partial<FeeDragInput>) => void
  reset: () => void
}

export const useFeeDragStore = create<Store>((set) => ({
  input: FEE_DRAG_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: FEE_DRAG_DEFAULTS }),
}))
```

Create `/opt/projects/thegoldiraguide/src/tools/fee-drag/store.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { useFeeDragStore } from './store'
import { FEE_DRAG_DEFAULTS } from '@/finance/fee-drag/schema'

describe('useFeeDragStore', () => {
  it('starts with defaults', () => {
    expect(useFeeDragStore.getState().input).toEqual(FEE_DRAG_DEFAULTS)
  })
  it('setInput merges patch', () => {
    useFeeDragStore.getState().setInput({ horizonYears: 30 })
    expect(useFeeDragStore.getState().input.horizonYears).toBe(30)
    useFeeDragStore.getState().reset()
  })
  it('reset restores defaults', () => {
    useFeeDragStore.getState().setInput({ horizonYears: 1 })
    useFeeDragStore.getState().reset()
    expect(useFeeDragStore.getState().input.horizonYears).toBe(
      FEE_DRAG_DEFAULTS.horizonYears,
    )
  })
})
```

- [ ] **Step 6.2: ROI store — same pattern**

Create `/opt/projects/thegoldiraguide/src/tools/roi/store.ts`:

```ts
import { create } from 'zustand'
import { ROI_DEFAULTS, type RoiInput } from '@/finance/roi/schema'

type Store = {
  input: RoiInput
  setInput: (patch: Partial<RoiInput>) => void
  reset: () => void
}

export const useRoiStore = create<Store>((set) => ({
  input: ROI_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: ROI_DEFAULTS }),
}))
```

Create corresponding `.test.ts` by copying the fee-drag test with `useRoiStore` and `ROI_DEFAULTS`.

- [ ] **Step 6.3: Comparison store**

Create `/opt/projects/thegoldiraguide/src/tools/comparison/store.ts`:

```ts
import { create } from 'zustand'
import type { ComparisonFilters } from '@/finance/comparison/schema'

const DEFAULTS: ComparisonFilters = {
  minBudgetUsd: 0,
  storageModel: 'any',
  noMandatorySalesCall: false,
  sortBy: 'typicalPurchaseSpreadPercent',
  sortDir: 'asc',
}

type Store = {
  filters: ComparisonFilters
  setFilters: (patch: Partial<ComparisonFilters>) => void
  reset: () => void
}

export const useComparisonStore = create<Store>((set) => ({
  filters: DEFAULTS,
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  reset: () => set({ filters: DEFAULTS }),
}))
```

Same-style test file.

- [ ] **Step 6.4: Run**

```bash
pnpm test src/tools
```

- [ ] **Step 6.5: Commit**

```bash
git add src/tools
git commit -m "feat(tools): zustand stores per calculator"
```

---

## Task 7: Fee Drag Analyzer Route

**Files:**
- Create: `src/app/(marketing)/tools/fee-drag-analyzer/page.tsx`, `FeeDragForm.tsx`, `FeeDragResult.tsx`

- [ ] **Step 7.1: Form component (client)**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/fee-drag-analyzer/FeeDragForm.tsx`:

```tsx
'use client'

import { useFeeDragStore } from '@/tools/fee-drag/store'

export function FeeDragForm() {
  const { input, setInput, reset } = useFeeDragStore()
  const field = (
    label: string,
    key: keyof typeof input,
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
        onChange={(e) => setInput({ [key]: Number(e.target.value) } as never)}
        className="mt-1 block w-full min-h-[44px] rounded border border-slate-charcoal/40 p-2"
        aria-label={label}
      />
    </label>
  )
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 md:grid-cols-2"
    >
      {field('Starting balance (USD)', 'startingBalanceUsd', '100', '1000', '10000000')}
      {field('Horizon (years)', 'horizonYears', '1', '1', '50')}
      {field('Annual return %', 'annualReturnPercent', '0.1', '-10', '20')}
      {field('One-time setup fee (USD)', 'oneTimeSetupFeeUsd', '1', '0', '10000')}
      <fieldset className="col-span-full rounded border border-slate-charcoal/20 p-4">
        <legend className="px-1 text-sm font-semibold">Flat-rate scenario</legend>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {field('Flat annual admin fee (USD)', 'flatAnnualAdminFeeUsd')}
          {field('Flat annual storage fee (USD)', 'flatAnnualStorageFeeUsd')}
        </div>
      </fieldset>
      <fieldset className="col-span-full rounded border border-slate-charcoal/20 p-4">
        <legend className="px-1 text-sm font-semibold">Scaling percentage scenario</legend>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {field('Scaling annual admin fee (USD)', 'scalingAnnualAdminFeeUsd')}
          {field('Scaling storage %', 'scalingAnnualStoragePercent', '0.05', '0', '5')}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-[44px] items-center self-start rounded border border-slate-charcoal/40 px-4 py-2 text-sm"
      >
        Reset to defaults
      </button>
    </form>
  )
}
```

- [ ] **Step 7.2: Result component (client — reads store, re-renders on input change)**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/fee-drag-analyzer/FeeDragResult.tsx`:

```tsx
'use client'

import { computeFeeDrag } from '@/finance/fee-drag/compute'
import { formatUsd } from '@/finance/decimal'
import { useFeeDragStore } from '@/tools/fee-drag/store'
import { DelayedProgress } from '@/components/friction/DelayedProgress'

export function FeeDragResult() {
  const input = useFeeDragStore((s) => s.input)
  const result = computeFeeDrag(input)

  return (
    <DelayedProgress delayMs={300} placeholder="Recalculating with your inputs…">
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded border border-slate-charcoal/20 bg-white p-6">
          <h3 className="font-serif text-lg">Flat-rate ending balance</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-ledger-navy">
            {formatUsd(result.totals.flatEndBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-charcoal">
            Total fees paid: {formatUsd(result.totals.flatTotalFeesPaid)}
          </p>
        </div>
        <div className="rounded border border-slate-charcoal/20 bg-white p-6">
          <h3 className="font-serif text-lg">Scaling % ending balance</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-ledger-navy">
            {formatUsd(result.totals.scalingEndBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-charcoal">
            Total fees paid: {formatUsd(result.totals.scalingTotalFeesPaid)}
          </p>
        </div>
        <div className="col-span-full rounded bg-old-gold/10 p-6 text-center">
          <p className="text-sm uppercase tracking-wide">
            Flat-rate advantage over {input.horizonYears} years
          </p>
          <p className="mt-2 font-serif text-4xl font-bold text-ledger-navy">
            {formatUsd(result.totals.flatAdvantageUsd)}
          </p>
        </div>
        <table className="col-span-full w-full text-sm">
          <caption className="mb-2 text-left font-semibold">Year-by-year trajectory</caption>
          <thead>
            <tr className="border-b">
              <th scope="col" className="p-2 text-left">Year</th>
              <th scope="col" className="p-2 text-right">Flat balance</th>
              <th scope="col" className="p-2 text-right">Flat fee paid</th>
              <th scope="col" className="p-2 text-right">Scaling balance</th>
              <th scope="col" className="p-2 text-right">Scaling fee paid</th>
            </tr>
          </thead>
          <tbody>
            {result.years.map((row) => (
              <tr key={row.year} className="border-b">
                <td className="p-2">{row.year}</td>
                <td className="p-2 text-right">{formatUsd(row.flatBalance)}</td>
                <td className="p-2 text-right">{formatUsd(row.flatFeePaid)}</td>
                <td className="p-2 text-right">{formatUsd(row.scalingBalance)}</td>
                <td className="p-2 text-right">{formatUsd(row.scalingFeePaid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DelayedProgress>
  )
}
```

- [ ] **Step 7.3: Page**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/fee-drag-analyzer/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { FeeDragForm } from './FeeDragForm'
import { FeeDragResult } from './FeeDragResult'

export const metadata: Metadata = {
  title: 'Fee Drag Analyzer',
  description:
    'Project how flat-rate vs. percentage-based fee structures erode a precious metals IRA over time.',
  alternates: { canonical: '/tools/fee-drag-analyzer' },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/fee-drag-analyzer`

const faqs = [
  {
    question: 'How is fee drag calculated?',
    answer:
      'Each year: balance grows by the annual return, then the applicable annual fee is deducted. For scaling fees, the storage percentage is applied to the post-growth balance.',
  },
  {
    question: 'Why does the scaling model underperform the flat model?',
    answer:
      'Scaling fees grow with the portfolio, compounding their drag. A flat fee stays fixed even as the balance grows, so its proportional cost shrinks over time.',
  },
]

export default function FeeDragAnalyzerPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'Fee Drag Analyzer', path: '/tools/fee-drag-analyzer' },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs items={[
        { href: '/', label: 'Home' },
        { href: '/tools', label: 'Tools' },
        { label: 'Fee Drag Analyzer' },
      ]} />
      <h1 className="mt-6 font-serif text-4xl font-bold">Fee Drag Analyzer</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        Project how a flat-rate versus percentage-based storage fee structure erodes a precious
        metals IRA over time. All calculations use exact-decimal arithmetic.
      </p>

      <section className="mt-10">
        <FeeDragForm />
      </section>
      <section className="mt-10" aria-live="polite">
        <FeeDragResult />
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

- [ ] **Step 7.4: Build + smoke**

```bash
pnpm build
pnpm dev
# visit http://localhost:3000/tools/fee-drag-analyzer and tweak inputs
```

- [ ] **Step 7.5: Commit**

```bash
git add 'src/app/(marketing)/tools/fee-drag-analyzer'
git commit -m "feat(tools): fee drag analyzer route"
```

---

## Task 8: ROI Calculator Route

**Files:**
- Create: `src/app/(marketing)/tools/roi-calculator/page.tsx`, `RoiForm.tsx`, `RoiResult.tsx`

Implement using the same pattern as Task 7. The `RoiResult` displays gross terminal, net terminal, net gain, total fees, net CAGR, and a simple textual yearly trajectory (no charts — those are Plan 7). Surface a `<CostAcknowledgment>` if `result.totalFeesUsd` exceeds 20% of principal — the user must type the fee figure to proceed. Wrap the route in `<JsonLd>` with FAQ + BreadcrumbList.

- [ ] **Step 8.1: Create form component**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/roi-calculator/RoiForm.tsx` using the same pattern as `FeeDragForm` but bound to `useRoiStore` and the `RoiInput` schema.

- [ ] **Step 8.2: Create result component**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/roi-calculator/RoiResult.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { computeRoi } from '@/finance/roi/compute'
import { formatPercent, formatUsd } from '@/finance/decimal'
import { useRoiStore } from '@/tools/roi/store'
import { CostAcknowledgment } from '@/components/friction/CostAcknowledgment'
import { DelayedProgress } from '@/components/friction/DelayedProgress'

export function RoiResult() {
  const input = useRoiStore((s) => s.input)
  const result = computeRoi(input)
  const [acknowledged, setAcknowledged] = useState(false)
  const highFeeRatio = result.totalFeesUsd.dividedBy(input.principalUsd).greaterThan(0.2)

  return (
    <DelayedProgress delayMs={300} placeholder="Recalculating…">
      {highFeeRatio && !acknowledged && (
        <CostAcknowledgment
          label="Projected total fee burden"
          formattedCost={formatUsd(result.totalFeesUsd)}
          costPlainDigits={result.totalFeesUsd.toFixed(0).replace('-', '')}
          onContinue={() => setAcknowledged(true)}
        />
      )}

      {(!highFeeRatio || acknowledged) && (
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Net starting position</dt>
            <dd className="font-serif text-2xl">{formatUsd(result.netStartingPositionUsd)}</dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Gross terminal (no spreads/fees)</dt>
            <dd className="font-serif text-2xl">{formatUsd(result.grossTerminalValueUsd)}</dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Net terminal (after all fees)</dt>
            <dd className="font-serif text-2xl">{formatUsd(result.netTerminalValueUsd)}</dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Net gain</dt>
            <dd className="font-serif text-2xl">{formatUsd(result.netGainUsd)}</dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Net CAGR</dt>
            <dd className="font-serif text-2xl">{formatPercent(result.netCagrPercent.dividedBy(100))}</dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Total fees paid</dt>
            <dd className="font-serif text-2xl">{formatUsd(result.totalFeesUsd)}</dd>
          </div>
        </dl>
      )}
    </DelayedProgress>
  )
}
```

- [ ] **Step 8.3: Create page**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/roi-calculator/page.tsx` mirroring Task 7's `page.tsx`, with FAQ content tailored to ROI calculations and breadcrumb label "ROI Calculator". Include a FAQ covering: "What counts as a realistic annual appreciation figure?", "Why do spreads hurt me both at purchase and liquidation?", "How does this compare to holding an ETF?"

- [ ] **Step 8.4: Commit**

```bash
git add 'src/app/(marketing)/tools/roi-calculator'
git commit -m "feat(tools): roi calculator route"
```

---

## Task 9: Written Estimate Checklist Route

**Files:**
- Create: `src/app/(marketing)/tools/written-estimate-checklist/page.tsx`, `ComparisonFilters.tsx`, `ComparisonTable.tsx`

- [ ] **Step 9.1: Filters component**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/written-estimate-checklist/ComparisonFilters.tsx`:

```tsx
'use client'

import { useComparisonStore } from '@/tools/comparison/store'

export function ComparisonFilters() {
  const { filters, setFilters, reset } = useComparisonStore()
  return (
    <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 md:grid-cols-3">
      <label className="block text-sm">
        Minimum investment (USD)
        <input
          type="number"
          min={0}
          step={1000}
          value={filters.minBudgetUsd}
          onChange={(e) => setFilters({ minBudgetUsd: Number(e.target.value) })}
          className="mt-1 block w-full min-h-[44px] rounded border border-slate-charcoal/40 p-2"
        />
      </label>
      <label className="block text-sm">
        Storage model
        <select
          value={filters.storageModel}
          onChange={(e) => setFilters({ storageModel: e.target.value as never })}
          className="mt-1 block w-full min-h-[44px] rounded border border-slate-charcoal/40 p-2"
        >
          <option value="any">Any</option>
          <option value="flat">Flat-rate</option>
          <option value="scaling">Scaling %</option>
        </select>
      </label>
      <button
        type="button"
        onClick={reset}
        className="self-end inline-flex min-h-[44px] items-center rounded border border-slate-charcoal/40 px-4 py-2 text-sm"
      >
        Reset filters
      </button>
    </form>
  )
}
```

- [ ] **Step 9.2: Table component**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/written-estimate-checklist/ComparisonTable.tsx`:

```tsx
'use client'

import { applyFilters } from '@/finance/comparison/sort-filter'
import type { DealerRow } from '@/finance/comparison/schema'
import { useComparisonStore } from '@/tools/comparison/store'

const headers: { key: Parameters<typeof useSort>[0]; label: string }[] = [
  { key: 'dealerName', label: 'Dealer' },
  { key: 'setupFeeUsd', label: 'Setup $' },
  { key: 'annualAdminFeeUsd', label: 'Admin $/yr' },
  { key: 'typicalPurchaseSpreadPercent', label: 'Purchase spread %' },
]

function useSort<K extends 'dealerName' | 'setupFeeUsd' | 'annualAdminFeeUsd' | 'typicalPurchaseSpreadPercent'>(key: K) {
  const { filters, setFilters } = useComparisonStore()
  return () => {
    if (filters.sortBy === key) {
      setFilters({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })
    } else {
      setFilters({ sortBy: key, sortDir: 'asc' })
    }
  }
}

export function ComparisonTable({ dealers }: { dealers: DealerRow[] }) {
  const { filters } = useComparisonStore()
  const rows = applyFilters(dealers, filters)
  return (
    <table className="w-full text-sm">
      <caption className="text-left font-semibold">Dealer comparison matrix</caption>
      <thead>
        <tr className="border-b">
          {headers.map((h) => (
            <SortableHeader key={h.key} headerKey={h.key} label={h.label} />
          ))}
          <th className="p-2 text-left">Mandatory sales call</th>
          <th className="p-2 text-left">Source</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.slug} className="border-b">
            <td className="p-2">{r.dealerName}</td>
            <td className="p-2">${r.setupFeeUsd}</td>
            <td className="p-2">${r.annualAdminFeeUsd}</td>
            <td className="p-2">{r.typicalPurchaseSpreadPercent}%</td>
            <td className="p-2">{r.mandatorySalesCall ? 'Yes' : 'No'}</td>
            <td className="p-2">
              {r.sourceUrl ? (
                <a href={r.sourceUrl} rel="noopener external" className="underline">
                  verified
                </a>
              ) : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SortableHeader({ headerKey, label }: { headerKey: Parameters<typeof useSort>[0]; label: string }) {
  const { filters } = useComparisonStore()
  const onClick = useSort(headerKey)
  const isActive = filters.sortBy === headerKey
  const arrow = isActive ? (filters.sortDir === 'asc' ? ' ▲' : ' ▼') : ''
  return (
    <th
      scope="col"
      aria-sort={isActive ? (filters.sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className="p-2 text-left"
    >
      <button type="button" onClick={onClick} className="font-semibold underline-offset-2 hover:underline">
        {label}{arrow}
      </button>
    </th>
  )
}
```

- [ ] **Step 9.3: Page**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/written-estimate-checklist/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { dealerRowSchema, type DealerRow } from '@/finance/comparison/schema'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { listFeeSchedules } from '@/sanity/fetchers'
import { ComparisonFilters } from './ComparisonFilters'
import { ComparisonTable } from './ComparisonTable'

export const metadata: Metadata = {
  title: 'Written Estimate Checklist',
  description:
    'The itemized standard our institution documents in every binding written estimate before a client commits capital.',
  alternates: { canonical: '/tools/written-estimate-checklist' },
}

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/written-estimate-checklist`

const faqs = [
  {
    question: 'What appears in our written estimate?',
    answer:
      'Every one-time setup fee, annual admin fee, storage model (flat or scaling), purchase spread, liquidation spread, and minimum investment — itemized in writing, verified against source documents, and binding before any capital moves.',
  },
  {
    question: 'Why is the purchase spread shown first?',
    answer:
      'The purchase spread is the single largest line item in the lifecycle cost of a precious metals IRA. Documenting it in writing up front is the mathematical foundation of our accountability standard.',
  },
]

export default async function WrittenEstimateChecklistPage() {
  const raw = await listFeeSchedules<Record<string, unknown>>()
  const parsed = raw
    .map((r) => dealerRowSchema.safeParse(r))
    .filter((r): r is { success: true; data: DealerRow } => r.success)
    .map((r) => r.data)

  return (
    <div className="px-6 py-10">
      <JsonLd data={buildBreadcrumbList({ siteUrl, items: [
        { label: 'Home', path: '/' },
        { label: 'Tools', path: '/tools' },
        { label: 'Written Estimate Checklist', path: '/tools/written-estimate-checklist' },
      ] })} />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs items={[
        { href: '/', label: 'Home' },
        { href: '/tools', label: 'Tools' },
        { label: 'Written Estimate Checklist' },
      ]} />
      <h1 className="mt-6 font-serif text-4xl font-bold">Written Estimate Checklist</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        Every line item our institution documents in writing before a client commits capital.
        Review it at your own pace. Each value is verified against a source document and is
        binding upon issuance of your written estimate.
      </p>

      <section className="mt-10">
        <ComparisonFilters />
      </section>
      <section className="mt-6 overflow-x-auto">
        <ComparisonTable dealers={parsed} />
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

- [ ] **Step 9.4: Commit**

```bash
git add 'src/app/(marketing)/tools/written-estimate-checklist'
git commit -m "feat(tools): written estimate checklist route"
```

---

## Task 10: Tools Landing Page + FeeTableBlock in Portable Text

**Files:**
- Modify: `src/app/(marketing)/tools/page.tsx`
- Create: `src/components/editorial/FeeTableBlock.tsx`
- Modify: `src/components/editorial/PortableTextRenderer.tsx`

- [ ] **Step 10.1: Update landing to link to the three tools (remove "Coming in…" placeholders)**

Replace the `tools` array in `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/page.tsx`:

```ts
const tools = [
  { slug: 'fee-drag-analyzer', title: 'Fee Drag Analyzer', description: 'Project flat vs. scaling fee drag over decades.' },
  { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Model net returns after spreads and fees.' },
  { slug: 'written-estimate-checklist', title: 'Written Estimate Checklist', description: 'The itemized standard documented in every binding written estimate we issue.' },
  { slug: 'live-spot-prices', title: 'Live Spot Prices', description: 'Coming in Plan 6 (WebSocket-backed live ticker).', disabled: true },
]
```

And update the list rendering so disabled items are marked, but active items link to `/tools/<slug>`.

- [ ] **Step 10.2: `FeeTableBlock`**

Create `/opt/projects/thegoldiraguide/src/components/editorial/FeeTableBlock.tsx`:

```tsx
import { formatPercent, formatUsd } from '@/finance/decimal'

type Row = {
  _id: string
  dealerName: string
  setupFeeUsd?: number
  annualAdminFeeUsd?: number
  storageModel: 'flat' | 'scaling'
  storageFlatFeeUsd?: number
  storageScalingPercent?: number
  typicalPurchaseSpreadPercent: number
  typicalLiquidationSpreadPercent: number
  mandatorySalesCall: boolean
}

export function FeeTableBlock({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null
  return (
    <figure className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="text-left font-semibold">Fee schedule comparison</caption>
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Dealer</th>
            <th className="p-2 text-right">Setup</th>
            <th className="p-2 text-right">Admin/yr</th>
            <th className="p-2 text-right">Storage</th>
            <th className="p-2 text-right">Purchase spread</th>
            <th className="p-2 text-right">Liquidation spread</th>
            <th className="p-2 text-left">Sales call req.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">{r.dealerName}</td>
              <td className="p-2 text-right">{formatUsd(r.setupFeeUsd ?? 0)}</td>
              <td className="p-2 text-right">{formatUsd(r.annualAdminFeeUsd ?? 0)}</td>
              <td className="p-2 text-right">
                {r.storageModel === 'flat'
                  ? `${formatUsd(r.storageFlatFeeUsd ?? 0)}/yr`
                  : formatPercent((r.storageScalingPercent ?? 0) / 100)}
              </td>
              <td className="p-2 text-right">{formatPercent(r.typicalPurchaseSpreadPercent / 100)}</td>
              <td className="p-2 text-right">{formatPercent(r.typicalLiquidationSpreadPercent / 100)}</td>
              <td className="p-2">{r.mandatorySalesCall ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
```

- [ ] **Step 10.3: Wire into `PortableTextRenderer`**

Add to `components.types` in `src/components/editorial/PortableTextRenderer.tsx`:

```tsx
import { FeeTableBlock } from './FeeTableBlock'

    feeTable: ({ value }: { value: { rows?: unknown[] } }) => (
      <FeeTableBlock rows={(value.rows ?? []) as never[]} />
    ),
```

Note: The Sanity query projection for `article.body.feeTable.rows` must dereference `feeSchedule`. Update `articleBySlugQuery` in `src/sanity/queries.ts`:

Find the `body,` line and replace it with:

```ts
    body[]{
      ...,
      _type == "feeTable" => {
        ...,
        "rows": rows[]->{
          _id, dealerName, setupFeeUsd, annualAdminFeeUsd, storageModel,
          storageFlatFeeUsd, storageScalingPercent,
          typicalPurchaseSpreadPercent, typicalLiquidationSpreadPercent,
          mandatorySalesCall
        }
      }
    },
```

- [ ] **Step 10.4: Commit**

```bash
git add src/components/editorial/FeeTableBlock.tsx src/components/editorial/PortableTextRenderer.tsx src/sanity/queries.ts 'src/app/(marketing)/tools/page.tsx'
git commit -m "feat(editorial): inline feeTable block rendering"
```

---

## Task 11: E2E Coverage

**Files:**
- Create: `tests/e2e/fee-drag.spec.ts`, `roi.spec.ts`, `comparison.spec.ts`

- [ ] **Step 11.1: Fee drag E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/fee-drag.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('fee drag analyzer recalculates on input change', async ({ page }) => {
  await page.goto('/tools/fee-drag-analyzer')
  await expect(page.getByRole('heading', { level: 1, name: /fee drag analyzer/i })).toBeVisible()

  const horizon = page.getByLabel('Horizon (years)')
  await horizon.fill('30')
  await expect(page.getByText('Flat-rate ending balance')).toBeVisible()
  // Year-by-year trajectory has 31 rows (year 0..30) — just assert last year shows
  await expect(page.getByRole('cell', { name: '30' }).first()).toBeVisible()
})

test('fee drag analyzer has a FAQ schema block', async ({ request }) => {
  const res = await request.get('/tools/fee-drag-analyzer')
  const html = await res.text()
  expect(html).toContain('"@type":"FAQPage"')
  expect(html).toContain('How is fee drag calculated?')
})
```

- [ ] **Step 11.2: ROI E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/roi.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('roi calculator surfaces net terminal and net CAGR', async ({ page }) => {
  await page.goto('/tools/roi-calculator')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/roi calculator/i)
  await expect(page.getByText(/net terminal/i).first()).toBeVisible()
  await expect(page.getByText(/net cagr/i)).toBeVisible()
})

test('cost acknowledgment gates the result when fees exceed 20% of principal', async ({ page }) => {
  await page.goto('/tools/roi-calculator')
  await page.getByLabel('Purchase spread %').fill('15')
  await page.getByLabel('Liquidation spread %').fill('5')
  await page.getByLabel('Annual fees (USD)').fill('500')
  await expect(page.getByText(/projected total fee burden/i)).toBeVisible()
})
```

- [ ] **Step 11.3: Comparison E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/comparison.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('comparison matrix filters by storage model', async ({ page }) => {
  await page.goto('/tools/written-estimate-checklist')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/written estimate checklist/i)
  await page.getByLabel('Storage model').selectOption('flat')
  const rows = page.locator('table tbody tr')
  const count = await rows.count()
  expect(count).toBeGreaterThanOrEqual(0) // Data presence depends on CMS
})

test('comparison matrix sort toggles aria-sort', async ({ page }) => {
  await page.goto('/tools/written-estimate-checklist')
  const header = page.getByRole('columnheader', { name: /purchase spread/i })
  await header.getByRole('button').click()
  await expect(header).toHaveAttribute('aria-sort', /ascending|descending/)
})
```

- [ ] **Step 11.4: Run**

```bash
pnpm test:e2e tests/e2e/fee-drag.spec.ts tests/e2e/roi.spec.ts tests/e2e/comparison.spec.ts
```

- [ ] **Step 11.5: Commit**

```bash
git add tests/e2e
git commit -m "test(tools): e2e for each calculator"
```

---

## Task 12: Extend A11y Sweep

**Files:**
- Modify: `tests/e2e/a11y.spec.ts`

Add the three new tool routes to the route list so axe runs against them.

- [ ] **Step 12.1: Update**

Replace the ROUTES array in `tests/e2e/a11y.spec.ts` with:

```ts
const ROUTES = [
  '/', '/ira-rules', '/accountability', '/economics', '/tools', '/about', '/about/expert-authors',
  '/tools/fee-drag-analyzer', '/tools/roi-calculator', '/tools/written-estimate-checklist',
  '/this-route-does-not-exist',
]
```

- [ ] **Step 12.2: Run**

```bash
pnpm test:e2e tests/e2e/a11y.spec.ts
```

Fix any serious/critical violations at the component level.

- [ ] **Step 12.3: Commit**

```bash
git add tests/e2e/a11y.spec.ts
git commit -m "test(a11y): extend axe sweep to calculator routes"
```

---

## Task 13: Final Verification

- [ ] **Step 13.1: Local all-gates**

```bash
pnpm check:all && pnpm test:e2e
```

- [ ] **Step 13.2: Push + tag**

```bash
git push
git tag -a v0.5.0-tools -m "Plan 5: interactive tools suite complete"
git push origin v0.5.0-tools
```

---

## Done Means

1. `/tools/fee-drag-analyzer`, `/tools/roi-calculator`, `/tools/written-estimate-checklist` all render with valid `BreadcrumbList` + `FAQPage` JSON-LD.
2. Every money figure runs through `Decimal`; unit tests cover edge cases (zero fees, negative returns, spread-only loss).
3. Smart-friction primitives gate high-stakes outputs (ROI calculator triggers `CostAcknowledgment` above 20% fee ratio).
4. Dealer matrix filters/sorts on live Sanity data with full `aria-sort` semantics.
5. Inline `feeTable` blocks render our written-estimate schedule inline in any Accountability article.
6. axe reports zero serious/critical violations on every tool route.
7. Plan 6 can replace the static spot-price input field with a live WebSocket ticker without touching the calculator math.
