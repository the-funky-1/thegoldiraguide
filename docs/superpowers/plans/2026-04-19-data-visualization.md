# Plan 7: Data Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–6 shipped.

**Goal:** Ship accessible, performance-conscious data visualization: a `<StackedAreaChart>` for cumulative fee composition, a `<WaterfallChart>` for step-by-step cost attribution, and a `<TimeSeriesLineChart>` for historical spot prices. Every chart is paired with a mandatory `<ChartDataTable>` that renders the same data in accessible HTML — so screen-reader users and headless crawlers see everything sighted users do. No chart uses color as the sole indicator (every series has a distinct pattern + shape), and every chart is lazy-loaded so the base bundle stays under budget. Integrate charts into the Fee Drag Analyzer (replacing the tabular trajectory) and the Live Spot Prices page (adding a 30-day history).

**Architecture:** A `<Chart>` primitive (`src/components/charts/Chart.tsx`) owns the accessible scaffold: a `<figure>` with `aria-labelledby` pointing at a visible `<ChartTitle>` and `aria-describedby` pointing at a visible `<ChartCaption>`. Below every chart, a `<ChartDataTable>` renders the same dataset in HTML. The graphic library is an implementation detail of each specific chart component — never leaks into consumers. Recharts (SVG, ~40KB gz) powers simpler stacked-area and waterfall; Apache ECharts (Canvas, lazily imported as ~120KB gz) powers the time-series with thousands of points. Each chart module dynamically `import()`s its graphics library so the cost is paid only on routes that use it.

**Tech stack additions:** `recharts@^2.12`, `echarts@^5`, `echarts-for-react` (thin React wrapper).

**Out of scope:** Custom brand palette finalization (Plan 8 locks in the final token set — for now this plan ships a CVD-safe placeholder palette in `src/charts/palette.ts`). Chart-as-image export, sharing as static PNG (future work).

---

## File Structure

- `src/charts/palette.ts` + `.test.ts` — CVD-safe tokens + pattern generators
- `src/charts/types.ts` — shared `Series`, `SeriesPoint`, `WaterfallStep`
- `src/components/charts/Chart.tsx` + `.test.tsx` — accessible scaffold
- `src/components/charts/ChartDataTable.tsx` + `.test.tsx`
- `src/components/charts/StackedAreaChart.tsx` + `.test.tsx`
- `src/components/charts/WaterfallChart.tsx` + `.test.tsx`
- `src/components/charts/TimeSeriesLineChart.tsx` + `.test.tsx`
- `src/components/charts/dynamic.ts` — lazy wrappers (`dynamic(import(...), {ssr: false})`)
- Integration:
  - Modify `src/app/(marketing)/tools/fee-drag-analyzer/FeeDragResult.tsx` — replace trajectory table with `<StackedAreaChart>` + `<WaterfallChart>`
  - New `src/app/api/metals/history/route.ts` — 30-day OHLC history proxy
  - Modify `src/app/(marketing)/tools/live-spot-prices/page.tsx` — add history section with `<TimeSeriesLineChart>`
- `src/market/providers/metalprice-history.ts` + `.test.ts`
- `tests/e2e/charts.spec.ts`

Design rule: **No chart component contains its own data-fetching.** All charts receive data as props. This keeps them unit-testable, server-renderable, and reusable.

---

## Task 1: Color-Blind-Safe Palette + Pattern Tokens (TDD)

**Files:**
- Create: `src/charts/palette.ts`, `src/charts/palette.test.ts`, `src/charts/types.ts`

Uses the Paul Tol qualitative palette (CVD-safe) — 6 distinct hues that remain distinguishable under protanopia, deuteranopia, and tritanopia. Every color is paired with a deterministic SVG `<pattern>` ID so charts can differentiate series without relying on color.

- [ ] **Step 1.1: Install**

```bash
pnpm add recharts@^2.12 echarts@^5 echarts-for-react
```

- [ ] **Step 1.2: Shared types**

Create `/opt/projects/thegoldiraguide/src/charts/types.ts`:

```ts
export type SeriesPoint = { x: string | number; y: number }

export type Series = {
  id: string
  label: string
  points: SeriesPoint[]
}

export type WaterfallStep = {
  label: string
  delta: number // signed; positive = gain, negative = cost
  tone?: 'positive' | 'negative' | 'neutral'
}
```

- [ ] **Step 1.3: Failing palette tests**

Create `/opt/projects/thegoldiraguide/src/charts/palette.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  CHART_PALETTE,
  PATTERN_IDS,
  chartSeriesColor,
  chartSeriesPatternId,
} from './palette'

describe('CHART_PALETTE', () => {
  it('has at least 6 distinct hex colors', () => {
    expect(CHART_PALETTE.length).toBeGreaterThanOrEqual(6)
    const unique = new Set(CHART_PALETTE)
    expect(unique.size).toBe(CHART_PALETTE.length)
    for (const c of CHART_PALETTE) expect(c).toMatch(/^#[0-9a-f]{6}$/i)
  })
  it('provides a pattern ID per palette slot', () => {
    expect(PATTERN_IDS.length).toBe(CHART_PALETTE.length)
    for (const id of PATTERN_IDS) expect(id).toMatch(/^chart-pattern-\d+$/)
  })
})

describe('chartSeriesColor', () => {
  it('wraps around the palette so index > length still returns a valid hex', () => {
    expect(chartSeriesColor(0)).toBe(CHART_PALETTE[0])
    expect(chartSeriesColor(CHART_PALETTE.length)).toBe(CHART_PALETTE[0])
  })
})

describe('chartSeriesPatternId', () => {
  it('returns the pattern id matching the color index', () => {
    expect(chartSeriesPatternId(1)).toBe(PATTERN_IDS[1])
  })
})
```

