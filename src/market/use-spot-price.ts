'use client'

import useSWR from 'swr'
import type { MetalKey, SpotPrice } from './schema'

async function fetcher(url: string): Promise<SpotPrice> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<SpotPrice>
}

export function useSpotPrice(metal: MetalKey) {
  const { data, error, isLoading } = useSWR<SpotPrice>(
    `/api/metals/spot?metal=${metal}`,
    fetcher,
    { refreshInterval: 10_000, revalidateOnFocus: false },
  )

  return {
    data,
    error,
    isLoading,
    stale: data?.stale ?? false,
  }
}
