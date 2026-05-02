# Plan 12: Homepage Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plan 11 (`plan-11-ownership-tone`, PR #11) merged. This plan edits `src/app/(marketing)/page.tsx` and `page.test.tsx`, which were also touched in Plan 11. Start only after #11 is merged to `main`.

**Goal:** Rebuild the homepage as an editorial reference publication — asymmetric hero with a live "what's moving" market-pulse panel, a signal strip with real content counts, and a bento pillar grid with one featured pillar rendered richer than the rest — so the site reads as substantive and intentional rather than a template.

**Architecture:** Six new presentational components under `src/components/home/` compose into a rewritten `HomePage`. `MarketPulseCard` is the only client component (it reuses the existing `useSpotPrice` hook); everything else is server-rendered. A single inline `<HeroBackdrop />` SVG supplies the editorial texture without any new image assets. Typography leans on existing unused tokens (`text-display-xl`, `font-mono` for numbers, uppercase-tracked eyebrows). No new runtime dependencies.

**Tech stack additions:** None. Reuses `next/link`, existing Tailwind tokens from `src/design/tokens.ts`, `useSpotPrice` from `src/market/use-spot-price.ts`, and `ALL_SEEDS` + `seedsByPillar()` from `src/content/strategic/index.ts`.

**Out of scope (explicit non-goals):**
- Changes to pillar index pages (`/ira-rules`, `/accountability`, `/economics`, `/tools`, `/about`) — a follow-up plan.
- Changes to the article template layout (`src/components/editorial/*`).
- Photography or hero imagery beyond inline SVG texture — keeps the performance budget intact and avoids royalty-image licensing.
- Dark mode — the plan ships a single light editorial palette. Dark mode is a separate plan if ever requested.
- Redesign of `Header.tsx` or `Footer.tsx` — this is strictly a `page.tsx` redesign. The sticky header + footer chrome stays.
- New data fetching. The live spot-price panel reuses the existing `useSpotPrice` client hook and its `/api/spot-price/[metal]` endpoint.
- Carousel, animation library, or scroll-triggered motion. A single CSS transition on hover is the limit.

---

## File Structure

**New components (all presentational):**
```
src/components/home/
  HeroBackdrop.tsx          — inline SVG: radial gradient + guilloche linework behind the hero
  HeroBackdrop.test.tsx
  HomeHero.tsx              — 2-column asymmetric hero section (h1 + subtitle + CTA + lockup on left, <MarketPulseCard /> on right)
  HomeHero.test.tsx
  MarketPulseCard.tsx       — client component: three-metal current price + 24h change panel
  MarketPulseCard.test.tsx
  SignalStrip.tsx           — "29 articles · 7 calculators · Updated {date}" horizontal band
  SignalStrip.test.tsx
  FeaturedPillarCard.tsx    — large 2-col-span card for the featured pillar
  FeaturedPillarCard.test.tsx
  PillarCard.tsx            — standard 1-col bento card used for non-featured pillars
  PillarCard.test.tsx
  PillarBento.tsx           — grid that places one FeaturedPillarCard + four PillarCards in a bento layout
  PillarBento.test.tsx
  home-config.ts            — static config: which pillar is featured, CTA chip slugs
  home-config.test.ts
```

**Rewritten routes + tests:**
```
src/app/(marketing)/page.tsx           — composes the 4 home sections; no inline layout logic
src/app/(marketing)/page.test.tsx      — extended to cover the new sections; preserves existing assertions
tests/e2e/home.spec.ts                 — extended: asserts new landmarks and the MarketPulseCard loading state
```

No changes to `src/app/layout.tsx`, `src/components/nav/*`, `src/components/compliance/*`, `src/components/brand/*`, or the `site-map.ts` module. All shared primitives introduced in Plan 11 (`OwnershipLockup`) are reused, not redefined.

---

## Task 1: HeroBackdrop — inline SVG texture

**Files:**
- Create: `src/components/home/HeroBackdrop.tsx`
- Create: `src/components/home/HeroBackdrop.test.tsx`

**Context:** The current hero sits on a flat `bg-bg-canvas` (platinum white). An editorial reference publication hero benefits from subtle depth — a radial highlight plus a fine guilloche line pattern (the engraved-ripple motif on bond certificates). No raster assets; everything inline. The component renders absolutely positioned inside the hero section, marked `aria-hidden="true"` so it never appears to assistive tech.

- [ ] **Step 1: Create the failing test**

Create `src/components/home/HeroBackdrop.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroBackdrop } from './HeroBackdrop'

describe('HeroBackdrop', () => {
  it('renders an inline SVG marked aria-hidden', () => {
    const { container } = render(<HeroBackdrop />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it('uses preserveAspectRatio slice so the pattern fills the container', () => {
    const { container } = render(<HeroBackdrop />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice')
  })

  it('contains a radial highlight and at least one guilloche line path', () => {
    const { container } = render(<HeroBackdrop />)
    expect(container.querySelector('radialGradient')).not.toBeNull()
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run the test — expect fail (module not found)**

Run: `pnpm vitest run src/components/home/HeroBackdrop.test.tsx`
Expected: FAIL — `Failed to resolve import "./HeroBackdrop"`

- [ ] **Step 3: Implement the component**

Create `src/components/home/HeroBackdrop.tsx`:

```tsx
import { BRAND_COLORS } from '@/design/tokens'

