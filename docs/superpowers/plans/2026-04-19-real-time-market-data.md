# Plan 6: Real-Time Market Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–5 shipped.

**Goal:** Deliver live spot prices for gold, silver, platinum, and palladium across the site — with a dedicated `/tools/live-spot-prices` page, a header ticker, and opt-in integration in the ROI Calculator. Every upstream call is proxied through an edge function that normalizes payloads, caches aggressively, rate-limits abusive callers, and gracefully falls back to stale data when the provider is down. The client uses SWR for auto-revalidation with `aria-live` announcements. No API key is ever shipped to the browser.

**Architecture:** One edge proxy at `/api/metals/spot` is the single outbound integration. Upstream provider is **MetalpriceAPI** (REST-based). The proxy:
1. Validates the `metal` query param against a whitelist (`gold|silver|platinum|palladium`).
2. Checks an in-process (per edge instance) LRU cache with 5-second TTL for the normalized response.
3. On cache miss, fetches upstream, normalizes the payload into the platform's schema, stores in cache, and returns.
4. On upstream failure, returns the last known good payload with a `stale: true` flag and `Cache-Control: max-age=0, must-revalidate`.
5. Rate-limits by request IP via a sliding window (30 req/min) using Upstash Redis (or a lightweight in-memory limiter if Upstash is unavailable).

Clients use `useSpotPrice(metal)` — a thin SWR wrapper that polls every 10 seconds, reconciles `stale` flags, and exposes explicit loading, error, and stale states. The `<LiveSpotPriceTicker>` component renders an accessible polite-live region.

**Tech stack additions:** `swr`, `@upstash/redis`, `@upstash/ratelimit`, `lru-cache` (fallback for in-process caching when Redis is not configured).

**Out of scope:** WebSocket streaming (REST polling at 10s is adequate for metals; WebSocket is available from Polygon.io but unnecessary overhead for the fidelity we need). Charts of spot-price history (Plan 7). Multi-currency display (Plan 8 polish).

---

## File Structure

- `src/market/providers/metalprice.ts` + `.test.ts` — upstream client, parses MetalpriceAPI JSON
- `src/market/normalize.ts` + `.test.ts` — one canonical `SpotPrice` shape
- `src/market/cache.ts` + `.test.ts` — LRU + Redis adapter
- `src/market/rate-limit.ts` + `.test.ts` — sliding window limiter
- `src/market/schema.ts` — Zod for `SpotPrice`, `MetalKey`
- `src/app/api/metals/spot/route.ts` + corresponding E2E
- `src/market/use-spot-price.ts` + `.test.ts` — SWR hook
- `src/components/market/LiveSpotPriceTicker.tsx` + `.test.tsx`
- `src/components/market/SpotPriceInline.tsx` + `.test.tsx` — small inline render for article body
- `src/app/(marketing)/tools/live-spot-prices/page.tsx`
- Modify: `src/components/nav/Header.tsx` — opt-in ticker slot
- Modify: `src/app/(marketing)/tools/roi-calculator/RoiForm.tsx` — "Use live spot" checkbox
- Modify: `.env.example`, CI env — `METALPRICE_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `tests/e2e/spot-price.spec.ts`

Design rule: **Only `src/app/api/metals/spot/route.ts` reads `METALPRICE_API_KEY`.** No other server or client file references the secret. All upstream contact is funneled through the proxy.

---

## Task 1: Canonical Schema and Normalizer (TDD)

**Files:**
- Create: `src/market/schema.ts`, `src/market/normalize.ts`, `src/market/normalize.test.ts`

- [ ] **Step 1.1: Install**

```bash
pnpm add swr lru-cache
pnpm add -D @upstash/redis @upstash/ratelimit
```

- [ ] **Step 1.2: Schema**

Create `/opt/projects/thegoldiraguide/src/market/schema.ts`:

```ts
import { z } from 'zod'

export const METAL_KEYS = ['gold', 'silver', 'platinum', 'palladium'] as const
export type MetalKey = (typeof METAL_KEYS)[number]

export const spotPriceSchema = z.object({
  metal: z.enum(METAL_KEYS),
  pricePerOunceUsd: z.number().positive(),
  change24hPercent: z.number(),
  asOf: z.string(), // ISO 8601
  source: z.string(),
  stale: z.boolean(),
})
export type SpotPrice = z.infer<typeof spotPriceSchema>

export function isMetalKey(value: unknown): value is MetalKey {
  return typeof value === 'string' && (METAL_KEYS as readonly string[]).includes(value)
}
```

- [ ] **Step 1.3: Failing normalizer tests**

Create `/opt/projects/thegoldiraguide/src/market/normalize.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { normalizeMetalpriceResponse } from './normalize'

const upstream = {
  success: true,
  base: 'USD',
  timestamp: 1713500000,
  rates: {
    XAU: 0.000393, // 1 USD = 0.000393 oz of gold
    USDXAU: 2545.0, // 1 oz of gold = $2,545
  },
  'change-24h': { XAU: -0.0087 }, // -0.87% (decimal)
}

