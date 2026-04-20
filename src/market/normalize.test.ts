import { describe, expect, it } from 'vitest'
import { normalizeMetalpriceResponse } from './normalize'

const upstream = {
  success: true,
  base: 'USD',
  timestamp: 1713500000,
  rates: {
    XAU: 0.000393,
    USDXAU: 2545.0,
  },
  'change-24h': { XAU: -0.0087 },
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
    expect(
      normalizeMetalpriceResponse('gold', withAllKeys).pricePerOunceUsd,
    ).toBe(100)
    expect(
      normalizeMetalpriceResponse('silver', withAllKeys).pricePerOunceUsd,
    ).toBe(10)
    expect(
      normalizeMetalpriceResponse('platinum', withAllKeys).pricePerOunceUsd,
    ).toBe(1000)
    expect(
      normalizeMetalpriceResponse('palladium', withAllKeys).pricePerOunceUsd,
    ).toBe(500)
  })
})
