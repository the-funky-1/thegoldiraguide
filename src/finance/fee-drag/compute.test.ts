import { describe, expect, it } from 'vitest'
import { D } from '../decimal'
import { computeFeeDrag } from './compute'
import { FEE_DRAG_DEFAULTS } from './schema'

describe('computeFeeDrag', () => {
  it('produces a row per year plus a starting row (horizon + 1)', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    expect(r.years).toHaveLength(FEE_DRAG_DEFAULTS.horizonYears + 1)
    expect(r.years[0]!.year).toBe(0)
    expect(r.years[FEE_DRAG_DEFAULTS.horizonYears]!.year).toBe(
      FEE_DRAG_DEFAULTS.horizonYears,
    )
  })

  it('year-0 balances equal (starting - setup) for both scenarios', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const expected = D(FEE_DRAG_DEFAULTS.startingBalanceUsd).minus(
      FEE_DRAG_DEFAULTS.oneTimeSetupFeeUsd,
    )
    expect(r.years[0]!.flatBalance.equals(expected)).toBe(true)
    expect(r.years[0]!.scalingBalance.equals(expected)).toBe(true)
  })

  it('scaling scenario drains more than flat when storage% > flat equivalent at scale', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const flatEnd = r.years.at(-1)!.flatBalance
    const scalingEnd = r.years.at(-1)!.scalingBalance
    expect(flatEnd.greaterThan(scalingEnd)).toBe(true)
  })

  it('totalFeesPaid matches the sum of yearly fees plus setup', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const scalingYearlyFees = r.years
      .slice(1)
      .reduce((acc, row) => acc.plus(row.scalingFeePaid), D(0))
    const expected = D(FEE_DRAG_DEFAULTS.oneTimeSetupFeeUsd).plus(
      scalingYearlyFees,
    )
    expect(r.totals.scalingTotalFeesPaid.toFixed(4)).toBe(expected.toFixed(4))
  })

  it('fee drag delta = flatEnd - scalingEnd (always positive in default scenario)', () => {
    const r = computeFeeDrag(FEE_DRAG_DEFAULTS)
    const expected = r.years
      .at(-1)!
      .flatBalance.minus(r.years.at(-1)!.scalingBalance)
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