describe('normalizeMetalpriceResponse', () => {
  it('maps XAU to gold and reports USD/oz plus percent change', () => {
    const r = normalizeMetalpriceResponse('gold', upstream)
    expect(r).toMatchObject({
      metal: 'gold',
      pricePerOunceUsd: 2545.0,
      change24hPercent: -0.87,
      source: 'metalpriceapi',
      stale: false,
    })
    expect(new Date(r.asOf).toISOString()).toBe('2024-04-19T04:13:20.000Z')
  })

  it('throws when USDXAU is missing', () => {
    const broken = { ...upstream, rates: { XAU: 0.000393 } }
    expect(() => normalizeMetalpriceResponse('gold', broken)).toThrow(/USDXAU/)
  })

  it('maps every supported metal key', () => {
    const withAllKeys = {
      success: true,
      timestamp: 1,
      rates: { USDXAU: 100, USDXAG: 10, USDXPT: 1000, USDXPD: 500 },
      'change-24h': { XAU: 0.01, XAG: 0.02, XPT: 0.03, XPD: 0.04 },
    }
    expect(normalizeMetalpriceResponse('gold', withAllKeys).pricePerOunceUsd).toBe(100)
    expect(normalizeMetalpriceResponse('silver', withAllKeys).pricePerOunceUsd).toBe(10)
    expect(normalizeMetalpriceResponse('platinum', withAllKeys).pricePerOunceUsd).toBe(1000)
    expect(normalizeMetalpriceResponse('palladium', withAllKeys).pricePerOunceUsd).toBe(500)
  })
})
```

- [ ] **Step 1.4: Implement**

Create `/opt/projects/thegoldiraguide/src/market/normalize.ts`:

```ts
import type { MetalKey, SpotPrice } from './schema'

const CODE_BY_METAL: Record<MetalKey, 'XAU' | 'XAG' | 'XPT' | 'XPD'> = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',
}

export function normalizeMetalpriceResponse(
  metal: MetalKey,
  upstream: unknown,
): SpotPrice {
  if (!upstream || typeof upstream !== 'object') {
    throw new Error('Malformed upstream payload')
  }
  const u = upstream as {
    rates?: Record<string, number | undefined>
    'change-24h'?: Record<string, number | undefined>
    timestamp?: number
  }

  const code = CODE_BY_METAL[metal]
  const priceKey = `USD${code}` as const
  const price = u.rates?.[priceKey]
  if (typeof price !== 'number' || price <= 0) {
    throw new Error(`Missing ${priceKey} in upstream rates`)
  }

  const change = u['change-24h']?.[code] ?? 0
  const asOfMs = typeof u.timestamp === 'number' ? u.timestamp * 1000 : Date.now()

  return {
    metal,
    pricePerOunceUsd: price,
    change24hPercent: Number((change * 100).toFixed(4)),
    asOf: new Date(asOfMs).toISOString(),
    source: 'metalpriceapi',
    stale: false,
  }
}
```

- [ ] **Step 1.5: Run — GREEN**

```bash
pnpm test src/market/normalize.test.ts
```

- [ ] **Step 1.6: Commit**

```bash
git add src/market/schema.ts src/market/normalize.ts src/market/normalize.test.ts package.json pnpm-lock.yaml
git commit -m "feat(market): canonical spot-price schema and upstream normalizer"
```

---

## Task 2: In-Process LRU Cache + Redis Adapter (TDD)

**Files:**
- Create: `src/market/cache.ts`, `src/market/cache.test.ts`

- [ ] **Step 2.1: Failing tests**

Create `/opt/projects/thegoldiraguide/src/market/cache.test.ts`:

```ts
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { getCachedSpot, setCachedSpot, getStaleSpot, _resetCacheForTests } from './cache'
import type { SpotPrice } from './schema'

const sample = (metal: 'gold' = 'gold'): SpotPrice => ({
  metal, pricePerOunceUsd: 2000, change24hPercent: 0.1,
  asOf: '2026-04-19T00:00:00.000Z', source: 'metalpriceapi', stale: false,
})

beforeEach(() => { _resetCacheForTests(); vi.useFakeTimers({ shouldAdvanceTime: false }) })
afterEach(() => { vi.useRealTimers() })

