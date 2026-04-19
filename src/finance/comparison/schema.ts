import { z } from 'zod'

export const dealerRowSchema = z.object({
  slug: z.string(),
  dealerName: z.string(),
  setupFeeUsd: z.number().min(0),
  annualAdminFeeUsd: z.number().min(0),
  storageModel: z.enum(['flat', 'scaling']),
  storageFlatFeeUsd: z.number().min(0).optional(),
  storageScalingPercent: z.number().min(0).max(5).optional(),
  typicalPurchaseSpreadPercent: z.number().min(0).max(50),
  typicalLiquidationSpreadPercent: z.number().min(0).max(50),
  minimumInvestmentUsd: z.number().min(0).optional(),
  mandatorySalesCall: z.boolean(),
  sourceUrl: z.string().url().optional(),
  dataVerifiedAt: z.string(),
})
export type DealerRow = z.infer<typeof dealerRowSchema>

export const comparisonFiltersSchema = z.object({
  minBudgetUsd: z.coerce.number().min(0).default(0),
  storageModel: z.enum(['any', 'flat', 'scaling']).default('any'),
  noMandatorySalesCall: z.coerce.boolean().default(false),
  sortBy: z
    .enum([
      'dealerName',
      'typicalPurchaseSpreadPercent',
      'setupFeeUsd',
      'annualAdminFeeUsd',
    ])
    .default('typicalPurchaseSpreadPercent'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
})
export type ComparisonFilters = z.infer<typeof comparisonFiltersSchema>