export function HeroBackdrop() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="hero-highlight" cx="25%" cy="35%" r="60%">
          <stop offset="0%" stopColor={BRAND_COLORS.brandGold} stopOpacity="0.08" />
          <stop offset="60%" stopColor={BRAND_COLORS.brandPlatinum} stopOpacity="0" />
        </radialGradient>
        <pattern
          id="hero-guilloche"
          x="0"
          y="0"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 70 Q 35 30 70 70 T 140 70"
            fill="none"
            stroke={BRAND_COLORS.brandNavy}
            strokeOpacity="0.04"
            strokeWidth="1"
          />
          <path
            d="M0 100 Q 35 60 70 100 T 140 100"
            fill="none"
            stroke={BRAND_COLORS.brandNavy}
            strokeOpacity="0.03"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="1200" height="600" fill="url(#hero-guilloche)" />
      <rect width="1200" height="600" fill="url(#hero-highlight)" />
    </svg>
  )
}
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/HeroBackdrop.test.tsx`
Expected: PASS (3/3).

- [ ] **Step 5: Verify no-hex guard**

Run: `pnpm check:no-hex`
Expected: `[no-hex] OK` — we used `BRAND_COLORS.*` tokens throughout.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HeroBackdrop.tsx src/components/home/HeroBackdrop.test.tsx
git commit -m "feat(home): add HeroBackdrop with radial highlight and guilloche lines"
```

---

## Task 2: MarketPulseCard — live "what's moving" panel

**Files:**
- Create: `src/components/home/MarketPulseCard.tsx`
- Create: `src/components/home/MarketPulseCard.test.tsx`

**Context:** A compact client component that shows three metals (gold, silver, platinum) with their current USD spot and 24h change. Reuses `useSpotPrice` — the same hook already powering `LiveSpotPriceTicker`. Styled as a data card: white surface, shadow, mono numbers, uppercase eyebrow. Provides a single CTA link to `/tools/live-spot-prices` for the full dashboard.

**Data-contract note:** `useSpotPrice(metal)` returns `{ data, error, isLoading, stale }` where `data` has `pricePerOunceUsd: string` and `change24hPercent: number`. See `src/components/market/LiveSpotPriceTicker.tsx` for the canonical usage pattern.

- [ ] **Step 1: Create the failing test**

Create `src/components/home/MarketPulseCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MarketPulseCard } from './MarketPulseCard'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: {
      metal,
      pricePerOunceUsd: '2402.15',
      change24hPercent: 0.6,
    },
    error: null,
    isLoading: false,
    stale: false,
  }),
}))

describe('MarketPulseCard', () => {
  it('renders the uppercase eyebrow and card heading', () => {
    render(<MarketPulseCard />)
    expect(screen.getByText(/market pulse/i)).toBeInTheDocument()
  })

  it('renders gold, silver, and platinum rows', () => {
    render(<MarketPulseCard />)
    expect(screen.getByText(/gold/i)).toBeInTheDocument()
    expect(screen.getByText(/silver/i)).toBeInTheDocument()
    expect(screen.getByText(/platinum/i)).toBeInTheDocument()
  })

  it('renders prices in a monospace class', () => {
    const { container } = render(<MarketPulseCard />)
    const monoNodes = container.querySelectorAll('[class*="font-mono"]')
    expect(monoNodes.length).toBeGreaterThanOrEqual(3)
  })

  it('links to the full live-spot-prices dashboard', () => {
    render(<MarketPulseCard />)
    const link = screen.getByRole('link', { name: /see full dashboard/i })
    expect(link).toHaveAttribute('href', '/tools/live-spot-prices')
  })
})
```

- [ ] **Step 2: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/MarketPulseCard.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component**

Create `src/components/home/MarketPulseCard.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import type { MetalKey } from '@/market/schema'

function MetalRow({ metal }: { metal: MetalKey }) {
  const { data, error, isLoading } = useSpotPrice(metal)
  const label = metal.charAt(0).toUpperCase() + metal.slice(1)

  if (isLoading) {
    return (
      <div className="flex items-baseline justify-between border-b border-brand-slate/10 py-2 last:border-b-0">
        <span className="text-sm text-brand-slate">{label}</span>
        <span className="font-mono text-sm text-brand-slate">—</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-baseline justify-between border-b border-brand-slate/10 py-2 last:border-b-0">
        <span className="text-sm text-brand-slate">{label}</span>
        <span className="font-mono text-sm text-feedback-danger">
          unavailable
        </span>
      </div>
    )
  }

  const change = data.change24hPercent
  const changeTone =
    change > 0
      ? 'text-feedback-success'
      : change < 0
        ? 'text-feedback-danger'
        : 'text-brand-slate'
  const changeSign = change > 0 ? '+' : change < 0 ? '−' : ''

  return (
    <div className="flex items-baseline justify-between border-b border-brand-slate/10 py-2 last:border-b-0">
      <span className="text-sm font-medium text-brand-navy">{label}</span>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-brand-navy">
          {formatUsd(data.pricePerOunceUsd)}
        </span>
        <span className={`font-mono text-xs ${changeTone}`}>
          {changeSign}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export function MarketPulseCard() {
  const metals: MetalKey[] = ['gold', 'silver', 'platinum']
  return (
    <aside
      aria-label="Market pulse"
      className="rounded-lg border border-brand-slate/20 bg-bg-surface p-6 shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
        Market pulse
      </p>
      <p className="mt-1 font-serif text-lg text-brand-navy">
        Spot prices, right now
      </p>
      <div className="mt-4">
        {metals.map((m) => (
          <MetalRow key={m} metal={m} />
        ))}
      </div>
      <Link
        href="/tools/live-spot-prices"
        className="mt-5 inline-block text-sm font-medium text-brand-navy underline underline-offset-2 hover:text-brand-gold"
      >
        See full dashboard →
      </Link>
    </aside>
  )
}
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/MarketPulseCard.test.tsx`
Expected: PASS (4/4).