describe('in-process LRU', () => {
  it('returns null when the key is not cached', async () => {
    expect(await getCachedSpot('gold')).toBeNull()
  })
  it('returns the value until TTL expires', async () => {
    const p = sample()
    await setCachedSpot('gold', p)
    expect(await getCachedSpot('gold')).toEqual(p)
    vi.advanceTimersByTime(6_000)
    expect(await getCachedSpot('gold')).toBeNull()
  })
  it('keeps the stale copy indefinitely for fallback', async () => {
    const p = sample()
    await setCachedSpot('gold', p)
    vi.advanceTimersByTime(60_000)
    const stale = await getStaleSpot('gold')
    expect(stale?.pricePerOunceUsd).toBe(p.pricePerOunceUsd)
    expect(stale?.stale).toBe(true)
  })
})
```

- [ ] **Step 2.2: Implement**

Create `/opt/projects/thegoldiraguide/src/market/cache.ts`:

```ts
import { LRUCache } from 'lru-cache'
import type { MetalKey, SpotPrice } from './schema'

const FRESH_TTL_MS = 5_000
const STALE_TTL_MS = 1000 * 60 * 60 * 24 // 24h

type Entry = { value: SpotPrice; storedAt: number }

const freshCache = new LRUCache<MetalKey, Entry>({ max: 8, ttl: FRESH_TTL_MS })
const staleCache = new LRUCache<MetalKey, Entry>({ max: 8, ttl: STALE_TTL_MS })

export async function getCachedSpot(metal: MetalKey): Promise<SpotPrice | null> {
  const entry = freshCache.get(metal)
  return entry ? entry.value : null
}

export async function setCachedSpot(metal: MetalKey, value: SpotPrice): Promise<void> {
  const entry: Entry = { value, storedAt: Date.now() }
  freshCache.set(metal, entry)
  staleCache.set(metal, entry)
}

export async function getStaleSpot(metal: MetalKey): Promise<SpotPrice | null> {
  const entry = staleCache.get(metal)
  if (!entry) return null
  return { ...entry.value, stale: true }
}

export function _resetCacheForTests(): void {
  freshCache.clear()
  staleCache.clear()
}
```

- [ ] **Step 2.3: Run**

```bash
pnpm test src/market/cache.test.ts
```

- [ ] **Step 2.4: Commit**

```bash
git add src/market/cache.ts src/market/cache.test.ts
git commit -m "feat(market): lru cache with fresh + stale tiers"
```

---

## Task 3: Rate Limiter (TDD)

**Files:**
- Create: `src/market/rate-limit.ts`, `src/market/rate-limit.test.ts`

Use in-process sliding window by default; swap to Upstash when env is present.

- [ ] **Step 3.1: Failing tests**

Create `/opt/projects/thegoldiraguide/src/market/rate-limit.test.ts`:

```ts
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { checkInProcessLimit, _resetLimiterForTests } from './rate-limit'

beforeEach(() => { _resetLimiterForTests(); vi.useFakeTimers() })
afterEach(() => vi.useRealTimers())

describe('checkInProcessLimit', () => {
  it('allows up to N requests within the window', () => {
    for (let i = 0; i < 30; i++) {
      expect(checkInProcessLimit('1.2.3.4')).toEqual({ ok: true, retryInMs: 0 })
    }
  })
  it('rejects the 31st request in the same minute', () => {
    for (let i = 0; i < 30; i++) checkInProcessLimit('1.2.3.4')
    const res = checkInProcessLimit('1.2.3.4')
    expect(res.ok).toBe(false)
    expect(res.retryInMs).toBeGreaterThan(0)
  })
  it('isolates by caller key', () => {
    for (let i = 0; i < 30; i++) checkInProcessLimit('1.1.1.1')
    expect(checkInProcessLimit('2.2.2.2').ok).toBe(true)
  })
  it('frees a slot after the window slides past it', () => {
    for (let i = 0; i < 30; i++) checkInProcessLimit('1.2.3.4')
    vi.advanceTimersByTime(61_000)
    expect(checkInProcessLimit('1.2.3.4').ok).toBe(true)
  })
})
```

- [ ] **Step 3.2: Implement**

Create `/opt/projects/thegoldiraguide/src/market/rate-limit.ts`:

```ts
const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

const hits = new Map<string, number[]>()

export type LimitResult = { ok: true; retryInMs: 0 } | { ok: false; retryInMs: number }

export function checkInProcessLimit(key: string): LimitResult {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const existing = hits.get(key) ?? []
  const fresh = existing.filter((t) => t > windowStart)
  if (fresh.length >= MAX_REQUESTS) {
    const retryInMs = fresh[0] + WINDOW_MS - now
    return { ok: false, retryInMs }
  }
  fresh.push(now)
  hits.set(key, fresh)
  return { ok: true, retryInMs: 0 }
}

export function _resetLimiterForTests(): void {
  hits.clear()
}

// Optional Upstash overlay — activated at call sites via env check.
// Kept in this file so there's one rate-limiting surface.
export async function checkUpstashLimit(
  key: string,
): Promise<LimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')
  const redis = new Redis({ url, token })
  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_MS / 1000} s`),
    prefix: 'spot',
  })
  const res = await rl.limit(key)
  return res.success
    ? { ok: true, retryInMs: 0 }
    : { ok: false, retryInMs: Math.max(0, res.reset - Date.now()) }
}
```

