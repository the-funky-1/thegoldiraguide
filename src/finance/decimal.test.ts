import Decimal from 'decimal.js'
import { describe, expect, it } from 'vitest'
import { D, formatPercent, formatUsd, safeParseUsd } from './decimal'

describe('D', () => {
  it('coerces numbers and strings to Decimal', () => {
    expect(D(1.1).plus(D(2.2)).equals(new Decimal('3.3'))).toBe(true)
    expect(D('100.50').times(D('0.1')).toFixed(2)).toBe('10.05')
  })
})

describe('formatUsd', () => {
  it('formats with US locale and dollar sign', () => {
    expect(formatUsd(D('1234.5'))).toBe('$1,234.50')
  })
  it('handles negative values', () => {
    expect(formatUsd(D('-100'))).toBe('-$100.00')
  })
})

describe('formatPercent', () => {
  it('renders a decimal as a percent with one fractional digit', () => {
    expect(formatPercent(D('0.0175'))).toBe('1.8%')
  })
  it('accepts a fractionDigits override', () => {
    expect(formatPercent(D('0.0175'), 2)).toBe('1.75%')
  })
})

describe('safeParseUsd', () => {
  it('returns a Decimal for a valid number string', () => {
    const result = safeParseUsd('$1,234.56')
    expect(result?.toFixed(2)).toBe('1234.56')
  })
  it('returns null for garbage input', () => {
    expect(safeParseUsd('abc')).toBeNull()
  })
})