- [ ] **Step 5: Run the no-hex guard**

Run: `pnpm check:no-hex`
Expected: OK — only Tailwind token classes used.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/MarketPulseCard.tsx src/components/home/MarketPulseCard.test.tsx
git commit -m "feat(home): add MarketPulseCard with live 3-metal spot prices"
```

---

## Task 3: SignalStrip — content credibility band

**Files:**
- Create: `src/components/home/SignalStrip.tsx`
- Create: `src/components/home/SignalStrip.test.tsx`

**Context:** A thin horizontal strip below the hero with three factual signals — article count, calculator count, and a "last updated" timestamp. Builds credibility without marketing copy. Counts come from real content registries (`ALL_SEEDS` = 29 strategic article seeds; tools count from `public-tools.ts`).

- [ ] **Step 1: Create the failing test**

Create `src/components/home/SignalStrip.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SignalStrip } from './SignalStrip'

describe('SignalStrip', () => {
  it('renders the strategic article count', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/29 articles/i)).toBeInTheDocument()
  })

  it('renders the interactive tool count', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/7 calculators/i)).toBeInTheDocument()
  })

  it('renders the last-updated date in long form', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/April 20, 2026/)).toBeInTheDocument()
  })

  it('uses a monospace class on each numeric count', () => {
    const { container } = render(
      <SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />,
    )
    const monoCounts = container.querySelectorAll('[data-signal-count]')
    expect(monoCounts.length).toBe(2)
    monoCounts.forEach((n) => expect(n.className).toMatch(/font-mono/))
  })
})
```

- [ ] **Step 2: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/SignalStrip.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the component**

Create `src/components/home/SignalStrip.tsx`:

```tsx
import { formatLongDate } from '@/lib/date'

interface SignalStripProps {
  articleCount: number
  toolCount: number
  lastUpdatedIso: string
}

export function SignalStrip({
  articleCount,
  toolCount,
  lastUpdatedIso,
}: SignalStripProps) {
  return (
    <section
      aria-label="Site signals"
      className="border-y border-brand-slate/20 bg-bg-surface"
    >
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-baseline justify-center gap-x-10 gap-y-3 px-6 py-4 text-sm text-brand-slate">
        <span className="inline-flex items-baseline gap-2">
          <span
            data-signal-count
            className="font-mono text-base text-brand-navy"
          >
            {articleCount}
          </span>
          articles
        </span>
        <span className="inline-flex items-baseline gap-2">
          <span
            data-signal-count
            className="font-mono text-base text-brand-navy"
          >
            {toolCount}
          </span>
          calculators
        </span>
        <span className="inline-flex items-baseline gap-2">
          Updated{' '}
          <time
            dateTime={lastUpdatedIso}
            className="font-mono text-sm text-brand-navy"
          >
            {formatLongDate(lastUpdatedIso)}
          </time>
        </span>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/SignalStrip.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/SignalStrip.tsx src/components/home/SignalStrip.test.tsx
git commit -m "feat(home): add SignalStrip for content counts and last-updated date"
```

---

## Task 4: PillarCard — standard bento card

**Files:**
- Create: `src/components/home/PillarCard.tsx`
- Create: `src/components/home/PillarCard.test.tsx`

**Context:** A single non-featured pillar card. Used four times in the bento grid. Eyebrow (pillar shortLabel in uppercase), serif title (pillar.label), sans summary (pillar.summary), subtle hover depth. Entire card is a link so the hit target is generous.

- [ ] **Step 1: Create the failing test**

Create `src/components/home/PillarCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pillarBySlug } from '@/lib/site-map'
import { PillarCard } from './PillarCard'

describe('PillarCard', () => {
  const pillar = pillarBySlug('ira-rules')!

  it('renders the pillar label as a heading', () => {
    render(<PillarCard pillar={pillar} />)
    expect(
      screen.getByRole('heading', { level: 3, name: pillar.label }),
    ).toBeInTheDocument()
  })

  it('renders the pillar summary', () => {
    render(<PillarCard pillar={pillar} />)
    expect(screen.getByText(pillar.summary)).toBeInTheDocument()
  })

  it('renders the uppercase eyebrow using the shortLabel', () => {
    render(<PillarCard pillar={pillar} />)
    const eyebrow = screen.getByTestId('pillar-eyebrow')
    expect(eyebrow.textContent).toMatch(new RegExp(pillar.shortLabel, 'i'))
    expect(eyebrow.className).toMatch(/uppercase/)
  })

  it('wraps the whole card in a link to the pillar route', () => {
    render(<PillarCard pillar={pillar} />)
    const link = screen.getByRole('link', { name: new RegExp(pillar.label, 'i') })
    expect(link).toHaveAttribute('href', '/ira-rules')
  })
})
```

- [ ] **Step 2: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/PillarCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the component**

Create `src/components/home/PillarCard.tsx`:

```tsx
import Link from 'next/link'
import { pillarHref, type Pillar } from '@/lib/site-map'

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <Link
      href={pillarHref(pillar.slug)}
      className="group block h-full rounded-lg border border-brand-slate/20 bg-bg-surface p-6 shadow-sm transition-shadow hover:border-brand-gold hover:shadow-md"
    >
      <p
        data-testid="pillar-eyebrow"
        className="text-xs font-semibold uppercase tracking-wider text-brand-gold"
      >
        {pillar.shortLabel}
      </p>
      <h3 className="mt-3 font-serif text-xl font-semibold text-brand-navy">
        {pillar.label}
      </h3>
      <p className="mt-2 text-sm text-brand-slate">{pillar.summary}</p>
    </Link>
  )
}
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/PillarCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/PillarCard.tsx src/components/home/PillarCard.test.tsx
git commit -m "feat(home): add PillarCard with eyebrow, serif title, and hover depth"
```

---

## Task 5: FeaturedPillarCard — larger 2-col bento tile

**Files:**
- Create: `src/components/home/FeaturedPillarCard.tsx`
- Create: `src/components/home/FeaturedPillarCard.test.tsx`

**Context:** One pillar is rendered larger with a richer treatment — "Featured" eyebrow, display-size serif headline, longer dek line, and a visible "Start here →" affordance. This breaks grid uniformity (the `design-quality.md` anti-template policy) and gives readers a clear starting path.

- [ ] **Step 1: Create the failing test**

Create `src/components/home/FeaturedPillarCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pillarBySlug } from '@/lib/site-map'
import { FeaturedPillarCard } from './FeaturedPillarCard'