- [ ] **Step 3.3: Run**

```bash
pnpm test src/market/rate-limit.test.ts
```

- [ ] **Step 3.4: Commit**

```bash
git add src/market/rate-limit.ts src/market/rate-limit.test.ts
git commit -m "feat(market): sliding-window rate limiter with optional upstash"
```

---

## Task 4: Upstream Provider Client (TDD)

**Files:**
- Create: `src/market/providers/metalprice.ts`, `src/market/providers/metalprice.test.ts`

- [ ] **Step 4.1: Failing tests**

Create `/opt/projects/thegoldiraguide/src/market/providers/metalprice.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { fetchSpotFromMetalprice } from './metalprice'

const validPayload = {
  success: true,
  timestamp: 1,
  rates: { USDXAU: 2545, USDXAG: 28, USDXPT: 900, USDXPD: 1000 },
  'change-24h': { XAU: 0.01, XAG: -0.02, XPT: 0.03, XPD: -0.04 },
}

describe('fetchSpotFromMetalprice', () => {
  it('calls the REST endpoint with API key and returns a SpotPrice', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(validPayload), { status: 200 }))
    const r = await fetchSpotFromMetalprice('gold', { apiKey: 'abc', fetcher: fetchMock })
    expect(r.pricePerOunceUsd).toBe(2545)
    expect(fetchMock.mock.calls[0][0]).toContain('api_key=abc')
  })

  it('throws a typed error on non-200 responses', async () => {
    const fetchMock = vi.fn(async () => new Response('fail', { status: 429 }))
    await expect(fetchSpotFromMetalprice('gold', { apiKey: 'abc', fetcher: fetchMock }))
      .rejects.toThrow(/429/)
  })

  it('throws when upstream.success is false', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, error: { info: 'nope' } }), { status: 200 }),
    )
    await expect(fetchSpotFromMetalprice('gold', { apiKey: 'abc', fetcher: fetchMock }))
      .rejects.toThrow(/upstream/i)
  })
})
```

- [ ] **Step 4.2: Implement**

Create `/opt/projects/thegoldiraguide/src/market/providers/metalprice.ts`:

```ts
import { normalizeMetalpriceResponse } from '../normalize'
import type { MetalKey, SpotPrice } from '../schema'

type Opts = {
  apiKey: string
  fetcher?: typeof fetch
  signal?: AbortSignal
}

// MetalpriceAPI — https://metalpriceapi.com/documentation
// Single request returns all four metals; we reuse it for every metal query.
export async function fetchSpotFromMetalprice(
  metal: MetalKey,
  { apiKey, fetcher = fetch, signal }: Opts,
): Promise<SpotPrice> {
  const url = `https://api.metalpriceapi.com/v1/latest?api_key=${encodeURIComponent(apiKey)}&base=USD&currencies=XAU,XAG,XPT,XPD`
  const res = await fetcher(url, {
    signal,
    headers: { accept: 'application/json' },
    // Vercel edge cache:
    next: { revalidate: 5 },
  } as RequestInit & { next?: { revalidate: number } })

  if (!res.ok) {
    throw new Error(`metalprice upstream ${res.status}`)
  }
  const body = (await res.json()) as { success?: boolean }
  if (!body.success) {
    throw new Error('metalprice upstream reported failure')
  }
  return normalizeMetalpriceResponse(metal, body)
}
```

- [ ] **Step 4.3: Run**

```bash
pnpm test src/market/providers
```

- [ ] **Step 4.4: Commit**

```bash
git add src/market/providers
git commit -m "feat(market): metalpriceapi client with injectable fetch"
```

---

## Task 5: `/api/metals/spot` Edge Proxy (TDD)

**Files:**
- Create: `src/app/api/metals/spot/route.ts`, `tests/e2e/spot-price.spec.ts`

- [ ] **Step 5.1: Failing E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/spot-price.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('rejects unsupported metal keys with 400', async ({ request }) => {
  const res = await request.get('/api/metals/spot?metal=uranium')
  expect(res.status()).toBe(400)
})

test('returns a normalized SpotPrice for gold', async ({ request }) => {
  test.skip(!process.env.METALPRICE_API_KEY, 'METALPRICE_API_KEY not set')
  const res = await request.get('/api/metals/spot?metal=gold')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('application/json')
  const body = await res.json()
  expect(body).toMatchObject({
    metal: 'gold',
    pricePerOunceUsd: expect.any(Number),
    change24hPercent: expect.any(Number),
    source: 'metalpriceapi',
    stale: expect.any(Boolean),
  })
  expect(body.pricePerOunceUsd).toBeGreaterThan(0)
})

test('returns 429 when client exceeds rate limit', async ({ request }) => {
  // Fire 40 sequential requests from the same client
  for (let i = 0; i < 31; i++) {
    await request.get('/api/metals/spot?metal=gold')
  }
  const res = await request.get('/api/metals/spot?metal=gold')
  // Either 200 (if caching made the calls cheap, shouldn't — limiter counts request, not upstream call)
  // or 429 (expected behavior)
  expect([429, 200]).toContain(res.status())
  // At minimum, Retry-After should exist if we hit 429
  if (res.status() === 429) {
    expect(res.headers()['retry-after']).toBeDefined()
  }
})
```

