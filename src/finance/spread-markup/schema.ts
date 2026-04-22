import { z } from 'zod'
import { METAL_KEYS } from '@/market/schema'

export const spreadMarkupInputSchema = z.object({
  metal: z.enum(METAL_KEYS),
  spotPricePerOunceUsd: z.coerce.number().min(0.01).max(100_000),
  productOunces: z.coerce.number().min(0.01).max(1_000),
  quantity: z.coerce.number().int().min(1).max(10_000),
  quotedUnitPriceUsd: z.coerce.number().min(0.01).max(10_000_000),
  fixedDealerFeeUsd: z.coerce.number().min(0).max(100_000),
})

export type SpreadMarkupInput = z.infer<typeof spreadMarkupInputSchema>

export const SPREAD_MARKUP_DEFAULTS: SpreadMarkupInput = {
  metal: 'gold',
  spotPricePerOunceUsd: 2500,
  productOunces: 1,
  quantity: 10,
  quotedUnitPriceUsd: 2650,
  fixedDealerFeeUsd: 0,
}
