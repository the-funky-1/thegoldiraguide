import { normalizeMetalpriceResponse } from '../normalize'
import type { MetalKey, SpotPrice } from '../schema'

type Opts = {
  apiKey: string
  fetcher?: typeof fetch
  signal?: AbortSignal
}

export async function fetchSpotFromMetalprice(
  metal: MetalKey,
  { apiKey, fetcher = fetch, signal }: Opts,
): Promise<SpotPrice> {
  const url = `https://api.metalpriceapi.com/v1/latest?api_key=${encodeURIComponent(apiKey)}&base=USD&currencies=XAU,XAG,XPT,XPD`
  const res = await fetcher(url, {
    signal,
    headers: { accept: 'application/json' },
    next: { revalidate: 5 },
  } as RequestInit & { next?: { revalidate: number } })

  if (!res.ok) {
    throw new Error(`metalprice upstream ${res.status}`)
  }
  const body = (await res.json()) as { success?: boolean }
  if (!body.success) {
    throw new Error('metalprice upstream reported failure')
  }
  return normalizeMetalpriceResponse(metal, body)
}