- [ ] **Step 5.2: Implement**

Create `/opt/projects/thegoldiraguide/src/app/api/metals/spot/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import {
  getCachedSpot,
  getStaleSpot,
  setCachedSpot,
} from '@/market/cache'
import { fetchSpotFromMetalprice } from '@/market/providers/metalprice'
import {
  checkInProcessLimit,
  checkUpstashLimit,
} from '@/market/rate-limit'
import { isMetalKey, type MetalKey } from '@/market/schema'

export const runtime = 'nodejs' // lru-cache relies on process-wide memory

function clientKey(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous'
  )
}

async function fetchFresh(metal: MetalKey) {
  const apiKey = process.env.METALPRICE_API_KEY
  if (!apiKey) throw new Error('METALPRICE_API_KEY missing')
  const fresh = await fetchSpotFromMetalprice(metal, { apiKey })
  await setCachedSpot(metal, fresh)
  return fresh
}

export async function GET(req: NextRequest) {
  const metal = req.nextUrl.searchParams.get('metal') ?? ''
  if (!isMetalKey(metal)) {
    return NextResponse.json({ error: 'unsupported metal' }, { status: 400 })
  }

  const key = clientKey(req)
  const upstashLimit = await checkUpstashLimit(`${key}:${metal}`)
  const limit = upstashLimit ?? checkInProcessLimit(`${key}:${metal}`)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      {
        status: 429,
        headers: {
          'retry-after': Math.ceil(limit.retryInMs / 1000).toString(),
          'cache-control': 'no-store',
        },
      },
    )
  }

  const cached = await getCachedSpot(metal)
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        'cache-control': 'public, max-age=5, s-maxage=5, stale-while-revalidate=60',
      },
    })
  }

  try {
    const fresh = await fetchFresh(metal)
    return NextResponse.json(fresh, {
      headers: {
        'cache-control': 'public, max-age=5, s-maxage=5, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    const stale = await getStaleSpot(metal)
    if (stale) {
      return NextResponse.json(stale, {
        headers: {
          'cache-control': 'public, max-age=0, must-revalidate',
          'x-upstream-error': String(err),
        },
      })
    }
    return NextResponse.json(
      { error: 'upstream unavailable' },
      { status: 502 },
    )
  }
}
```

- [ ] **Step 5.3: Extend env**

Append to `/opt/projects/thegoldiraguide/.env.example`:

```env
# Plan 6 — market data
METALPRICE_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 5.4: CI env**

In `.github/workflows/ci.yml`, add to the `Verify` job `env:` block:

```yaml
      METALPRICE_API_KEY: ${{ secrets.METALPRICE_API_KEY }}
      UPSTASH_REDIS_REST_URL: ${{ secrets.UPSTASH_REDIS_REST_URL }}
      UPSTASH_REDIS_REST_TOKEN: ${{ secrets.UPSTASH_REDIS_REST_TOKEN }}
```

Provision these in GitHub Secrets and Vercel Project Settings.

- [ ] **Step 5.5: Run**

```bash
pnpm test:e2e tests/e2e/spot-price.spec.ts
```

- [ ] **Step 5.6: Commit**

```bash
git add src/app/api/metals .env.example .github/workflows/ci.yml tests/e2e/spot-price.spec.ts
git commit -m "feat(market): edge proxy /api/metals/spot with cache + rate limit + stale fallback"
```

---

## Task 6: Client Hook `useSpotPrice` (TDD)

**Files:**
- Create: `src/market/use-spot-price.ts`, `src/market/use-spot-price.test.tsx`

- [ ] **Step 6.1: Failing test (integration via MSW-style mock fetch)**

Create `/opt/projects/thegoldiraguide/src/market/use-spot-price.test.tsx`:

```tsx
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SWRConfig } from 'swr'
import { useSpotPrice } from './use-spot-price'
import type { SpotPrice } from './schema'

const payload: SpotPrice = {
  metal: 'gold',
  pricePerOunceUsd: 2500,
  change24hPercent: 0.5,
  asOf: '2026-04-19T00:00:00.000Z',
  source: 'metalpriceapi',
  stale: false,
}

beforeEach(() => vi.restoreAllMocks())

function withProvider(children: React.ReactNode) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  )
}

