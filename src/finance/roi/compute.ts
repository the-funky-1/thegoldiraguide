import type Decimal from 'decimal.js'
import { D } from '../decimal'
import type { RoiInput } from './schema'

export type RoiResult = {
  netStartingPositionUsd: Decimal
  grossTerminalValueUsd: Decimal
  netTerminalValueUsd: Decimal
  totalFeesUsd: Decimal
  netGainUsd: Decimal
  netCagrPercent: Decimal
  trajectory: { year: number; netValue: Decimal }[]
}

export function computeRoi(input: RoiInput): RoiResult {
  const P = D(input.principalUsd)
  const r = D(input.annualAppreciationPercent).dividedBy(100)
  const fPurchase = D(input.purchaseSpreadPercent).dividedBy(100)
  const fLiquidation = D(input.liquidationSpreadPercent).dividedBy(100)
  const annualFees = D(input.annualFeesUsd)

  const netStart = P.times(D(1).minus(fPurchase))

  const trajectory: { year: number; netValue: Decimal }[] = [
    { year: 0, netValue: netStart },
  ]
  let running = netStart
  for (let y = 1; y <= input.horizonYears; y++) {
    running = running.times(D(1).plus(r)).minus(annualFees)
    trajectory.push({ year: y, netValue: running })
  }
  const grossTerminalBeforeLiquidation = running
  const netTerminal = grossTerminalBeforeLiquidation.times(
    D(1).minus(fLiquidation),
  )

  const grossTerminal = P.times(D(1).plus(r).pow(input.horizonYears))
  const totalFees = P.minus(netStart)
    .plus(annualFees.times(input.horizonYears))
    .plus(grossTerminalBeforeLiquidation.minus(netTerminal))
  const netGain = netTerminal.minus(P)

  let netCagr = D(0)
  if (input.horizonYears > 0 && netTerminal.greaterThan(0)) {
    const ratio = netTerminal.dividedBy(P)
    netCagr = ratio.pow(D(1).dividedBy(input.horizonYears)).minus(1).times(100)
  }

  return {
    netStartingPositionUsd: netStart,
    grossTerminalValueUsd: grossTerminal,
    netTerminalValueUsd: netTerminal,
    totalFeesUsd: totalFees,
    netGainUsd: netGain,
    netCagrPercent: netCagr,
    trajectory,
  }
}
