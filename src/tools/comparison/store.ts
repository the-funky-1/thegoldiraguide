import { create } from 'zustand'
import type { ComparisonFilters } from '@/finance/comparison/schema'

const DEFAULTS: ComparisonFilters = {
  minBudgetUsd: 0,
  storageModel: 'any',
  noMandatorySalesCall: false,
  sortBy: 'typicalPurchaseSpreadPercent',
  sortDir: 'asc',
}

type Store = {
  filters: ComparisonFilters
  setFilters: (patch: Partial<ComparisonFilters>) => void
  reset: () => void
}

export const useComparisonStore = create<Store>((set) => ({
  filters: DEFAULTS,
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  reset: () => set({ filters: DEFAULTS }),
}))