describe('FeaturedPillarCard', () => {
  const pillar = pillarBySlug('ira-rules')!

  it('renders a "Featured" eyebrow (not the pillar shortLabel)', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    const eyebrow = screen.getByTestId('featured-eyebrow')
    expect(eyebrow.textContent).toMatch(/featured/i)
    expect(eyebrow.className).toMatch(/uppercase/)
  })

  it('renders the pillar label as an h2 (not h3, so it outranks standard cards)', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    expect(
      screen.getByRole('heading', { level: 2, name: pillar.label }),
    ).toBeInTheDocument()
  })

  it('renders the pillar summary as the dek', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    expect(screen.getByText(pillar.summary)).toBeInTheDocument()
  })

  it('renders a "Start here" call to action linked to the pillar route', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    const cta = screen.getByRole('link', { name: /start here/i })
    expect(cta).toHaveAttribute('href', '/ira-rules')
  })
})
```

- [ ] **Step 2: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/FeaturedPillarCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the component**

Create `src/components/home/FeaturedPillarCard.tsx`:

```tsx
import Link from 'next/link'
import { pillarHref, type Pillar } from '@/lib/site-map'

export function FeaturedPillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-brand-slate/20 bg-brand-navy p-8 text-brand-platinum shadow-md">
      <div>
        <p
          data-testid="featured-eyebrow"
          className="text-xs font-semibold uppercase tracking-wider text-brand-gold"
        >
          Featured · Start here
        </p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-brand-platinum">
          {pillar.label}
        </h2>
        <p className="mt-4 max-w-xl text-base text-brand-platinum/80">
          {pillar.summary}
        </p>
      </div>
      <Link
        href={pillarHref(pillar.slug)}
        className="mt-6 inline-flex items-baseline gap-2 text-sm font-semibold text-brand-gold underline underline-offset-4 hover:text-brand-platinum"
      >
        Start here<span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/FeaturedPillarCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/FeaturedPillarCard.tsx src/components/home/FeaturedPillarCard.test.tsx
git commit -m "feat(home): add FeaturedPillarCard with navy surface and start-here CTA"
```

---

## Task 6: PillarBento — bento grid layout + home-config

**Files:**
- Create: `src/components/home/home-config.ts`
- Create: `src/components/home/home-config.test.ts`
- Create: `src/components/home/PillarBento.tsx`
- Create: `src/components/home/PillarBento.test.tsx`

**Context:** `home-config.ts` is the one-line decision about which pillar is featured — exported as a const so tests pin it and product can change it without touching the grid layout. `PillarBento` reads `PILLARS`, splits out the featured slug, and renders a grid where the featured card spans 2 columns on `md+` and the remaining four cards fill the other two rows.

Desktop layout (md+):
```
 +-----------------+-------+
 |                 |  P1   |
 |   FEATURED      +-------+
 |   (2 cols,      |  P2   |
 |    2 rows)      +-------+
 |                 |  P3   |
 |                 +-------+
 |                 |  P4   |
 +-----------------+-------+
```

Mobile: featured card at top full-width, then each other pillar full-width stacked.

- [ ] **Step 1: Create home-config test**

Create `src/components/home/home-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { PILLARS } from '@/lib/site-map'
import { FEATURED_PILLAR_SLUG } from './home-config'

describe('home-config', () => {
  it('FEATURED_PILLAR_SLUG resolves to a real pillar', () => {
    expect(PILLARS.map((p) => p.slug)).toContain(FEATURED_PILLAR_SLUG)
  })

  it('featured pillar is "ira-rules" — the canonical entry point for new readers', () => {
    expect(FEATURED_PILLAR_SLUG).toBe('ira-rules')
  })
})
```

- [ ] **Step 2: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/home-config.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement home-config**

Create `src/components/home/home-config.ts`:

```ts
import type { PillarSlug } from '@/lib/site-map'

