'use client'

import Link from 'next/link'
import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import type { MetalKey } from '@/market/schema'

function MetalRow({ metal }: { metal: MetalKey }) {
  const { data, error, isLoading } = useSpotPrice(metal)
  const label = metal.charAt(0).toUpperCase() + metal.slice(1)

  if (isLoading) {
    return (
      <div className="flex items-baseline justify-between border-b border-brand-slate/10 py-2 last:border-b-0">
        <span className="text-sm text-brand-slate">{label}</span>
        <span className="font-mono text-sm text-brand-slate">—</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-baseline justify-between border-b border-brand-slate/10 py-2 last:border-b-0">
        <span className="text-sm text-brand-slate">{label}</span>
        <span className="font-mono text-sm text-feedback-danger">
          unavailable
        </span>
      </div>
    )
  }

  const change = data.change24hPercent
  const changeTone =
    change > 0
      ? 'text-feedback-success'
      : change < 0
        ? 'text-feedback-danger'
        : 'text-brand-slate'
  const changeSign = change > 0 ? '+' : change < 0 ? '−' : ''

  return (
    <div className="flex items-baseline justify-between border-b border-brand-slate/10 py-2 last:border-b-0">
      <span className="text-sm font-medium text-brand-navy">{label}</span>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-brand-navy">
          {formatUsd(data.pricePerOunceUsd)}
        </span>
        <span className={`font-mono text-xs ${changeTone}`}>
          {changeSign}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export function MarketPulseCard() {
  const metals: MetalKey[] = ['gold', 'silver', 'platinum']
  return (
    <aside
      aria-label="Market pulse"
      className="rounded-lg border border-brand-slate/20 bg-bg-surface p-6 shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
        Market pulse
      </p>
      <p className="mt-1 font-serif text-lg text-brand-navy">
        Spot prices, right now
      </p>
      <div className="mt-4">
        {metals.map((m) => (
          <MetalRow key={m} metal={m} />
        ))}
      </div>
      <Link
        href="/tools/live-spot-prices"
        className="mt-5 inline-block text-sm font-medium text-brand-navy underline underline-offset-2 hover:text-brand-gold"
      >
        See full dashboard →
      </Link>
    </aside>
  )
}
