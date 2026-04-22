'use client'

import { bucketUsdAmount } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
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
          onChange={(e) => setFilters({ minBudgetUsd: Number(e.target.value) })}
          onBlur={(e) =>
            trackAnalyticsEvent(analyticsEvents.comparisonFilterChanged, {
              filter_key: 'min_budget_usd',
              tool_id: analyticsToolIds.writtenEstimateChecklist,
              value_bucket: bucketUsdAmount(Number(e.currentTarget.value)),
            })
          }
          className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
        />
      </label>
      <label className="block text-sm">
        Storage model
        <select
          value={filters.storageModel}
          onChange={(e) => {
            const storageModel = e.target.value as Filters['storageModel']
            setFilters({
              storageModel,
            })
            trackAnalyticsEvent(analyticsEvents.comparisonFilterChanged, {
              filter_key: 'storage_model',
              filter_value: storageModel,
              tool_id: analyticsToolIds.writtenEstimateChecklist,
            })
          }}
          className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
        >
          <option value="any">Any</option>
          <option value="flat">Flat-rate</option>
          <option value="scaling">Scaling %</option>
        </select>
      </label>
      <button
        type="button"
        onClick={() => {
          trackAnalyticsEvent(analyticsEvents.toolReset, {
            tool_id: analyticsToolIds.writtenEstimateChecklist,
          })
          reset()
        }}
        className="inline-flex min-h-touch items-center self-end rounded border border-brand-slate/40 px-4 py-2 text-sm"
      >
        Reset filters
      </button>
    </form>
  )
}