- [ ] **Step 1.4: Implement**

Create `/opt/projects/thegoldiraguide/src/charts/palette.ts`:

```ts
// Paul Tol qualitative palette — safe for protanopia, deuteranopia, tritanopia.
// Source: https://personal.sron.nl/~pault/
export const CHART_PALETTE = [
  '#332288', // indigo
  '#117733', // green
  '#DDCC77', // sand
  '#CC6677', // rose
  '#AA4499', // purple
  '#88CCEE', // sky
] as const

export const PATTERN_IDS = CHART_PALETTE.map((_, i) => `chart-pattern-${i}`)

export function chartSeriesColor(index: number): string {
  return CHART_PALETTE[Math.abs(index) % CHART_PALETTE.length]
}

export function chartSeriesPatternId(index: number): string {
  return PATTERN_IDS[Math.abs(index) % PATTERN_IDS.length]
}

// Deterministic SVG pattern definitions consumed by chart components.
export function svgPatternDefs(): string {
  return `
    <defs>
      ${CHART_PALETTE.map((color, i) => `
        <pattern id="${PATTERN_IDS[i]}" patternUnits="userSpaceOnUse" width="8" height="8">
          ${
            i % 3 === 0
              ? `<line x1="0" y1="0" x2="8" y2="8" stroke="${color}" stroke-width="2"/>`
              : i % 3 === 1
                ? `<circle cx="4" cy="4" r="2" fill="${color}"/>`
                : `<rect width="4" height="4" fill="${color}"/>`
          }
          <rect width="8" height="8" fill="${color}" opacity="0.35"/>
        </pattern>
      `).join('')}
    </defs>
  `
}
```

- [ ] **Step 1.5: Run — GREEN**

```bash
pnpm test src/charts/palette.test.ts
```

- [ ] **Step 1.6: Commit**

```bash
git add src/charts package.json pnpm-lock.yaml
git commit -m "feat(charts): cvd-safe palette tokens and pattern generators"
```

---

## Task 2: Accessible `<Chart>` Scaffold + `<ChartDataTable>` (TDD)

**Files:**
- Create: `src/components/charts/Chart.tsx`, `.test.tsx`, `ChartDataTable.tsx`, `.test.tsx`

- [ ] **Step 2.1: `ChartDataTable` failing test**

Create `/opt/projects/thegoldiraguide/src/components/charts/ChartDataTable.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChartDataTable } from './ChartDataTable'

describe('ChartDataTable', () => {
  it('renders a table with the given caption and headers', () => {
    render(
      <ChartDataTable
        caption="Year-by-year balance"
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'flat', label: 'Flat' },
        ]}
        rows={[
          { year: 1, flat: '$100,000' },
          { year: 2, flat: '$99,875' },
        ]}
      />,
    )
    const table = screen.getByRole('table', { name: /year-by-year balance/i })
    expect(table).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Flat' })).toBeInTheDocument()
    expect(screen.getByText('$100,000')).toBeInTheDocument()
  })

  it('supports a collapsible wrapper that starts open', () => {
    render(
      <ChartDataTable
        caption="x"
        columns={[{ key: 'a', label: 'A' }]}
        rows={[{ a: '1' }]}
        collapsible
      />,
    )
    const details = screen.getByRole('group')
    expect(details).toHaveAttribute('open')
  })
})
```

- [ ] **Step 2.2: Implement**

Create `/opt/projects/thegoldiraguide/src/components/charts/ChartDataTable.tsx`:

```tsx
export type Column = { key: string; label: string; align?: 'left' | 'right' }

type Row = Record<string, React.ReactNode>

export function ChartDataTable({
  caption,
  columns,
  rows,
  collapsible = false,
}: {
  caption: string
  columns: Column[]
  rows: Row[]
  collapsible?: boolean
}) {
  const table = (
    <table className="w-full text-sm">
      <caption className="text-left font-semibold">{caption}</caption>
      <thead>
        <tr className="border-b">
          {columns.map((c) => (
            <th
              key={c.key}
              scope="col"
              className={`p-2 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b">
            {columns.map((c) => (
              <td
                key={c.key}
                className={`p-2 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {row[c.key] ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  if (!collapsible) return table
  return (
    <details open role="group">
      <summary className="cursor-pointer text-sm font-semibold underline-offset-2 hover:underline">
        Show the data
      </summary>
      <div className="mt-4 overflow-x-auto">{table}</div>
    </details>
  )
}
```

- [ ] **Step 2.3: `Chart` primitive failing test**

Create `/opt/projects/thegoldiraguide/src/components/charts/Chart.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Chart } from './Chart'

describe('Chart', () => {
  it('wraps children in a <figure> with aria-labelledby and aria-describedby', () => {
    render(
      <Chart title="30-year fee drag" description="Flat vs scaling storage.">
        <svg data-testid="canvas" />
      </Chart>,
    )
    const figure = screen.getByRole('figure', { name: /30-year fee drag/i })
    const titleId = figure.getAttribute('aria-labelledby')
    const descId = figure.getAttribute('aria-describedby')
    expect(titleId).toBeTruthy()
    expect(descId).toBeTruthy()
    expect(document.getElementById(titleId!)).toHaveTextContent('30-year fee drag')
    expect(document.getElementById(descId!)).toHaveTextContent('Flat vs scaling storage.')
  })
})
```

- [ ] **Step 2.4: Implement**

Create `/opt/projects/thegoldiraguide/src/components/charts/Chart.tsx`:

```tsx
import { useId } from 'react'

export function Chart({
  title,
  description,
  children,
  dataTable,
}: {
  title: string
  description: string
  children: React.ReactNode
  dataTable?: React.ReactNode
}) {
  const id = useId()
  const titleId = `${id}-title`
  const descId = `${id}-desc`
  return (
    <figure
      role="figure"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8"
    >
      <h3 id={titleId} className="font-serif text-lg font-semibold">
        {title}
      </h3>
      <p id={descId} className="mt-1 text-sm text-slate-charcoal">
        {description}
      </p>
      <div
        className="mt-4 rounded border border-slate-charcoal/20 bg-white p-4"
        role="presentation"
      >
        {children}
      </div>
      {dataTable && <div className="mt-4 overflow-x-auto">{dataTable}</div>}
    </figure>
  )
}
```

- [ ] **Step 2.5: Run**

```bash
pnpm test src/components/charts
```

- [ ] **Step 2.6: Commit**

```bash
git add src/components/charts/Chart.tsx src/components/charts/Chart.test.tsx src/components/charts/ChartDataTable.tsx src/components/charts/ChartDataTable.test.tsx
git commit -m "feat(charts): accessible figure scaffold and companion data table"
```

---

## Task 3: Dynamic-Import Wrappers for Heavy Libs

**Files:**
- Create: `src/components/charts/dynamic.ts`

Keeps ECharts out of the base bundle.

- [ ] **Step 3.1: Implement**

Create `/opt/projects/thegoldiraguide/src/components/charts/dynamic.ts`:

```ts
'use client'

import dynamic from 'next/dynamic'

export const ReactECharts = dynamic(
  async () => {
    const [echarts, core] = await Promise.all([
      import('echarts-for-react'),
      import('echarts/core'),
    ])
    const { LineChart, BarChart } = await import('echarts/charts')
    const { GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent } =
      await import('echarts/components')
    const { CanvasRenderer } = await import('echarts/renderers')
    core.use([
      LineChart,
      BarChart,
      GridComponent,
      TooltipComponent,
      TitleComponent,
      LegendComponent,
      DataZoomComponent,
      CanvasRenderer,
    ])
    return echarts.default
  },
  { ssr: false, loading: () => <div className="h-64" aria-hidden /> },
)
```

- [ ] **Step 3.2: Commit**

```bash
git add src/components/charts/dynamic.ts
git commit -m "feat(charts): lazy echarts wrapper to keep base bundle small"
```

---

## Task 4: `<StackedAreaChart>` (Recharts) + Data Table (TDD)

**Files:**
- Create: `src/components/charts/StackedAreaChart.tsx`, `.test.tsx`

- [ ] **Step 4.1: Failing test (render smoke + data-table companion)**

Create `/opt/projects/thegoldiraguide/src/components/charts/StackedAreaChart.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StackedAreaChart } from './StackedAreaChart'

const series = [
  { id: 'flat', label: 'Flat-rate', points: [{ x: 0, y: 100 }, { x: 1, y: 95 }] },
  { id: 'scaling', label: 'Scaling %', points: [{ x: 0, y: 100 }, { x: 1, y: 90 }] },
]

describe('StackedAreaChart', () => {
  it('renders the title, description, and a data table', () => {
    render(
      <StackedAreaChart
        title="Balance over time"
        description="Balance trajectory for each scenario."
        xLabel="Year"
        yLabel="Balance ($)"
        series={series}
        formatValue={(n) => `$${n.toFixed(0)}`}
      />,
    )
    expect(screen.getByRole('figure', { name: /balance over time/i })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /balance over time/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Flat-rate' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Scaling %' })).toBeInTheDocument()
    expect(screen.getByText('$95')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4.2: Implement**

Create `/opt/projects/thegoldiraguide/src/components/charts/StackedAreaChart.tsx`:

```tsx
'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartSeriesColor } from '@/charts/palette'
import type { Series } from '@/charts/types'
import { Chart } from './Chart'
import { ChartDataTable } from './ChartDataTable'

type Props = {
  title: string
  description: string
  xLabel: string
  yLabel: string
  series: Series[]
  formatValue: (n: number) => string
}

export function StackedAreaChart({
  title,
  description,
  xLabel,
  yLabel,
  series,
  formatValue,
}: Props) {
  // Merge points onto a single X axis.
  const xValues = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => String(p.x)))),
  ).map((x) => (Number.isFinite(Number(x)) ? Number(x) : x))

  const rows = xValues.map((x) => {
    const row: Record<string, number | string> = { x }
    for (const s of series) {
      row[s.id] = s.points.find((p) => String(p.x) === String(x))?.y ?? 0
    }
    return row
  })

  return (
    <Chart
      title={title}
      description={description}
      dataTable={
        <ChartDataTable
          caption={title}
          collapsible
          columns={[
            { key: 'x', label: xLabel },
            ...series.map((s) => ({
              key: s.id,
              label: s.label,
              align: 'right' as const,
            })),
          ]}
          rows={rows.map((r) => ({
            x: String(r.x),
            ...Object.fromEntries(
              series.map((s) => [s.id, formatValue(Number(r[s.id]))]),
            ),
          }))}
        />
      }
    >
      <div aria-hidden className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: xLabel, position: 'insideBottom', offset: -4 }} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} tickFormatter={formatValue} />
            <Tooltip formatter={(v: number) => formatValue(v)} />
            <Legend />
            {series.map((s, i) => (
              <Area
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.label}
                stroke={chartSeriesColor(i)}
                fill={chartSeriesColor(i)}
                fillOpacity={0.4}
                strokeWidth={2}
                strokeDasharray={i % 2 === 0 ? '' : '6 4'}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Chart>
  )
}
```

- [ ] **Step 4.3: Run**

```bash
pnpm test src/components/charts/StackedAreaChart.test.tsx
```

- [ ] **Step 4.4: Commit**

```bash
git add src/components/charts/StackedAreaChart.tsx src/components/charts/StackedAreaChart.test.tsx
git commit -m "feat(charts): stacked area chart with mandatory data table"
```

---

## Task 5: `<WaterfallChart>` (TDD)

**Files:**
- Create: `src/components/charts/WaterfallChart.tsx`, `.test.tsx`

- [ ] **Step 5.1: Failing test**

Create `/opt/projects/thegoldiraguide/src/components/charts/WaterfallChart.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WaterfallChart } from './WaterfallChart'