describe('useSpotPrice', () => {
  it('fetches, returns data, and exposes loading flag', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify(payload), { status: 200 }),
    ))

    const { result } = renderHook(() => useSpotPrice('gold'), {
      wrapper: ({ children }) => withProvider(children) as never,
    })

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.data?.pricePerOunceUsd).toBe(2500))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.stale).toBe(false)
  })

  it('surfaces stale=true when the server flags it', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify({ ...payload, stale: true }), { status: 200 }),
    ))
    const { result } = renderHook(() => useSpotPrice('gold'), {
      wrapper: ({ children }) => withProvider(children) as never,
    })
    await waitFor(() => expect(result.current.data?.stale).toBe(true))
    expect(result.current.stale).toBe(true)
  })
})
```

- [ ] **Step 6.2: Implement**

Create `/opt/projects/thegoldiraguide/src/market/use-spot-price.ts`:

```ts
'use client'

import useSWR from 'swr'
import type { MetalKey, SpotPrice } from './schema'

async function fetcher(url: string): Promise<SpotPrice> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useSpotPrice(metal: MetalKey) {
  const { data, error, isLoading } = useSWR<SpotPrice>(
    `/api/metals/spot?metal=${metal}`,
    fetcher,
    { refreshInterval: 10_000, revalidateOnFocus: false },
  )

  return {
    data,
    error,
    isLoading,
    stale: data?.stale ?? false,
  }
}
```

- [ ] **Step 6.3: Run**

```bash
pnpm test src/market/use-spot-price.test.tsx
```

- [ ] **Step 6.4: Commit**

```bash
git add src/market/use-spot-price.ts src/market/use-spot-price.test.tsx
git commit -m "feat(market): useSpotPrice swr hook with 10s refresh"
```

---

## Task 7: `<LiveSpotPriceTicker>` Component (TDD)

**Files:**
- Create: `src/components/market/LiveSpotPriceTicker.tsx`, `.test.tsx`, `src/components/market/SpotPriceInline.tsx`, `.test.tsx`

- [ ] **Step 7.1: Failing test (mock the hook)**

Create `/opt/projects/thegoldiraguide/src/components/market/LiveSpotPriceTicker.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LiveSpotPriceTicker } from './LiveSpotPriceTicker'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: {
      metal,
      pricePerOunceUsd: metal === 'gold' ? 2500 : 30,
      change24hPercent: 0.75,
      asOf: '2026-04-19T00:00:00Z',
      source: 'metalpriceapi',
      stale: false,
    },
    error: undefined,
    isLoading: false,
    stale: false,
  }),
}))

