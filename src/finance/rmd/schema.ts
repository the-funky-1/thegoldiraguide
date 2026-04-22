import { z } from 'zod'

export const rmdInputSchema = z.object({
  birthYear: z.coerce.number().int().min(1900).max(2100),
  distributionYear: z.coerce.number().int().min(2026).max(2100),
  priorYearEndBalanceUsd: z.coerce.number().min(0).max(100_000_000),
})

export type RmdInput = z.infer<typeof rmdInputSchema>

export const RMD_DEFAULTS: RmdInput = {
  birthYear: 1953,
  distributionYear: 2026,
  priorYearEndBalanceUsd: 100_000,
}
