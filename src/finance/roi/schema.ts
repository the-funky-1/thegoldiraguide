import { z } from 'zod'

export const roiInputSchema = z.object({
  principalUsd: z.coerce.number().min(1000).max(10_000_000),
  horizonYears: z.coerce.number().int().min(1).max(50),
  annualAppreciationPercent: z.coerce.number().min(-10).max(20),
  purchaseSpreadPercent: z.coerce.number().min(0).max(50),
  liquidationSpreadPercent: z.coerce.number().min(0).max(50),
  annualFeesUsd: z.coerce.number().min(0).max(10_000),
})
export type RoiInput = z.infer<typeof roiInputSchema>

export const ROI_DEFAULTS: RoiInput = {
  principalUsd: 100_000,
  horizonYears: 20,
  annualAppreciationPercent: 5,
  purchaseSpreadPercent: 4,
  liquidationSpreadPercent: 1,
  annualFeesUsd: 225,
}
