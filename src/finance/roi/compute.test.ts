import { describe, expect, it } from 'vitest'
import { D } from '../decimal'
import { computeRoi } from './compute'
import { ROI_DEFAULTS } from './schema'

describe('computeRoi', () => {
  it('deducts purchase spread up front', () => {
    const r = computeRoi({
      ...ROI_DEFAULTS,
      horizonYears: 1,
      annualAppreciationPercent: 0,
      annualFeesUsd: 0,
    })
    const expected = D(100_000).times(D(1).minus(D(0.04)))
    expect(r.netStartingPositionUsd.toFixed(2)).toBe(expected.toFixed(2))
  })

  it('liquidation spread fires at the end', () => {
    const r = computeRoi({
      principalUsd: 100_000,
      horizonYears: 1,
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

  it('one-year horizon with no appreciation yields spread-only loss', () => {
    const r = computeRoi({
      principalUsd: 100_000,
      horizonYears: 1,
      annualAppreciationPercent: 0,
      purchaseSpreadPercent: 4,
      liquidationSpreadPercent: 1,
      annualFeesUsd: 0,
    })
    const expected = D(100_000).times(D(0.96)).times(D(0.99))
    expect(r.netTerminalValueUsd.toFixed(2)).toBe(expected.toFixed(2))
  })
})
