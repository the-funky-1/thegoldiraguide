import { z } from 'zod'

export const feeDragInputSchema = z.object({
  startingBalanceUsd: z.coerce.number().min(1000).max(10_000_000),
  horizonYears: z.coerce.number().int().min(1).max(50),
  annualReturnPercent: z.coerce.number().min(-10).max(20),
  oneTimeSetupFeeUsd: z.coerce.number().min(0).max(10_000),

  flatAnnualAdminFeeUsd: z.coerce.number().min(0).max(10_000),
  flatAnnualStorageFeeUsd: z.coerce.number().min(0).max(10_000),

  scalingAnnualAdminFeeUsd: z.coerce.number().min(0).max(10_000),
  scalingAnnualStoragePercent: z.coerce.number().min(0).max(5),
})

export type FeeDragInput = z.infer<typeof feeDragInputSchema>

export const FEE_DRAG_DEFAULTS: FeeDragInput = {
  startingBalanceUsd: 100_000,
  horizonYears: 20,
  annualReturnPercent: 6,
  oneTimeSetupFeeUsd: 75,
  flatAnnualAdminFeeUsd: 100,
  flatAnnualStorageFeeUsd: 125,
  scalingAnnualAdminFeeUsd: 125,
  scalingAnnualStoragePercent: 0.75,
}
