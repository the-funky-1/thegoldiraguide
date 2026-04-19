import Decimal from 'decimal.js'

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_EVEN })

export type DecimalLike = Decimal.Value

export function D(value: DecimalLike): Decimal {
  return new Decimal(value)
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatUsd(value: DecimalLike): string {
  const n = Number(D(value).toFixed(2))
  return usdFormatter.format(n)
}

export function formatPercent(value: DecimalLike, fractionDigits = 1): string {
  return `${D(value).times(100).toFixed(fractionDigits)}%`
}

export function safeParseUsd(input: string): Decimal | null {
  const cleaned = input.replace(/[\s,$]/g, '')
  if (!/^-?\d*\.?\d*$/.test(cleaned) || cleaned === '') return null
  try {
    return new Decimal(cleaned)
  } catch {
    return null
  }
}
