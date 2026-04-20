'use client'

import { formatUsd } from '@/finance/decimal'
import { useSpotPrice } from '@/market/use-spot-price'
import { METAL_KEYS, type MetalKey } from '@/market/schema'

function Card({ metal }: { metal: MetalKey }) {
  const { data, error, isLoading, stale } = useSpotPrice(metal)
  return (
    <article className="rounded border border-slate-charcoal/20 bg-white p-6">
      <h2 className="font-serif text-xl capitalize">{metal}</h2>
      <p className="mt-4 font-serif text-3xl font-bold">
        {isLoading
          ? '…'
          : error || !data
            ? 'n/a'
            : formatUsd(data.pricePerOunceUsd)}
      </p>
      {data && (
        <p className="mt-2 text-sm text-slate-charcoal">
          24h change:{' '}
          <span
            className={
              data.change24hPercent >= 0 ? 'text-green-700' : 'text-red-700'
            }
          >
            {data.change24hPercent > 0 ? '+' : ''}
            {data.change24hPercent.toFixed(2)}%
          </span>
        </p>
      )}
      {data && (
        <p className="mt-1 text-xs text-slate-charcoal">
          As of {new Date(data.asOf).toLocaleString()}
          {stale && ' (cached)'}
        </p>
      )}
    </article>
  )
}

export function LiveSpotGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {METAL_KEYS.map((m) => (
        <Card key={m} metal={m} />
      ))}
    </div>
  )
}
