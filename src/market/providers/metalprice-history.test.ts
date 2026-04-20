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
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify(payload), { status: 200 }),
    )
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
