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
  const settled = METAL_KEYS.every(
    (metal) => queries[metal].data || queries[metal].error,
  )

  if (!settled) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-brand-slate"
      >
        Loading 30-day history…
      </p>
    )
  }

  const series = METAL_KEYS.map((metal) => ({
    metal,
    data: queries[metal].data,
  }))
    .filter(
      (s): s is { metal: MetalKey; data: HistoryResponse } =>
        s.data !== undefined,
    )
    .map(({ metal, data }) => ({
      id: metal,
      label: metal.charAt(0).toUpperCase() + metal.slice(1),
      points: data.points,
    }))

  if (series.length === 0) {
    return (
      <p
        role="status"
        data-testid="history-unavailable"
        className="rounded border border-brand-slate/20 bg-white p-4 text-sm text-brand-slate"
      >
        30-day history is temporarily unavailable. Please try again shortly.
      </p>
    )
  }

  return (
    <TimeSeriesLineChart
      title="30-day spot price history"
      description="Closing USD per troy ounce for the four IRA-eligible metals."
      series={series}
      formatValue={(n) => formatUsd(n)}
    />
  )
}
