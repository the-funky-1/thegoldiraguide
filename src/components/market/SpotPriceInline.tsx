'use client'

import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import type { MetalKey } from '@/market/schema'

export function SpotPriceInline({ metal }: { metal: MetalKey }) {
  const { data, isLoading, error, stale } = useSpotPrice(metal)
  if (isLoading) return <span>…</span>
  if (error || !data) return <span className="text-red-700">n/a</span>
  return (
    <span className="font-mono">
      {formatUsd(data.pricePerOunceUsd)}
      {stale && (
        <span className="ml-1 text-xs text-slate-charcoal">(cached)</span>
      )}
    </span>
  )
}
