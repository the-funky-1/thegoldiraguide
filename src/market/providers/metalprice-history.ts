import type { MetalKey } from '../schema'

type Opts = { apiKey: string; fetcher?: typeof fetch }

const CODE: Record<MetalKey, string> = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',
}

export type HistorySeries = {
  metal: MetalKey
  points: { x: string; y: number }[]
}

export async function fetchHistory(
  metal: MetalKey,
  startDate: string,
  endDate: string,
  { apiKey, fetcher = fetch }: Opts,
): Promise<HistorySeries> {
  const url =
    `https://api.metalpriceapi.com/v1/timeframe?api_key=${encodeURIComponent(apiKey)}` +
    `&start_date=${startDate}&end_date=${endDate}&base=USD&currencies=${CODE[metal]}`
  const res = await fetcher(url)
  if (!res.ok) throw new Error(`metalprice history upstream ${res.status}`)
  const body = (await res.json()) as {
    success?: boolean
    rates?: Record<string, Record<string, number | undefined>>
  }
  if (!body.success || !body.rates) throw new Error('metalprice history failure')

  const points = Object.entries(body.rates)
    .map(([date, values]) => {
      const y = values[`USD${CODE[metal]}`]
      return typeof y === 'number' ? { x: date, y } : null
    })
    .filter((p): p is { x: string; y: number } => p !== null)
    .sort((a, b) => a.x.localeCompare(b.x))

  return { metal, points }
}
