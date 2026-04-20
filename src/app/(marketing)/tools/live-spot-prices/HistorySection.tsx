'use client'

import useSWR from 'swr'
import { TimeSeriesLineChart } from '@/components/charts/TimeSeriesLineChart'
import { formatUsd } from '@/finance/decimal'
import { METAL_KEYS, type MetalKey } from '@/market/schema'

type HistoryResponse = { metal: MetalKey; points: { x: string; y: number }[] }

async function fetcher(url: string): Promise<HistoryResponse> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function useMetalHistory(metal: MetalKey) {
  return useSWR<HistoryResponse>(
    `/api/metals/history?metal=${metal}&days=30`,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 0 },
  )
}

export function HistorySection() {
  const gold = useMetalHistory('gold')
  const silver = useMetalHistory('silver')
  const platinum = useMetalHistory('platinum')
  const palladium = useMetalHistory('palladium')

  const queries = { gold, silver, platinum, palladium } as const
  const loaded = METAL_KEYS.every((metal) => queries[metal].data)
  if (!loaded) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-slate-charcoal"
      >
        Loading 30-day history…
      </p>
    )
  }

  const series = METAL_KEYS.map((metal) => ({
    id: metal,
    label: metal.charAt(0).toUpperCase() + metal.slice(1),
    points: queries[metal].data!.points,
  }))

  return (
    <TimeSeriesLineChart
      title="30-day spot price history"
      description="Closing USD per troy ounce for the four IRA-eligible metals."
      series={series}
      formatValue={(n) => formatUsd(n)}
    />
  )
}
