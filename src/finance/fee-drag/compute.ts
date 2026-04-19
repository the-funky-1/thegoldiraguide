import type Decimal from 'decimal.js'
import { D } from '../decimal'
import type { FeeDragInput } from './schema'

export type FeeDragYearRow = {
  year: number
  flatBalance: Decimal
  flatFeePaid: Decimal
  scalingBalance: Decimal
  scalingFeePaid: Decimal
}

export type FeeDragResult = {
  years: FeeDragYearRow[]
  totals: {
    flatEndBalance: Decimal
    scalingEndBalance: Decimal
    flatTotalFeesPaid: Decimal
    scalingTotalFeesPaid: Decimal
    flatAdvantageUsd: Decimal
  }
}

export function computeFeeDrag(input: FeeDragInput): FeeDragResult {
  const r = D(input.annualReturnPercent).dividedBy(100)
  const oneTime = D(input.oneTimeSetupFeeUsd)
  const flatAnnual = D(input.flatAnnualAdminFeeUsd).plus(
    input.flatAnnualStorageFeeUsd,
  )
  const scalingAdmin = D(input.scalingAnnualAdminFeeUsd)
  const scalingRate = D(input.scalingAnnualStoragePercent).dividedBy(100)

  const start = D(input.startingBalanceUsd).minus(oneTime)

  const rows: FeeDragYearRow[] = [
    {
      year: 0,
      flatBalance: start,
      flatFeePaid: D(0),
      scalingBalance: start,
      scalingFeePaid: D(0),
    },
  ]

  let flat = start
  let scaling = start

  for (let year = 1; year <= input.horizonYears; year++) {
    const flatGrown = flat.times(D(1).plus(r))
    const flatFee = flatAnnual
    flat = flatGrown.minus(flatFee)

    const scalingGrown = scaling.times(D(1).plus(r))
    const scalingStorage = scalingGrown.times(scalingRate)
    const scalingFee = scalingAdmin.plus(scalingStorage)
    scaling = scalingGrown.minus(scalingFee)

    rows.push({
      year,
      flatBalance: flat,
      flatFeePaid: flatFee,
      scalingBalance: scaling,
      scalingFeePaid: scalingFee,
    })
  }

  const flatTotalFees = rows
    .slice(1)
    .reduce((acc, row) => acc.plus(row.flatFeePaid), oneTime)
  const scalingTotalFees = rows
    .slice(1)
    .reduce((acc, row) => acc.plus(row.scalingFeePaid), oneTime)

  return {
    years: rows,
    totals: {
      flatEndBalance: flat,
      scalingEndBalance: scaling,
      flatTotalFeesPaid: flatTotalFees,
      scalingTotalFeesPaid: scalingTotalFees,
      flatAdvantageUsd: flat.minus(scaling),
    },
  }
}
