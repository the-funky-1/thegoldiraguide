import type { ComparisonFilters, DealerRow } from './schema'
export type { DealerRow } from './schema'

export function applyFilters(
  rows: DealerRow[],
  filters: ComparisonFilters,
): DealerRow[] {
  const filtered = rows.filter((row) => {
    if (
      (row.minimumInvestmentUsd ?? 0) > filters.minBudgetUsd &&
      filters.minBudgetUsd > 0
    ) {
      return false
    }
    if (
      filters.storageModel !== 'any' &&
      row.storageModel !== filters.storageModel
    ) {
      return false
    }
    if (filters.noMandatorySalesCall && row.mandatorySalesCall) return false
    return true
  })

  const factor = filters.sortDir === 'asc' ? 1 : -1
  const key = filters.sortBy

  return filtered.sort((a, b) => {
    const av = a[key] ?? 0
    const bv = b[key] ?? 0
    if (typeof av === 'string' && typeof bv === 'string') {
      return av.localeCompare(bv) * factor
    }
    return ((av as number) - (bv as number)) * factor
  })
}