const steps = [
  { label: 'Principal', delta: 100_000 },
  { label: 'Purchase spread', delta: -4000, tone: 'negative' as const },
  { label: 'Annual fees', delta: -1250, tone: 'negative' as const },
  { label: 'Appreciation', delta: 15_000, tone: 'positive' as const },
  { label: 'Liquidation spread', delta: -1097, tone: 'negative' as const },
]

describe('WaterfallChart', () => {
  it('renders step labels and running totals in the data table', () => {
    render(
      <WaterfallChart
        title="30-yr cost attribution"
        description="Each bar is a signed delta."
        steps={steps}
        formatValue={(n) => `$${n.toLocaleString()}`}
      />,
    )
    const figure = screen.getByRole('figure', { name: /30-yr cost attribution/i })
    expect(figure).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Purchase spread')).toBeInTheDocument()
    // Data table renders cumulative totals
    expect(screen.getByRole('columnheader', { name: 'Running total' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 5.2: Implement**

Create `/opt/projects/thegoldiraguide/src/components/charts/WaterfallChart.tsx`:

```tsx
'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WaterfallStep } from '@/charts/types'
import { Chart } from './Chart'
import { ChartDataTable } from './ChartDataTable'

type Props = {
  title: string
  description: string
  steps: WaterfallStep[]
  formatValue: (n: number) => string
}

type Bar = {
  label: string
  base: number
  delta: number
  total: number
  tone: 'positive' | 'negative' | 'neutral'
}

function toBars(steps: WaterfallStep[]): Bar[] {
  const bars: Bar[] = []
  let running = 0
  for (const step of steps) {
    const base = step.delta >= 0 ? running : running + step.delta
    running += step.delta
    bars.push({
      label: step.label,
      base,
      delta: Math.abs(step.delta),
      total: running,
      tone: step.tone ?? (step.delta >= 0 ? 'positive' : 'negative'),
    })
  }
  return bars
}

const TONE_FILL: Record<Bar['tone'], string> = {
  positive: '#117733',
  negative: '#CC6677',
  neutral: '#4B5563',
}

export function WaterfallChart({ title, description, steps, formatValue }: Props) {
  const bars = toBars(steps)
  return (
    <Chart
      title={title}
      description={description}
      dataTable={
        <ChartDataTable
          caption={title}
          collapsible
          columns={[
            { key: 'label', label: 'Step' },
            { key: 'delta', label: 'Delta', align: 'right' },
            { key: 'total', label: 'Running total', align: 'right' },
          ]}
          rows={bars.map((b) => ({
            label: b.label,
            delta: formatValue(b.tone === 'negative' ? -b.delta : b.delta),
            total: formatValue(b.total),
          }))}
        />
      }
    >
      <div aria-hidden className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis tickFormatter={formatValue} />
            <Tooltip formatter={(_v, _k, entry) => formatValue((entry as { payload: Bar }).payload.total)} />
            {/* Invisible base positions each bar above the running total */}
            <Bar dataKey="base" stackId="w" fill="transparent" />
            <Bar dataKey="delta" stackId="w">
              {bars.map((b, i) => (
                <Bar key={i} fill={TONE_FILL[b.tone]} />
              ))}
              <LabelList
                dataKey="total"
                position="top"
                formatter={(v: number) => formatValue(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Chart>
  )
}
```

- [ ] **Step 5.3: Run**

```bash
pnpm test src/components/charts/WaterfallChart.test.tsx
```

- [ ] **Step 5.4: Commit**

```bash
git add src/components/charts/WaterfallChart.tsx src/components/charts/WaterfallChart.test.tsx
git commit -m "feat(charts): waterfall cost-attribution chart"
```

---

## Task 6: `<TimeSeriesLineChart>` (ECharts) (TDD)

**Files:**
- Create: `src/components/charts/TimeSeriesLineChart.tsx`, `.test.tsx`

- [ ] **Step 6.1: Failing test (smoke + data table)**

Create `/opt/projects/thegoldiraguide/src/components/charts/TimeSeriesLineChart.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TimeSeriesLineChart } from './TimeSeriesLineChart'

// Mock the dynamic ECharts wrapper so tests don't spin up a canvas.
vi.mock('./dynamic', () => ({
  ReactECharts: ({ option }: { option: unknown }) => (
    <div data-testid="echarts" data-option={JSON.stringify(option)} />
  ),
}))

const series = [
  {
    id: 'gold',
    label: 'Gold',
    points: [
      { x: '2026-03-20', y: 2480 },
      { x: '2026-03-21', y: 2495 },
      { x: '2026-03-22', y: 2503 },
    ],
  },
]

describe('TimeSeriesLineChart', () => {
  it('renders the figure + companion data table', () => {
    render(
      <TimeSeriesLineChart
        title="30-day gold"
        description="USD per troy ounce."
        series={series}
        formatValue={(n) => `$${n.toFixed(2)}`}
      />,
    )
    expect(screen.getByRole('figure', { name: /30-day gold/i })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /30-day gold/i })).toBeInTheDocument()
    expect(screen.getByText('$2495.00')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6.2: Implement**

Create `/opt/projects/thegoldiraguide/src/components/charts/TimeSeriesLineChart.tsx`:

```tsx
'use client'

import { chartSeriesColor } from '@/charts/palette'
import type { Series } from '@/charts/types'
import { Chart } from './Chart'
import { ChartDataTable } from './ChartDataTable'
import { ReactECharts } from './dynamic'

type Props = {
  title: string
  description: string
  series: Series[]
  formatValue: (n: number) => string
}

export function TimeSeriesLineChart({ title, description, series, formatValue }: Props) {
  const xAxisCategories = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => String(p.x)))),
  ).sort()

  const option = {
    grid: { top: 40, bottom: 60, left: 60, right: 20 },
    tooltip: { trigger: 'axis' },
    legend: { data: series.map((s) => s.label), top: 0 },
    xAxis: {
      type: 'category',
      data: xAxisCategories,
      axisLabel: { interval: Math.floor(xAxisCategories.length / 8) },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => formatValue(v) },
    },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    series: series.map((s, i) => ({
      name: s.label,
      type: 'line',
      smooth: true,
      symbol: ['circle', 'triangle', 'rect', 'diamond'][i % 4],
      lineStyle: {
        color: chartSeriesColor(i),
        width: 2,
        type: i % 2 === 0 ? 'solid' : 'dashed',
      },
      itemStyle: { color: chartSeriesColor(i) },
      data: xAxisCategories.map(
        (x) => s.points.find((p) => String(p.x) === x)?.y ?? null,
      ),
    })),
  }

  const rows = xAxisCategories.map((x) => ({
    x,
    ...Object.fromEntries(
      series.map((s) => [
        s.id,
        (() => {
          const pt = s.points.find((p) => String(p.x) === x)
          return pt ? formatValue(pt.y) : '—'
        })(),
      ]),
    ),
  }))

  return (
    <Chart
      title={title}
      description={description}
      dataTable={
        <ChartDataTable
          caption={title}
          collapsible
          columns={[
            { key: 'x', label: 'Date' },
            ...series.map((s) => ({ key: s.id, label: s.label, align: 'right' as const })),
          ]}
          rows={rows}
        />
      }
    >
      <div aria-hidden className="h-80">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Chart>
  )
}
```

- [ ] **Step 6.3: Run**

```bash
pnpm test src/components/charts/TimeSeriesLineChart.test.tsx
```

- [ ] **Step 6.4: Commit**

```bash
git add src/components/charts/TimeSeriesLineChart.tsx src/components/charts/TimeSeriesLineChart.test.tsx
git commit -m "feat(charts): time-series line chart powered by echarts"
```

---

## Task 7: Upgrade Fee Drag Analyzer Result with Charts

**Files:**
- Modify: `src/app/(marketing)/tools/fee-drag-analyzer/FeeDragResult.tsx`

Replace the raw trajectory table with a `<StackedAreaChart>` (two series: flat + scaling) and a `<WaterfallChart>` (principal → setup → cumulative fees → appreciation → ending balance).

- [ ] **Step 7.1: Update FeeDragResult**

Replace `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/fee-drag-analyzer/FeeDragResult.tsx`:

```tsx
'use client'

import { computeFeeDrag } from '@/finance/fee-drag/compute'
import { formatUsd } from '@/finance/decimal'
import { useFeeDragStore } from '@/tools/fee-drag/store'
import { StackedAreaChart } from '@/components/charts/StackedAreaChart'
import { WaterfallChart } from '@/components/charts/WaterfallChart'
import { DelayedProgress } from '@/components/friction/DelayedProgress'

export function FeeDragResult() {
  const input = useFeeDragStore((s) => s.input)
  const result = computeFeeDrag(input)

  const series = [
    {
      id: 'flat',
      label: 'Flat-rate balance',
      points: result.years.map((row) => ({ x: row.year, y: Number(row.flatBalance.toFixed(2)) })),
    },
    {
      id: 'scaling',
      label: 'Scaling % balance',
      points: result.years.map((row) => ({ x: row.year, y: Number(row.scalingBalance.toFixed(2)) })),
    },
  ]

  const waterfallSteps = [
    { label: 'Principal', delta: input.startingBalanceUsd },
    { label: 'Setup fee', delta: -input.oneTimeSetupFeeUsd, tone: 'negative' as const },
    {
      label: 'Scaling fees paid',
      delta: -Number(result.totals.scalingTotalFeesPaid.minus(input.oneTimeSetupFeeUsd).toFixed(2)),
      tone: 'negative' as const,
    },
    {
      label: 'Appreciation + compounding',
      delta: Number(
        result.totals.scalingEndBalance
          .minus(input.startingBalanceUsd)
          .plus(result.totals.scalingTotalFeesPaid)
          .toFixed(2),
      ),
      tone: 'positive' as const,
    },
  ]

  return (
    <DelayedProgress delayMs={300} placeholder="Recalculating with your inputs…">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-slate-charcoal/20 bg-white p-6">
          <h3 className="font-serif text-lg">Flat-rate ending</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-ledger-navy">
            {formatUsd(result.totals.flatEndBalance)}
          </p>
        </div>
        <div className="rounded border border-slate-charcoal/20 bg-white p-6">
          <h3 className="font-serif text-lg">Scaling % ending</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-ledger-navy">
            {formatUsd(result.totals.scalingEndBalance)}
          </p>
        </div>
      </div>

      <StackedAreaChart
        title="Balance trajectory (flat vs scaling)"
        description="Projected year-end balance under each fee structure."
        xLabel="Year"
        yLabel="Balance (USD)"
        series={series}
        formatValue={(n) => formatUsd(n)}
      />

      <WaterfallChart
        title="Scaling-scenario cost attribution"
        description="Principal, one-time setup, cumulative fees, and net appreciation."
        steps={waterfallSteps}
        formatValue={(n) => formatUsd(n)}
      />
    </DelayedProgress>
  )
}
```

- [ ] **Step 7.2: Build smoke**

```bash
pnpm build
```

- [ ] **Step 7.3: Commit**

```bash
git add 'src/app/(marketing)/tools/fee-drag-analyzer/FeeDragResult.tsx'
git commit -m "feat(tools): fee drag analyzer uses stacked area + waterfall charts"
```

---

## Task 8: Historical Spot Price API + Provider (TDD)

**Files:**
- Create: `src/market/providers/metalprice-history.ts`, `.test.ts`, `src/app/api/metals/history/route.ts`

- [ ] **Step 8.1: Failing provider test**

Create `/opt/projects/thegoldiraguide/src/market/providers/metalprice-history.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { fetchHistory } from './metalprice-history'

const payload = {
  success: true,
  base: 'USD',
  start_date: '2026-03-20',
  end_date: '2026-03-22',
  rates: {
    '2026-03-20': { USDXAU: 2480 },
    '2026-03-21': { USDXAU: 2495 },
    '2026-03-22': { USDXAU: 2503 },
  },
}

describe('fetchHistory', () => {
  it('returns a sorted series of {x: date, y: price}', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify(payload), { status: 200 }))
    const r = await fetchHistory('gold', '2026-03-20', '2026-03-22', {
      apiKey: 'abc',
      fetcher,
    })
    expect(r.points).toEqual([
      { x: '2026-03-20', y: 2480 },
      { x: '2026-03-21', y: 2495 },
      { x: '2026-03-22', y: 2503 },
    ])
  })
  it('throws on non-200 upstream', async () => {
    const fetcher = vi.fn(async () => new Response('', { status: 500 }))
    await expect(
      fetchHistory('gold', '2026-03-20', '2026-03-22', { apiKey: 'abc', fetcher }),
    ).rejects.toThrow(/500/)
  })
})
```

- [ ] **Step 8.2: Implement**

Create `/opt/projects/thegoldiraguide/src/market/providers/metalprice-history.ts`:

```ts
import type { MetalKey } from '../schema'