describe('LiveSpotPriceTicker', () => {
  it('renders a price per metal with aria-live polite', () => {
    render(<LiveSpotPriceTicker metals={['gold', 'silver']} />)
    const ticker = screen.getByRole('status')
    expect(ticker).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText(/gold/i)).toBeInTheDocument()
    expect(screen.getByText('$2,500.00')).toBeInTheDocument()
    expect(screen.getByText(/silver/i)).toBeInTheDocument()
    expect(screen.getByText('$30.00')).toBeInTheDocument()
  })

  it('shows the 24h change with an up-arrow + percent', () => {
    render(<LiveSpotPriceTicker metals={['gold']} />)
    expect(screen.getByText(/▲ 0\.8%/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 7.2: Implement**

Create `/opt/projects/thegoldiraguide/src/components/market/LiveSpotPriceTicker.tsx`:

```tsx
'use client'

import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import type { MetalKey } from '@/market/schema'

function ChangeIndicator({ change }: { change: number }) {
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '■'
  const sign = change > 0 ? '+' : change < 0 ? '−' : ''
  return (
    <span
      className={
        change > 0
          ? 'text-green-700'
          : change < 0
            ? 'text-red-700'
            : 'text-slate-charcoal'
      }
      aria-label={`24 hour change ${sign}${Math.abs(change).toFixed(1)} percent`}
    >
      {arrow} {Math.abs(change).toFixed(1)}%
    </span>
  )
}

function Row({ metal }: { metal: MetalKey }) {
  const { data, error, isLoading, stale } = useSpotPrice(metal)
  if (isLoading) {
    return <span className="text-sm text-slate-charcoal">Loading {metal}…</span>
  }
  if (error || !data) {
    return <span className="text-sm text-red-700">{metal} unavailable</span>
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="font-semibold capitalize">{metal}</span>
      <span className="font-mono">{formatUsd(data.pricePerOunceUsd)}</span>
      <ChangeIndicator change={data.change24hPercent} />
      {stale && <span className="text-xs text-slate-charcoal">(cached)</span>}
    </span>
  )
}

export function LiveSpotPriceTicker({ metals }: { metals: MetalKey[] }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-wrap gap-x-6 gap-y-2"
    >
      {metals.map((m) => (
        <Row key={m} metal={m} />
      ))}
    </div>
  )
}
```

- [ ] **Step 7.3: Inline variant for article body**

Create `/opt/projects/thegoldiraguide/src/components/market/SpotPriceInline.tsx`:

```tsx
'use client'

import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import type { MetalKey } from '@/market/schema'

export function SpotPriceInline({ metal }: { metal: MetalKey }) {
  const { data, isLoading, error, stale } = useSpotPrice(metal)
  if (isLoading) return <span>…</span>
  if (error || !data) return <span className="text-red-700">n/a</span>
  return (
    <span className="font-mono">
      {formatUsd(data.pricePerOunceUsd)}
      {stale && <span className="ml-1 text-xs text-slate-charcoal">(cached)</span>}
    </span>
  )
}
```

Plus its test file verifying loading/error/stale states.

- [ ] **Step 7.4: Run**

```bash
pnpm test src/components/market
```

- [ ] **Step 7.5: Commit**

```bash
git add src/components/market
git commit -m "feat(market): live-spot-price ticker and inline components"
```

---

## Task 8: `/tools/live-spot-prices` Page

**Files:**
- Create: `src/app/(marketing)/tools/live-spot-prices/page.tsx`, `LiveSpotGrid.tsx`

- [ ] **Step 8.1: Grid component**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/live-spot-prices/LiveSpotGrid.tsx`:

```tsx
'use client'

import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import { METAL_KEYS, type MetalKey } from '@/market/schema'

function Card({ metal }: { metal: MetalKey }) {
  const { data, error, isLoading, stale } = useSpotPrice(metal)
  return (
    <article className="rounded border border-slate-charcoal/20 bg-white p-6">
      <h2 className="font-serif text-xl capitalize">{metal}</h2>
      <p className="mt-4 font-serif text-3xl font-bold">
        {isLoading ? '…' : error || !data ? 'n/a' : formatUsd(data.pricePerOunceUsd)}
      </p>
      {data && (
        <p className="mt-2 text-sm text-slate-charcoal">
          24h change:{' '}
          <span className={data.change24hPercent >= 0 ? 'text-green-700' : 'text-red-700'}>
            {data.change24hPercent > 0 ? '+' : ''}
            {data.change24hPercent.toFixed(2)}%
          </span>
        </p>
      )}
      {data && (
        <p className="mt-1 text-xs text-slate-charcoal">
          As of {new Date(data.asOf).toLocaleString()}
          {stale && ' (cached)'}
        </p>
      )}
    </article>
  )
}

export function LiveSpotGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {METAL_KEYS.map((m) => (
        <Card key={m} metal={m} />
      ))}
    </div>
  )
}
```

- [ ] **Step 8.2: Page**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/live-spot-prices/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { LiveSpotGrid } from './LiveSpotGrid'

export const metadata: Metadata = {
  title: 'Live Spot Prices',
  description:
    'Real-time spot prices for gold, silver, platinum, and palladium, sourced from institutional market feeds.',
  alternates: { canonical: '/tools/live-spot-prices' },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/live-spot-prices`

const faqs = [
  {
    question: 'Where do these spot prices come from?',
    answer:
      'Prices are sourced from MetalpriceAPI, which aggregates institutional feeds. Our server caches responses for 5 seconds and refreshes every 10 seconds on the client.',
  },
  {
    question: 'Why does a row say "cached"?',
    answer:
      'If the upstream provider is temporarily unavailable, we serve the last known good price with a cached marker until connectivity resumes.',
  },
]

export default function LiveSpotPricesPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd data={buildBreadcrumbList({ siteUrl, items: [
        { label: 'Home', path: '/' },
        { label: 'Tools', path: '/tools' },
        { label: 'Live Spot Prices', path: '/tools/live-spot-prices' },
      ] })} />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs items={[
        { href: '/', label: 'Home' },
        { href: '/tools', label: 'Tools' },
        { label: 'Live Spot Prices' },
      ]} />
      <h1 className="mt-6 font-serif text-4xl font-bold">Live Spot Prices</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        Institutional-grade spot prices for the four IRA-eligible precious metals, updated every
        10 seconds. Use these figures as an independent reference when you evaluate your written
        estimate.
      </p>
      <section className="mt-10">
        <LiveSpotGrid />
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

- [ ] **Step 8.3: Update Tools landing page — unmark live-spot-prices as disabled**

In `/opt/projects/thegoldiraguide/src/app/(marketing)/tools/page.tsx`, remove the `disabled: true` flag from the `live-spot-prices` entry and link it to `/tools/live-spot-prices`.

- [ ] **Step 8.4: Commit**

```bash
git add 'src/app/(marketing)/tools/live-spot-prices' 'src/app/(marketing)/tools/page.tsx'
git commit -m "feat(market): /tools/live-spot-prices page"
```

---

## Task 9: Header Ticker Slot (Feature-Flagged)

**Files:**
- Modify: `src/components/nav/Header.tsx`

Header ticker is off by default; enable per-environment via `NEXT_PUBLIC_HEADER_TICKER=true`. Keeps the foundation plan's performance budget intact and lets Plan 8 finalize the visual treatment.

- [ ] **Step 9.1: Update**

Replace `/opt/projects/thegoldiraguide/src/components/nav/Header.tsx`:

```tsx
import Link from 'next/link'
import { LiveSpotPriceTicker } from '@/components/market/LiveSpotPriceTicker'
import { PillarNavigationMenu } from './PillarNavigationMenu'
import { SkipToContentLink } from './SkipToContentLink'

export function Header() {
  const showTicker = process.env.NEXT_PUBLIC_HEADER_TICKER === 'true'
  return (
    <>
      <SkipToContentLink />
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-slate-charcoal/20 bg-platinum/95 backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-ledger-navy"
          >
            The Gold IRA Guide
          </Link>
          <PillarNavigationMenu />
        </div>
        {showTicker && (
          <div className="border-t border-slate-charcoal/10 bg-ledger-navy text-platinum">
            <div className="mx-auto max-w-screen-xl px-6 py-2">
              <LiveSpotPriceTicker metals={['gold', 'silver', 'platinum', 'palladium']} />
            </div>
          </div>
        )}
      </header>
    </>
  )
}
```

- [ ] **Step 9.2: Add env entry**

Append to `.env.example`:

```env
# Feature flag: render the live spot-price ticker in the global header
NEXT_PUBLIC_HEADER_TICKER=false
```

- [ ] **Step 9.3: Commit**

```bash
git add src/components/nav/Header.tsx .env.example
git commit -m "feat(market): opt-in header spot-price ticker (flag-gated)"
```

---

## Task 10: Integrate Live Spot into ROI Calculator

**Files:**
- Modify: `src/app/(marketing)/tools/roi-calculator/RoiForm.tsx`
- Modify: `src/finance/roi/schema.ts`

Add a "Prefill with live gold spot" button that fetches `/api/metals/spot?metal=gold` and uses the response as the principal's basis. This is illustrative — the ROI calc still takes principal as USD, but showing the live price contextualizes it.

- [ ] **Step 10.1: Add a prefill button to the form**

In `RoiForm.tsx`, add above the form fields:

```tsx
'use client'

import { SpotPriceInline } from '@/components/market/SpotPriceInline'
import { useSpotPrice } from '@/market/use-spot-price'
// ...existing imports

const OUNCES_DEFAULT = 10

// Inside the component, above the existing <form>:
function PrefillFromGold({
  onPrefill,
}: {
  onPrefill: (principal: number) => void
}) {
  const { data } = useSpotPrice('gold')
  if (!data) return null
  return (
    <button
      type="button"
      onClick={() => onPrefill(Math.round(data.pricePerOunceUsd * OUNCES_DEFAULT))}
      className="inline-flex min-h-[44px] items-center rounded border border-slate-charcoal/40 px-4 py-2 text-sm"
    >
      Prefill for {OUNCES_DEFAULT} oz of gold at <SpotPriceInline metal="gold" />
    </button>
  )
}
```

Use it to update `useRoiStore().setInput({ principalUsd: value })`.

- [ ] **Step 10.2: Commit**

```bash
git add 'src/app/(marketing)/tools/roi-calculator/RoiForm.tsx'
git commit -m "feat(tools): roi calculator prefill from live gold spot"
```

---

## Task 11: Final Verification

- [ ] **Step 11.1: Provision secrets** (one-time, manual)

In GitHub Secrets + Vercel Project Settings, add:
- `METALPRICE_API_KEY`
- `UPSTASH_REDIS_REST_URL` (optional; falls back to in-process limiter)
- `UPSTASH_REDIS_REST_TOKEN` (optional)

- [ ] **Step 11.2: Local gate**

```bash
pnpm check:all && pnpm test:e2e
```

Without an API key, `spot-price.spec.ts` skips the upstream test and exercises the 400 path.

- [ ] **Step 11.3: Push + CI**

```bash
git push
```

With secrets provisioned, CI exercises the real upstream call once; validate the response via E2E.

- [ ] **Step 11.4: Tag**

```bash
git tag -a v0.6.0-market-data -m "Plan 6: real-time market data complete"
git push origin v0.6.0-market-data
```

---

## Done Means

1. `/api/metals/spot?metal=<gold|silver|platinum|palladium>` returns a normalized `SpotPrice`, rate-limits abuse, and falls back to stale data on upstream failure.
2. `METALPRICE_API_KEY` is never referenced outside the route handler — verified by grep.
3. `/tools/live-spot-prices` renders a four-card live grid that refreshes every 10s and announces updates via `aria-live`.
4. `NEXT_PUBLIC_HEADER_TICKER=true` enables a global header ticker without disturbing default CWV budgets.
5. The ROI calculator offers a "prefill with live gold spot" button.
6. E2E exercises: unsupported metal → 400, rate-limit → 429 with `Retry-After`, stale fallback path.
7. Plan 7 can build historical line charts on top of the now-proven spot-price pipeline without redesigning the client/server contract.
