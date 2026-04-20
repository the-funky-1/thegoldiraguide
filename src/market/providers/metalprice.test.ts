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
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify(validPayload), { status: 200 }),
    )
    const r = await fetchSpotFromMetalprice('gold', {
      apiKey: 'abc',
      fetcher: fetchMock,
    })
    expect(r.pricePerOunceUsd).toBe(2545)
    expect(String(fetchMock.mock.calls[0][0])).toContain('api_key=abc')
  })

  it('throws a typed error on non-200 responses', async () => {
    const fetchMock = vi.fn(
      async () => new Response('fail', { status: 429 }),
    )
    await expect(
      fetchSpotFromMetalprice('gold', { apiKey: 'abc', fetcher: fetchMock }),
    ).rejects.toThrow(/429/)
  })

  it('throws when upstream.success is false', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ success: false, error: { info: 'nope' } }),
          { status: 200 },
        ),
    )
    await expect(
      fetchSpotFromMetalprice('gold', { apiKey: 'abc', fetcher: fetchMock }),
    ).rejects.toThrow(/upstream/i)
  })
})
