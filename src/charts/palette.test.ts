import { describe, expect, it } from 'vitest'
import {
  CHART_PALETTE,
  PATTERN_IDS,
  chartSeriesColor,
  chartSeriesPatternId,
} from './palette'

describe('CHART_PALETTE', () => {
  it('has at least 6 distinct hex colors', () => {
    expect(CHART_PALETTE.length).toBeGreaterThanOrEqual(6)
    const unique = new Set(CHART_PALETTE)
    expect(unique.size).toBe(CHART_PALETTE.length)
    for (const c of CHART_PALETTE) expect(c).toMatch(/^#[0-9a-f]{6}$/i)
  })
  it('provides a pattern ID per palette slot', () => {
    expect(PATTERN_IDS.length).toBe(CHART_PALETTE.length)
    for (const id of PATTERN_IDS) expect(id).toMatch(/^chart-pattern-\d+$/)
  })
})

describe('chartSeriesColor', () => {
  it('wraps around the palette so index > length still returns a valid hex', () => {
    expect(chartSeriesColor(0)).toBe(CHART_PALETTE[0])
    expect(chartSeriesColor(CHART_PALETTE.length)).toBe(CHART_PALETTE[0])
  })
})

describe('chartSeriesPatternId', () => {
  it('returns the pattern id matching the color index', () => {
    expect(chartSeriesPatternId(1)).toBe(PATTERN_IDS[1])
  })
})
