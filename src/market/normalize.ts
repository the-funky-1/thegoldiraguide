import type { MetalKey, SpotPrice } from './schema'

const CODE_BY_METAL: Record<MetalKey, 'XAU' | 'XAG' | 'XPT' | 'XPD'> = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',
}

export function normalizeMetalpriceResponse(
  metal: MetalKey,
  upstream: unknown,
): SpotPrice {
  if (!upstream || typeof upstream !== 'object') {
    throw new Error('Malformed upstream payload')
  }
  const u = upstream as {
    rates?: Record<string, number | undefined>
    'change-24h'?: Record<string, number | undefined>
    timestamp?: number
  }

  const code = CODE_BY_METAL[metal]
  const priceKey = `USD${code}` as const
  const price = u.rates?.[priceKey]
  if (typeof price !== 'number' || price <= 0) {
    throw new Error(`Missing ${priceKey} in upstream rates`)
  }

  const change = u['change-24h']?.[code] ?? 0
  const asOfMs =
    typeof u.timestamp === 'number' ? u.timestamp * 1000 : Date.now()

  return {
    metal,
    pricePerOunceUsd: price,
    change24hPercent: Number((change * 100).toFixed(4)),
    asOf: new Date(asOfMs).toISOString(),
    source: 'metalpriceapi',
    stale: false,
  }
}