type Opts = { apiKey: string; fetcher?: typeof fetch }

const CODE: Record<MetalKey, string> = {
  gold: 'XAU', silver: 'XAG', platinum: 'XPT', palladium: 'XPD',
}

export type HistorySeries = {
  metal: MetalKey
  points: { x: string; y: number }[]
}

export async function fetchHistory(
  metal: MetalKey,
  startDate: string,
  endDate: string,
  { apiKey, fetcher = fetch }: Opts,
): Promise<HistorySeries> {
  const url =
    `https://api.metalpriceapi.com/v1/timeframe?api_key=${encodeURIComponent(apiKey)}` +
    `&start_date=${startDate}&end_date=${endDate}&base=USD&currencies=${CODE[metal]}`
  const res = await fetcher(url)
  if (!res.ok) throw new Error(`metalprice history upstream ${res.status}`)
  const body = (await res.json()) as {
    success?: boolean
    rates?: Record<string, Record<string, number | undefined>>
  }
  if (!body.success || !body.rates) throw new Error('metalprice history failure')

  const points = Object.entries(body.rates)
    .map(([date, values]) => {
      const y = values[`USD${CODE[metal]}`]
      return typeof y === 'number' ? { x: date, y } : null
    })
    .filter((p): p is { x: string; y: number } => p !== null)
    .sort((a, b) => a.x.localeCompare(b.x))

  return { metal, points }
}
```

- [ ] **Step 8.3: API route**

Create `/opt/projects/thegoldiraguide/src/app/api/metals/history/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { fetchHistory } from '@/market/providers/metalprice-history'
import { isMetalKey } from '@/market/schema'

