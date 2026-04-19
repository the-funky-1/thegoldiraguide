import { describe, expect, it } from 'vitest'
import { applyFilters, type DealerRow } from './sort-filter'

const rows: DealerRow[] = [
  {
    slug: 'a',
    dealerName: 'AlphaGold',
    setupFeeUsd: 50,
    annualAdminFeeUsd: 100,
    storageModel: 'flat',
    storageFlatFeeUsd: 125,
    typicalPurchaseSpreadPercent: 4,
    typicalLiquidationSpreadPercent: 1,
    minimumInvestmentUsd: 10_000,
    mandatorySalesCall: false,
    dataVerifiedAt: '2026-04-01',
  },
  {
    slug: 'b',
    dealerName: 'BetaMetals',
    setupFeeUsd: 0,
    annualAdminFeeUsd: 150,
    storageModel: 'scaling',
    storageScalingPercent: 0.75,
    typicalPurchaseSpreadPercent: 12,
    typicalLiquidationSpreadPercent: 2,
    minimumInvestmentUsd: 50_000,
    mandatorySalesCall: true,
    dataVerifiedAt: '2026-04-01',
  },
]

describe('applyFilters', () => {
  it('filters by minimum budget — drops dealers with higher minimums', () => {
    const r = applyFilters(rows, {
      minBudgetUsd: 20_000,
      storageModel: 'any',
      noMandatorySalesCall: false,
      sortBy: 'dealerName',
      sortDir: 'asc',
    })
    expect(r.map((d) => d.slug)).toEqual(['a'])
  })

  it('filters by storage model', () => {
    const r = applyFilters(rows, {
      minBudgetUsd: 0,
      storageModel: 'flat',
      noMandatorySalesCall: false,
      sortBy: 'dealerName',
      sortDir: 'asc',
    })
    expect(r.map((d) => d.slug)).toEqual(['a'])
  })

  it('filters out mandatory-sales-call dealers when requested', () => {
    const r = applyFilters(rows, {
      minBudgetUsd: 0,
      storageModel: 'any',
      noMandatorySalesCall: true,
      sortBy: 'dealerName',
      sortDir: 'asc',
    })
    expect(r.map((d) => d.slug)).toEqual(['a'])
  })

  it('sorts by typicalPurchaseSpreadPercent ascending by default', () => {
    const r = applyFilters(rows, {
      minBudgetUsd: 0,
      storageModel: 'any',
      noMandatorySalesCall: false,
      sortBy: 'typicalPurchaseSpreadPercent',
      sortDir: 'asc',
    })
    expect(r.map((d) => d.slug)).toEqual(['a', 'b'])
  })

  it('sorts descending when requested', () => {
    const r = applyFilters(rows, {
      minBudgetUsd: 0,
      storageModel: 'any',
      noMandatorySalesCall: false,
      sortBy: 'typicalPurchaseSpreadPercent',
      sortDir: 'desc',
    })
    expect(r.map((d) => d.slug)).toEqual(['b', 'a'])
  })
})
