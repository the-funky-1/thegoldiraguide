'use client'

import { domainFromUrl } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
import type { ComparisonFilters, DealerRow } from '@/finance/comparison/schema'
import { applyFilters } from '@/finance/comparison/sort-filter'
import { useComparisonStore } from '@/tools/comparison/store'

type SortableKey = ComparisonFilters['sortBy']

const headers: { key: SortableKey; label: string }[] = [
  { key: 'dealerName', label: 'Dealer' },
  { key: 'setupFeeUsd', label: 'Setup $' },
  { key: 'annualAdminFeeUsd', label: 'Admin $/yr' },
  { key: 'typicalPurchaseSpreadPercent', label: 'Purchase spread %' },
]

function useSort(key: SortableKey) {
  const { filters, setFilters } = useComparisonStore()
  return () => {
    const sortDir =
      filters.sortBy === key
        ? filters.sortDir === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc'

    trackAnalyticsEvent(analyticsEvents.comparisonSortChanged, {
      sort_by: key,
      sort_dir: sortDir,
      tool_id: analyticsToolIds.writtenEstimateChecklist,
    })

    if (filters.sortBy === key) {
      setFilters({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })
    } else {
      setFilters({ sortBy: key, sortDir: 'asc' })
    }
  }
}

export function ComparisonTable({ dealers }: { dealers: DealerRow[] }) {
  const { filters } = useComparisonStore()
  const rows = applyFilters(dealers, filters)
  return (
    <table className="w-full text-sm">
      <caption className="text-left font-semibold">
        Dealer comparison matrix
      </caption>
      <thead>
        <tr className="border-b">
          {headers.map((h) => (
            <SortableHeader key={h.key} headerKey={h.key} label={h.label} />
          ))}
          <th className="p-2 text-left">Mandatory sales call</th>
          <th className="p-2 text-left">Source</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.slug} className="border-b">
            <td className="p-2">{r.dealerName}</td>
            <td className="p-2">${r.setupFeeUsd}</td>
            <td className="p-2">${r.annualAdminFeeUsd}</td>
            <td className="p-2">{r.typicalPurchaseSpreadPercent}%</td>
            <td className="p-2">{r.mandatorySalesCall ? 'Yes' : 'No'}</td>
            <td className="p-2">
              {r.sourceUrl ? (
                <a
                  href={r.sourceUrl}
                  rel="noopener external"
                  onClick={() =>
                    trackAnalyticsEvent(analyticsEvents.dealerSourceClicked, {
                      dealer_slug: r.slug,
                      mandatory_sales_call: r.mandatorySalesCall,
                      source_domain: domainFromUrl(r.sourceUrl),
                      tool_id: analyticsToolIds.writtenEstimateChecklist,
                    })
                  }
                  className="underline"
                >
                  verified
                </a>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SortableHeader({
  headerKey,
  label,
}: {
  headerKey: SortableKey
  label: string
}) {
  const { filters } = useComparisonStore()
  const onClick = useSort(headerKey)
  const isActive = filters.sortBy === headerKey
  const arrow = isActive ? (filters.sortDir === 'asc' ? ' ▲' : ' ▼') : ''
  return (
    <th
      scope="col"
      aria-sort={
        isActive
          ? filters.sortDir === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className="p-2 text-left"
    >
      <button
        type="button"
        onClick={onClick}
        className="font-semibold underline-offset-2 hover:underline"
      >
        {label}
        {arrow}
      </button>
    </th>
  )
}