export const runtime = 'nodejs'
export const revalidate = 3600 // history is daily — aggressive cache is fine

export async function GET(req: NextRequest) {
  const metal = req.nextUrl.searchParams.get('metal') ?? ''
  const days = Math.min(90, Math.max(1, Number(req.nextUrl.searchParams.get('days') ?? '30')))

  if (!isMetalKey(metal)) {
    return NextResponse.json({ error: 'unsupported metal' }, { status: 400 })
  }
  const apiKey = process.env.METALPRICE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'api key missing' }, { status: 500 })
  }

  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  try {
    const history = await fetchHistory(metal, fmt(start), fmt(end), { apiKey })
    return NextResponse.json(history, {
      headers: {
        'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'upstream unavailable', detail: String(err) },
      { status: 502 },
    )
  }
}
```

- [ ] **Step 8.4: Run**

```bash
pnpm test src/market/providers/metalprice-history.test.ts
```

- [ ] **Step 8.5: Commit**

```bash
git add src/market/providers/metalprice-history.ts src/market/providers/metalprice-history.test.ts src/app/api/metals/history
git commit -m "feat(market): history provider and /api/metals/history route"
```

---

## Task 9: Historical Chart on `/tools/live-spot-prices`

**Files:**
- Modify: `src/app/(marketing)/tools/live-spot-prices/page.tsx`
- Create: `src/app/(marketing)/tools/live-spot-prices/HistorySection.tsx`

- [ ] **Step 9.1: History section**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/live-spot-prices/HistorySection.tsx`:

```tsx
'use client'

import useSWR from 'swr'
import { TimeSeriesLineChart } from '@/components/charts/TimeSeriesLineChart'
import { METAL_KEYS, type MetalKey } from '@/market/schema'
import { formatUsd } from '@/finance/decimal'

type HistoryResponse = { metal: MetalKey; points: { x: string; y: number }[] }

async function fetcher(url: string): Promise<HistoryResponse> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function useMetalHistory(metal: MetalKey) {
  return useSWR<HistoryResponse>(
    `/api/metals/history?metal=${metal}&days=30`,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 0 },
  )
}

export function HistorySection() {
  const queries = METAL_KEYS.map(useMetalHistory) // eslint-disable-line react-hooks/rules-of-hooks

  const loaded = queries.every((q) => q.data)
  if (!loaded) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-slate-charcoal">
        Loading 30-day history…
      </p>
    )
  }

  const series = METAL_KEYS.map((metal, i) => ({
    id: metal,
    label: metal.charAt(0).toUpperCase() + metal.slice(1),
    points: queries[i].data!.points,
  }))

  return (
    <TimeSeriesLineChart
      title="30-day spot price history"
      description="Closing USD per troy ounce for the four IRA-eligible metals."
      series={series}
      formatValue={(n) => formatUsd(n)}
    />
  )
}
```

Note the eslint-disable comment: the hook loop is safe because `METAL_KEYS` is a stable constant array.

- [ ] **Step 9.2: Mount it**

In `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/live-spot-prices/page.tsx`, add below the existing `<LiveSpotGrid />` section:

```tsx
import { HistorySection } from './HistorySection'

// ...inside the page, below the LiveSpotGrid section:
      <section className="mt-12">
        <HistorySection />
      </section>
```

- [ ] **Step 9.3: Commit**

```bash
git add 'src/app/(marketing)/tools/live-spot-prices'
git commit -m "feat(market): 30-day history chart on live spot prices page"
```

---

## Task 10: E2E + A11y

**Files:**
- Create: `tests/e2e/charts.spec.ts`
- Modify: `tests/e2e/a11y.spec.ts`

- [ ] **Step 10.1: Chart E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/charts.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('fee drag analyzer renders the balance figure + companion table', async ({ page }) => {
  await page.goto('/tools/fee-drag-analyzer')
  const figure = page.getByRole('figure', { name: /balance trajectory/i })
  await expect(figure).toBeVisible()

  await page.getByRole('button', { name: /show the data/i }).first().click()
  await expect(page.getByRole('table', { name: /balance trajectory/i })).toBeVisible()
})

test('fee drag analyzer renders the cost-attribution waterfall', async ({ page }) => {
  await page.goto('/tools/fee-drag-analyzer')
  await expect(page.getByRole('figure', { name: /cost attribution/i })).toBeVisible()
})

test('live spot prices page renders the 30-day history chart', async ({ page }) => {
  await page.goto('/tools/live-spot-prices')
  await expect(page.getByRole('figure', { name: /30-day spot price history/i })).toBeVisible({
    timeout: 20_000,
  })
})
```

- [ ] **Step 10.2: Add chart routes to a11y sweep**

The chart-bearing routes are already in the Plan 5 a11y sweep (`/tools/fee-drag-analyzer`, `/tools/live-spot-prices`), so no additions needed. Rerun to catch new violations:

```bash
pnpm test:e2e tests/e2e/a11y.spec.ts tests/e2e/charts.spec.ts
```

Fix any serious/critical findings (common culprits: missing `alt`/`aria-label` on chart containers, contrast failures in Recharts tick labels). For Recharts, apply `tick={{ fill: '#0B1F3B' }}` on `<XAxis>` and `<YAxis>` in `StackedAreaChart.tsx` and `WaterfallChart.tsx` if contrast fails.

- [ ] **Step 10.3: Commit**

```bash
git add tests/e2e/charts.spec.ts
git commit -m "test(charts): e2e for chart rendering and data tables"
```

---

## Task 11: Bundle Size Budget Guardrail

**Files:**
- Modify: `package.json`, `.github/workflows/ci.yml`

Next.js prints per-route first-load JS after `next build`. Parse the build output and fail if any route's first-load JS exceeds a budget.

- [ ] **Step 11.1: Create bundle-budget script**

Create `/opt/projects/thegoldiraguide/scripts/check-bundle-budget.ts`:

```ts
import { execSync } from 'node:child_process'

const BUDGET_KB_BY_PATH: Record<string, number> = {
  '/': 180,
  '/ira-rules': 180,
  '/accountability': 180,
  '/economics': 180,
  '/about': 180,
  '/tools': 200,
  '/tools/fee-drag-analyzer': 260,
  '/tools/roi-calculator': 240,
  '/tools/written-estimate-checklist': 240,
  '/tools/live-spot-prices': 300,
}

const output = execSync('pnpm build', { encoding: 'utf8' })
const lines = output.split('\n')
const violations: string[] = []

for (const line of lines) {
  // Next.js prints: ┌ ○ /  …  XXX kB  YYY kB  (first-load JS)
  const match = line.match(/^\s*[┌├└].\s+(?:○|●|λ|ƒ)?\s+(\/\S*)\s+.*?(\d+(?:\.\d+)?)\s*kB\s+(\d+(?:\.\d+)?)\s*kB\s*$/)
  if (!match) continue
  const path = match[1]
  const firstLoad = Number(match[3])
  const budget = BUDGET_KB_BY_PATH[path]
  if (budget && firstLoad > budget) {
    violations.push(`${path}: ${firstLoad}kB > budget ${budget}kB`)
  }
}

if (violations.length > 0) {
  console.error('[bundle-budget] FAIL')
  for (const v of violations) console.error('  ' + v)
  process.exit(1)
}
console.log('[bundle-budget] OK')
```

- [ ] **Step 11.2: Add to scripts**

In `package.json`:

```jsonc
    "check:bundle": "tsx scripts/check-bundle-budget.ts",
```

- [ ] **Step 11.3: Add to CI**

In `.github/workflows/ci.yml`, add after the `Build` step in `Verify`:

```yaml
      - name: Bundle size budget
        run: pnpm check:bundle
```

Note: since `check:bundle` shells out to `pnpm build` itself, remove the separate `Build` step or have `check:bundle` re-parse the existing `.next/build-manifest.json` instead. Simpler interim approach: replace the existing `Build` step with `check:bundle` directly.

Alternative implementation (parse `.next/build-manifest.json` post-build):

```ts
// Alternative body for scripts/check-bundle-budget.ts (post-build variant):
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('.next/build-manifest.json', 'utf8'))
// This file doesn't expose gzipped sizes directly — for a CI-reliable number
// prefer parsing the stdout of `next build` as above.
```

Keep the stdout-parsing approach; it's the only reliable source for first-load JS numbers.

- [ ] **Step 11.4: Commit**

```bash
git add scripts/check-bundle-budget.ts package.json .github/workflows/ci.yml
git commit -m "ci(charts): bundle-size budget guardrail per route"
```

---

## Task 12: Final Verification

- [ ] **Step 12.1: Local all-gates**

```bash
pnpm check:all && pnpm test:e2e
```

- [ ] **Step 12.2: Push + tag**

```bash
git push
git tag -a v0.7.0-visualization -m "Plan 7: data visualization complete"
git push origin v0.7.0-visualization
```

---

## Done Means

1. Every chart is a `<figure>` with `aria-labelledby` + `aria-describedby` and is accompanied by a `<ChartDataTable>` containing identical data.
2. No chart relies on color alone — series use patterns, line dashes, or symbols.
3. ECharts is lazy-loaded; the base bundle stays within the per-route budget defined in `scripts/check-bundle-budget.ts`.
4. `/tools/fee-drag-analyzer` renders a balance-trajectory stacked-area chart and a cost-attribution waterfall, both with live recalculation.
5. `/tools/live-spot-prices` renders a 30-day history chart for all four metals.
6. `/api/metals/history` proxies `metalpriceapi` timeframe data with 1h caching and graceful 502.
7. axe reports zero serious/critical violations on every chart-bearing route.
8. Plan 8 can finalize brand typography/colors by swapping the palette import without touching chart components.
