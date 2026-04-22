import { describe, expect, it } from 'vitest'
import {
  bucketPercent,
  bucketRatio,
  bucketToolInput,
  bucketUsdAmount,
  bucketYears,
  domainFromUrl,
} from './buckets'

describe('analytics buckets', () => {
  it('buckets dollar amounts without exposing exact values', () => {
    expect(bucketUsdAmount(0)).toBe('0')
    expect(bucketUsdAmount(999)).toBe('under_1k')
    expect(bucketUsdAmount(25_000)).toBe('10k_49k')
    expect(bucketUsdAmount(1_500_000)).toBe('1m_plus')
  })

  it('buckets durations and percentages', () => {
    expect(bucketYears(7)).toBe('6_10')
    expect(bucketPercent(-3)).toBe('negative_1_4pct')
    expect(bucketRatio(0.22)).toBe('20_34pct')
  })

  it('selects a bucket strategy from a tool field name', () => {
    expect(bucketToolInput('principalUsd', 75_000)).toBe('50k_99k')
    expect(bucketToolInput('annualAppreciationPercent', 8)).toBe('5_9pct')
    expect(bucketToolInput('horizonYears', 18)).toBe('11_20')
  })

  it('normalizes source domains', () => {
    expect(domainFromUrl('https://www.example.com/path')).toBe('example.com')
    expect(domainFromUrl('not a url')).toBe('unknown')
  })
})
