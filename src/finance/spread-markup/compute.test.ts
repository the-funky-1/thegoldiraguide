import { describe, expect, it } from 'vitest'
import { computeSpreadMarkup } from './compute'

describe('computeSpreadMarkup', () => {
  it('calculates intrinsic value and markup', () => {
    const result = computeSpreadMarkup({
      metal: 'gold',
      spotPricePerOunceUsd: 2500,
      productOunces: 1,
      quantity: 10,
      quotedUnitPriceUsd: 2650,
      fixedDealerFeeUsd: 0,
    })

    expect(result.intrinsicTotalValueUsd.toFixed(2)).toBe('25000.00')
    expect(result.quotedTotalUsd.toFixed(2)).toBe('26500.00')
    expect(result.markupUsd.toFixed(2)).toBe('1500.00')
    expect(result.markupPercent.toFixed(2)).toBe('6.00')
  })

  it('includes fixed dealer fees in the markup', () => {
    const result = computeSpreadMarkup({
      metal: 'silver',
      spotPricePerOunceUsd: 30,
      productOunces: 10,
      quantity: 2,
      quotedUnitPriceUsd: 320,
      fixedDealerFeeUsd: 50,
    })

    expect(result.totalOunces.toFixed(2)).toBe('20.00')
    expect(result.markupUsd.toFixed(2)).toBe('90.00')
    expect(result.markupPerOunceUsd.toFixed(2)).toBe('4.50')
  })
})
