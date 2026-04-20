import { z } from 'zod'

export const METAL_KEYS = ['gold', 'silver', 'platinum', 'palladium'] as const
export type MetalKey = (typeof METAL_KEYS)[number]

export const spotPriceSchema = z.object({
  metal: z.enum(METAL_KEYS),
  pricePerOunceUsd: z.number().positive(),
  change24hPercent: z.number(),
  asOf: z.string(),
  source: z.string(),
  stale: z.boolean(),
})
export type SpotPrice = z.infer<typeof spotPriceSchema>

export function isMetalKey(value: unknown): value is MetalKey {
  return (
    typeof value === 'string' &&
    (METAL_KEYS as readonly string[]).includes(value)
  )
}