// The pillar rendered in the larger FeaturedPillarCard on the homepage
// bento grid. Change this one constant to feature a different pillar.
export const FEATURED_PILLAR_SLUG: PillarSlug = 'ira-rules'
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/home-config.test.ts`
Expected: PASS.

- [ ] **Step 5: Create the PillarBento test**

Create `src/components/home/PillarBento.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PILLARS } from '@/lib/site-map'
import { PillarBento } from './PillarBento'

describe('PillarBento', () => {
  it('renders a region with an accessible name', () => {
    render(<PillarBento />)
    expect(
      screen.getByRole('region', { name: /pillars/i }),
    ).toBeInTheDocument()
  })

  it('renders exactly one FeaturedPillarCard', () => {
    render(<PillarBento />)
    expect(screen.getAllByTestId('featured-eyebrow')).toHaveLength(1)
  })

  it('renders a PillarCard for every non-featured pillar', () => {
    render(<PillarBento />)
    const region = screen.getByRole('region', { name: /pillars/i })
    const nonFeatured = PILLARS.filter((p) => p.slug !== 'ira-rules')
    for (const p of nonFeatured) {
      expect(
        within(region).getByRole('heading', { level: 3, name: p.label }),
      ).toBeInTheDocument()
    }
  })

  it('places featured pillar first in DOM order', () => {
    render(<PillarBento />)
    const region = screen.getByRole('region', { name: /pillars/i })
    const headings = within(region).getAllByRole('heading')
    expect(headings[0].tagName).toBe('H2')
  })
})
```

- [ ] **Step 6: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/PillarBento.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement PillarBento**

Create `src/components/home/PillarBento.tsx`:

```tsx
import { PILLARS, pillarBySlug } from '@/lib/site-map'
import { FeaturedPillarCard } from './FeaturedPillarCard'
import { PillarCard } from './PillarCard'
import { FEATURED_PILLAR_SLUG } from './home-config'

export function PillarBento() {
  const featured = pillarBySlug(FEATURED_PILLAR_SLUG)
  if (!featured) return null
  const others = PILLARS.filter((p) => p.slug !== FEATURED_PILLAR_SLUG)

  return (
    <section
      aria-label="Pillars"
      className="mx-auto max-w-screen-xl px-6 py-16"
    >
      <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
        <div className="md:col-span-2 md:row-span-2">
          <FeaturedPillarCard pillar={featured} />
        </div>
        {others.map((p) => (
          <PillarCard key={p.slug} pillar={p} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/PillarBento.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/home/home-config.ts src/components/home/home-config.test.ts src/components/home/PillarBento.tsx src/components/home/PillarBento.test.tsx
git commit -m "feat(home): add PillarBento bento grid with FEATURED_PILLAR_SLUG config"
```

---

## Task 7: HomeHero — asymmetric 2-column hero section

**Files:**
- Create: `src/components/home/HomeHero.tsx`
- Create: `src/components/home/HomeHero.test.tsx`

**Context:** The hero is a 2-column grid at `lg+`, 1-column stacked on mobile. Left column: `<HeroBackdrop />` sits behind the text, followed by a gold eyebrow label ("Independent reference"), the `text-display-xl` serif h1, the reader-focused subtitle (text from Plan 11), a CTA button row linking to the featured pillar + the live spot-prices tool, and the `<OwnershipLockup tone="light" />` from Plan 11. Right column: `<MarketPulseCard />`. The section has `relative` + `overflow-hidden` so the backdrop clips cleanly.

- [ ] **Step 1: Create the failing test**

Create `src/components/home/HomeHero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HomeHero } from './HomeHero'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: { metal, pricePerOunceUsd: '2402.15', change24hPercent: 0.6 },
    error: null,
    isLoading: false,
    stale: false,
  }),
}))

