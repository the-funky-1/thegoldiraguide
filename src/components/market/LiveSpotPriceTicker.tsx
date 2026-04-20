'use client'

import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import type { MetalKey } from '@/market/schema'

function ChangeIndicator({ change }: { change: number }) {
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '■'
  const sign = change > 0 ? '+' : change < 0 ? '−' : ''
  return (
    <span
      className={
        change > 0
          ? 'text-green-700'
          : change < 0
            ? 'text-red-700'
            : 'text-slate-charcoal'
      }
      aria-label={`24 hour change ${sign}${Math.abs(change).toFixed(1)} percent`}
    >
      {arrow} {Math.abs(change).toFixed(1)}%
    </span>
  )
}

function Row({ metal }: { metal: MetalKey }) {
  const { data, error, isLoading, stale } = useSpotPrice(metal)
  if (isLoading) {
    return (
      <span className="text-sm text-slate-charcoal">
        Loading {metal}…
      </span>
    )
  }
  if (error || !data) {
    return <span className="text-sm text-red-700">{metal} unavailable</span>
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="font-semibold capitalize">{metal}</span>
      <span className="font-mono">{formatUsd(data.pricePerOunceUsd)}</span>
      <ChangeIndicator change={data.change24hPercent} />
      {stale && <span className="text-xs text-slate-charcoal">(cached)</span>}
    </span>
  )
}

export function LiveSpotPriceTicker({ metals }: { metals: MetalKey[] }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-wrap gap-x-6 gap-y-2"
    >
      {metals.map((m) => (
        <Row key={m} metal={m} />
      ))}
    </div>
  )
}
