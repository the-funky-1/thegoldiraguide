'use client'

import type { ComparisonFilters as Filters } from '@/finance/comparison/schema'
import { useComparisonStore } from '@/tools/comparison/store'

export function ComparisonFilters() {
  const { filters, setFilters, reset } = useComparisonStore()
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 md:grid-cols-3"
    >
      <label className="block text-sm">
        Minimum investment (USD)
        <input
          type="number"
          min={0}
          step={1000}
          value={filters.minBudgetUsd}
          onChange={(e) =>
            setFilters({ minBudgetUsd: Number(e.target.value) })
          }
          className="mt-1 block min-h-[44px] w-full rounded border border-slate-charcoal/40 p-2"
        />
      </label>
      <label className="block text-sm">
        Storage model
        <select
          value={filters.storageModel}
          onChange={(e) =>
            setFilters({
              storageModel: e.target.value as Filters['storageModel'],
            })
          }
          className="mt-1 block min-h-[44px] w-full rounded border border-slate-charcoal/40 p-2"
        >
          <option value="any">Any</option>
          <option value="flat">Flat-rate</option>
          <option value="scaling">Scaling %</option>
        </select>
      </label>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-[44px] items-center self-end rounded border border-slate-charcoal/40 px-4 py-2 text-sm"
      >
        Reset filters
      </button>
    </form>
  )
}