describe('HomeHero', () => {
  it('renders the site h1', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gold ira guide/i }),
    ).toBeInTheDocument()
  })

  it('renders the uppercase "Independent reference" eyebrow', () => {
    render(<HomeHero />)
    const eyebrow = screen.getByTestId('hero-eyebrow')
    expect(eyebrow.textContent).toMatch(/independent reference/i)
    expect(eyebrow.className).toMatch(/uppercase/)
  })

  it('renders the reader-focused subtitle from Plan 11', () => {
    render(<HomeHero />)
    const subtitle = screen.getByTestId('home-subtitle')
    expect(subtitle.textContent).toMatch(
      /independent reference on self-directed precious metals IRAs/i,
    )
  })

  it('renders two hero CTAs: start-reading (featured pillar) and live-spot-prices', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('link', { name: /start with ira rules/i }),
    ).toHaveAttribute('href', '/ira-rules')
    expect(
      screen.getByRole('link', { name: /see live spot prices/i }),
    ).toHaveAttribute('href', '/tools/live-spot-prices')
  })

  it('renders the OwnershipLockup (light tone)', () => {
    render(<HomeHero />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
  })

  it('renders the HeroBackdrop SVG (marked aria-hidden)', () => {
    const { container } = render(<HomeHero />)
    const svg = container.querySelector('svg[aria-hidden="true"]')
    expect(svg).not.toBeNull()
  })

  it('renders the MarketPulseCard', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('complementary', { name: /market pulse/i }),
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test — expect fail**

Run: `pnpm vitest run src/components/home/HomeHero.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement HomeHero**

Create `src/components/home/HomeHero.tsx`:

```tsx
import Link from 'next/link'
import { OwnershipLockup } from '@/components/brand/OwnershipLockup'
import { pillarBySlug, pillarHref } from '@/lib/site-map'
import { HeroBackdrop } from './HeroBackdrop'
import { MarketPulseCard } from './MarketPulseCard'
import { FEATURED_PILLAR_SLUG } from './home-config'

export function HomeHero() {
  const featured = pillarBySlug(FEATURED_PILLAR_SLUG)
  const featuredLabel = featured?.shortLabel ?? 'IRA Rules'
  const featuredHref = featured ? pillarHref(featured.slug) : '/ira-rules'

  return (
    <section className="relative overflow-hidden border-b border-brand-slate/20 bg-bg-canvas">
      <HeroBackdrop />
      <div className="relative mx-auto grid max-w-screen-xl gap-10 px-6 py-20 lg:grid-cols-[3fr_2fr] lg:items-center lg:py-24">
        <div>
          <p
            data-testid="hero-eyebrow"
            className="text-xs font-semibold uppercase tracking-wider text-brand-gold"
          >
            Independent reference · Updated weekly
          </p>
          <h1 className="mt-4 font-serif text-display-xl text-brand-navy">
            The Gold IRA Guide
          </h1>
          <p
            data-testid="home-subtitle"
            className="mt-6 max-w-xl text-body-lg text-brand-slate"
          >
            An independent reference on self-directed precious metals IRAs —
            the rules, the costs, and the numbers that move them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={featuredHref}
              className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-5 py-3 text-sm font-semibold text-brand-platinum hover:bg-brand-navy/90"
            >
              Start with {featuredLabel}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/tools/live-spot-prices"
              className="inline-flex items-center gap-2 rounded-md border border-brand-slate/30 bg-bg-surface px-5 py-3 text-sm font-semibold text-brand-navy hover:border-brand-gold"
            >
              See live spot prices
            </Link>
          </div>
          <div className="mt-10">
            <OwnershipLockup tone="light" />
          </div>
        </div>
        <div className="lg:justify-self-end lg:self-center">
          <MarketPulseCard />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test — expect pass**

Run: `pnpm vitest run src/components/home/HomeHero.test.tsx`
Expected: PASS (7/7).

- [ ] **Step 5: Run no-hex guard**

Run: `pnpm check:no-hex`
Expected: OK.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HomeHero.tsx src/components/home/HomeHero.test.tsx
git commit -m "feat(home): add HomeHero with asymmetric 2-col layout and MarketPulseCard"
```

---

## Task 8: Compose HomePage + update route tests and E2E

**Files:**
- Modify: `src/app/(marketing)/page.tsx`
- Modify: `src/app/(marketing)/page.test.tsx`
- Modify: `tests/e2e/home.spec.ts`

**Context:** `page.tsx` becomes thin — it imports the four composed sections and arranges them top-to-bottom: HomeHero → SignalStrip → PillarBento. Signal counts are computed from real content registries (`ALL_SEEDS.length` for articles, a static 7 for tools since `public-tools.ts` doesn't export a clean length — we can add one in a later plan but this plan uses a hardcoded constant plus a failing test if the count drifts). The h1 assertion stays, the pillar link assertions are removed in favor of section-level landmark assertions (the bento still renders every pillar, but the h1/h2/h3 heading levels changed).

**Static tool count rationale:** `src/content/tools/public-tools.ts` exports a list but not its length; computing `.length` at import time works but re-importing a large strategic module into the home page just to count is wasteful. Instead, pass a hardcoded `TOOL_COUNT = 7` and add a Vitest test that imports `public-tools.ts` and asserts the list length equals the constant — so the constant can't silently drift.

- [ ] **Step 1: Inspect public-tools.ts to confirm the exported symbol name**

Run: `grep -E "^export (const|type)" src/content/tools/public-tools.ts | head -5`

Expected: you see an exported `const` array (e.g., `PUBLIC_TOOLS` or similar). Use that name in Step 3.

- [ ] **Step 2: Update `src/app/(marketing)/page.test.tsx`**

Replace the file contents with:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './page'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: { metal, pricePerOunceUsd: '2402.15', change24hPercent: 0.6 },
    error: null,
    isLoading: false,
    stale: false,
  }),
}))

describe('HomePage', () => {
  it('renders the site title as the h1', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gold ira guide/i }),
    ).toBeInTheDocument()
  })

  it('renders a reader-focused subtitle (no dealer-voice phrasing)', () => {
    render(<HomePage />)
    const subtitle = screen.getByTestId('home-subtitle')
    expect(subtitle.textContent).toMatch(
      /independent reference on self-directed precious metals IRAs/i,
    )
    expect(subtitle.textContent ?? '').not.toMatch(/owned and operated by/i)
    expect(subtitle.textContent ?? '').not.toMatch(/binding written estimate/i)
  })

  it('renders the OwnershipLockup in the hero', () => {
    render(<HomePage />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
  })

  it('renders the SignalStrip with article and tool counts', () => {
    render(<HomePage />)
    expect(screen.getByLabelText(/site signals/i)).toBeInTheDocument()
    expect(screen.getByText(/articles/i)).toBeInTheDocument()
    expect(screen.getByText(/calculators/i)).toBeInTheDocument()
  })

  it('renders the MarketPulseCard', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('complementary', { name: /market pulse/i }),
    ).toBeInTheDocument()
  })

  it('renders the pillars region with a featured pillar card', () => {
    render(<HomePage />)
    expect(screen.getByRole('region', { name: /pillars/i })).toBeInTheDocument()
    expect(screen.getByTestId('featured-eyebrow')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Rewrite `src/app/(marketing)/page.tsx`**

Replace the file with (substitute `PUBLIC_TOOLS` with whatever symbol Step 1 surfaced — if Step 1 showed the list is named `PUBLIC_TOOLS`, leave this; otherwise swap the import):

```tsx
import { HomeHero } from '@/components/home/HomeHero'
import { PillarBento } from '@/components/home/PillarBento'
import { SignalStrip } from '@/components/home/SignalStrip'
import { PUBLIC_TOOLS } from '@/content/tools/public-tools'
import { ALL_SEEDS } from '@/content/strategic'

// Last-updated date is computed at build time from the newest `updatedAt`
// field across all strategic article seeds. This re-renders whenever content
// is regenerated, which is how Sanity-sourced article revisions propagate.
function computeLastUpdatedIso(): string {
  const dates = ALL_SEEDS.map((s) => s.updatedAt ?? s.publishedAt).filter(
    (d): d is string => typeof d === 'string',
  )
  if (dates.length === 0) return new Date().toISOString()
  return dates.sort().at(-1) ?? new Date().toISOString()
}

export default function HomePage() {
  const articleCount = ALL_SEEDS.length
  const toolCount = PUBLIC_TOOLS.length
  const lastUpdatedIso = computeLastUpdatedIso()

  return (
    <>
      <HomeHero />
      <SignalStrip
        articleCount={articleCount}
        toolCount={toolCount}
        lastUpdatedIso={lastUpdatedIso}
      />
      <PillarBento />
    </>
  )
}
```

If Step 1 revealed the export is a different name (e.g., `PUBLIC_TOOLS_LIST`, `TOOLS`, etc.), rename the import in both the import line and the `.length` usage. Do NOT add a new export to `public-tools.ts` — use whatever is already exported.

If neither `ALL_SEEDS` nor `PUBLIC_TOOLS` can be imported cleanly (for example, they live behind deeper barrel paths), STOP and report BLOCKED with the actual exported symbol names. Don't invent an export path.

- [ ] **Step 4: Run the route tests**

Run: `pnpm vitest run 'src/app/(marketing)/page.test.tsx'`

Expected: 6/6 PASS.

- [ ] **Step 5: Update E2E selectors in `tests/e2e/home.spec.ts`**

Replace the file with:

```ts
import { expect, test } from '@playwright/test'

test('home page renders the canonical H1 and all key regions', async ({
  page,
}) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  await expect(page.locator('h1')).toHaveText('The Gold IRA Guide')

  // Market pulse card (client component) should mount; we assert the
  // landmark label rather than wait for a specific price, which is time-sensitive.
  await expect(
    page.getByRole('complementary', { name: /market pulse/i }),
  ).toBeVisible()

  // Site signals strip
  await expect(page.getByLabel(/site signals/i)).toBeVisible()

  // Pillars region with a featured pillar (h2) plus four h3s
  const pillars = page.getByRole('region', { name: /pillars/i })
  await expect(pillars).toBeVisible()
  await expect(pillars.locator('h2')).toHaveCount(1)
  await expect(pillars.locator('h3')).toHaveCount(4)

  // Hero CTAs
  await expect(
    page.getByRole('link', { name: /start with ira rules/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /see live spot prices/i }),
  ).toBeVisible()
})
```

- [ ] **Step 6: Run the full unit suite**

Run: `pnpm test`

Expected: all pass. If any other test in the repo asserted the OLD pillar-grid copy from the flat homepage (e.g., a test expecting specific pillar-link text to be reachable from the home route), update the selector to work with the bento structure. If you cannot find a clean update, STOP and list the failing tests.

- [ ] **Step 7: Run the full check:all + E2E**

Run: `pnpm check:all`
Expected: lint, typecheck, vitest (all), disclosure, no-hex, brand-voice, llms-corpus, env-example, build — all green.

Run: `pnpm test:e2e`
Expected: all previously-passing specs still pass, and the updated `home.spec.ts` passes with the new assertions.

- [ ] **Step 8: Commit**

```bash
git add 'src/app/(marketing)/page.tsx' 'src/app/(marketing)/page.test.tsx' tests/e2e/home.spec.ts
git commit -m "feat(home): compose HomeHero + SignalStrip + PillarBento into the homepage"
```

---

## Task 9: A11y + reduced-motion + manual visual QA

**Files:**
- Verify: everything.
- Possibly modify: `src/app/globals.css` (add a prefers-reduced-motion hint if hover transitions feel distracting).

**Context:** The redesign introduces hover-state shadow transitions on cards. Users with `prefers-reduced-motion: reduce` should not see those transitions. The existing globals.css does not yet honor that media query. Add the rule once at the utilities layer so it applies everywhere (not just to homepage cards).

- [ ] **Step 1: Check whether globals.css already handles reduced motion**

Run: `grep -n "prefers-reduced-motion" src/app/globals.css`

Expected: no match (the directive isn't there yet). If it IS there, skip Step 2.

- [ ] **Step 2: Add a reduced-motion override to globals.css**

Append this block at the bottom of `src/app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Run lint + typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: both clean.

- [ ] **Step 4: Manual visual smoke**

Start dev server: `pnpm dev`

Walk in a browser at `http://localhost:3000`:
- `/` — hero shows display-size serif h1, subtitle, two CTAs, lockup on left; MarketPulseCard on right at lg+. On mobile (<1024px), the pulse card stacks below.
- SignalStrip is visible below hero, numbers use mono font.
- PillarBento: featured IRA Rules card is navy + larger; other four pillars are white cards with gold eyebrows; hovering any card shows a shadow lift.
- Footer and disclosure are below the bento, as Plan 11 left them.
- Tab through with keyboard: focus ring is gold (from existing globals.css rule); tab order is hero CTAs → pulse card link → signal strip (links are inline-only if present) → featured pillar CTA → each pillar card in DOM order → footer nav.
- Toggle OS-level "reduce motion" and reload: hover shadows no longer animate; they snap.

If any of these behaviors is wrong, fix the specific component in question with a follow-up commit in this task (keep it to style fixes only — no structural changes).

- [ ] **Step 5: Contrast spot check**

Use the browser DevTools contrast checker on:
- `text-brand-gold` on white (hero eyebrow): should pass AA for small text (gold #B8860B on platinum #F8FAFC ≈ 4.73:1).
- `text-brand-gold` on `bg-brand-navy` (FeaturedPillarCard eyebrow + CTA): should pass AA (gold on navy ≈ 5.07:1).
- `text-brand-platinum/80` on `bg-brand-navy` (featured card dek): should pass AA (platinum at 80% opacity on navy ≈ 11:1).

If any fail AA at small text, report as DONE_WITH_CONCERNS with the specific failure — don't swap tokens blindly.

- [ ] **Step 6: Run `pnpm check:all` + `pnpm test:e2e` one more time**

Expected: all green.

- [ ] **Step 7: Commit (only if globals.css changed)**

```bash
git add src/app/globals.css
git commit -m "fix(a11y): honor prefers-reduced-motion across the app"
```

---

## Task 10: Update plans README and open PR

- [ ] **Step 1: Add row 12 to `docs/superpowers/plans/README.md`**

Below the Plan 11 row, add:

```md
| 12 | Homepage Visual Redesign | [`2026-04-23-homepage-visual-redesign.md`](./2026-04-23-homepage-visual-redesign.md) | `v1.4.0-home-visual` |
```

- [ ] **Step 2: Commit the index update**

```bash
git add docs/superpowers/plans/README.md
git commit -m "docs(plans): index Plan 12 — homepage visual redesign"
```

- [ ] **Step 3: Push and open the PR**

```bash
git push -u origin HEAD
gh pr create --title "Homepage visual redesign: asymmetric hero, market pulse, bento pillars" --body "$(cat <<'EOF'
## Summary
- Replaces the centered template homepage with an editorial publication layout
- Asymmetric 2-column hero (h1 + CTAs + ownership lockup left, live Market Pulse panel right) with a subtle inline-SVG guilloche backdrop
- New SignalStrip band shows real content counts (articles, calculators, last-updated)
- PillarBento: one featured pillar rendered larger with a navy surface + gold accent; four other pillars as standard cards with hover depth
- Respects prefers-reduced-motion across the app

## Test plan
- [ ] `pnpm check:all` green
- [ ] `pnpm test:e2e` green
- [ ] Manual: hero responsive (stacks under lg breakpoint)
- [ ] Manual: MarketPulseCard shows live prices within ~1s
- [ ] Manual: tab order reaches every hero CTA and pillar card
- [ ] Manual: enabling OS reduce-motion removes hover transitions
EOF
)"
```

---

## Self-Review Notes

**Spec coverage:**
- Editorial / publication direction → Task 7 hero + Task 5 featured card.
- Break the uniform grid (bento) → Task 6 PillarBento.
- Gold as functional accent → eyebrows (Tasks 4, 5, 7), featured CTA (5), hero gold eyebrow (7), border hover (4).
- Mono treatment on numbers → MarketPulseCard (2), SignalStrip (3).
- Depth via shadow → FeaturedPillarCard `shadow-md`, PillarCard `hover:shadow-md`, MarketPulseCard `shadow-md`.
- Inline-SVG texture instead of imagery → HeroBackdrop (1).
- No out-of-scope changes to pillar pages, dark mode, imagery libraries, or animation libraries.

**Type consistency:**
- `FEATURED_PILLAR_SLUG: PillarSlug` used consistently in `home-config.ts`, `HomeHero.tsx`, `PillarBento.tsx`.
- `Pillar` type imported from `@/lib/site-map` in both `PillarCard` and `FeaturedPillarCard`.
- `MetalKey` imported from `@/market/schema` in `MarketPulseCard` matches `LiveSpotPriceTicker`'s usage.
- `useSpotPrice` return shape (`data.pricePerOunceUsd: string`, `data.change24hPercent: number`) consistent across mock + implementation.

**Placeholder scan:** None. Every code block is complete; every command has expected output; no "TBD" / "similar to Task N".

**Known risk:** Step 1 of Task 8 asks the implementer to discover the exported symbol name in `public-tools.ts`. If the symbol name is unexpected, Task 8 Step 3's code block would need a rename. The task includes explicit instruction to stop and report BLOCKED rather than invent an import.
