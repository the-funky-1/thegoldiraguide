import { describe, expect, it } from 'vitest'
import {
  computeRmd,
  divisorForAge,
  requiredBeginningAgeForBirthYear,
} from './compute'

describe('requiredBeginningAgeForBirthYear', () => {
  it('uses SECURE 2.0 birth-year thresholds', () => {
    expect(requiredBeginningAgeForBirthYear(1950)).toBe(72)
    expect(requiredBeginningAgeForBirthYear(1959)).toBe(73)
    expect(requiredBeginningAgeForBirthYear(1960)).toBe(75)
  })
})

describe('divisorForAge', () => {
  it('returns IRS Uniform Lifetime Table divisors', () => {
    expect(divisorForAge(73)?.toFixed(1)).toBe('26.5')
    expect(divisorForAge(120)?.toFixed(1)).toBe('2.0')
    expect(divisorForAge(121)?.toFixed(1)).toBe('2.0')
  })
})

describe('computeRmd', () => {
  it('divides prior year-end balance by the age divisor when required', () => {
    const result = computeRmd({
      birthYear: 1953,
      distributionYear: 2026,
      priorYearEndBalanceUsd: 100_000,
    })

    expect(result.ageAtYearEnd).toBe(73)
    expect(result.rmdRequired).toBe(true)
    expect(result.estimatedRmdUsd.toFixed(2)).toBe('3773.58')
  })

  it('returns zero when the account owner has not reached RMD age', () => {
    const result = computeRmd({
      birthYear: 1962,
      distributionYear: 2030,
      priorYearEndBalanceUsd: 100_000,
    })

    expect(result.ageAtYearEnd).toBe(68)
    expect(result.rmdRequired).toBe(false)
    expect(result.estimatedRmdUsd.toFixed(2)).toBe('0.00')
  })
})
