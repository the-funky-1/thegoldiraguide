import { LRUCache } from 'lru-cache'
import type { MetalKey, SpotPrice } from './schema'

const FRESH_TTL_MS = 5_000
const STALE_TTL_MS = 1000 * 60 * 60 * 24

type Entry = { value: SpotPrice; storedAt: number }

const cache = new LRUCache<MetalKey, Entry>({ max: 8 })

export async function getCachedSpot(metal: MetalKey): Promise<SpotPrice | null> {
  const entry = cache.get(metal)
  if (!entry) return null
  if (Date.now() - entry.storedAt > FRESH_TTL_MS) return null
  return entry.value
}

export async function setCachedSpot(
  metal: MetalKey,
  value: SpotPrice,
): Promise<void> {
  cache.set(metal, { value, storedAt: Date.now() })
}

export async function getStaleSpot(metal: MetalKey): Promise<SpotPrice | null> {
  const entry = cache.get(metal)
  if (!entry) return null
  if (Date.now() - entry.storedAt > STALE_TTL_MS) return null
  return { ...entry.value, stale: true }
}

export function _resetCacheForTests(): void {
  cache.clear()
}
