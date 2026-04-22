import type Decimal from 'decimal.js'
import { D } from '../decimal'
import type { SpreadMarkupInput } from './schema'

export type SpreadMarkupResult = {
  totalOunces: Decimal
  intrinsicUnitValueUsd: Decimal
  intrinsicTotalValueUsd: Decimal
  quotedSubtotalUsd: Decimal
  quotedTotalUsd: Decimal
  markupUsd: Decimal
  markupPerOunceUsd: Decimal
  markupPercent: Decimal
}

export function computeSpreadMarkup(
  input: SpreadMarkupInput,
): SpreadMarkupResult {
  const spot = D(input.spotPricePerOunceUsd)
  const ounces = D(input.productOunces)
  const quantity = D(input.quantity)
  const quotedUnit = D(input.quotedUnitPriceUsd)
  const fixedFee = D(input.fixedDealerFeeUsd)

  const totalOunces = ounces.times(quantity)
  const intrinsicUnit = spot.times(ounces)
  const intrinsicTotal = intrinsicUnit.times(quantity)
  const quotedSubtotal = quotedUnit.times(quantity)
  const quotedTotal = quotedSubtotal.plus(fixedFee)
  const markup = quotedTotal.minus(intrinsicTotal)
  const markupPerOunce = totalOunces.greaterThan(0)
    ? markup.dividedBy(totalOunces)
    : D(0)
  const markupPercent = intrinsicTotal.greaterThan(0)
    ? markup.dividedBy(intrinsicTotal).times(100)
    : D(0)

  return {
    totalOunces,
    intrinsicUnitValueUsd: intrinsicUnit,
    intrinsicTotalValueUsd: intrinsicTotal,
    quotedSubtotalUsd: quotedSubtotal,
    quotedTotalUsd: quotedTotal,
    markupUsd: markup,
    markupPerOunceUsd: markupPerOunce,
    markupPercent,
  }
}
