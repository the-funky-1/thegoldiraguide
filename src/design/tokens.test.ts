import { describe, expect, it } from 'vitest'
import { contrastRatio, passesAaa } from './contrast'
import { BRAND_COLORS, SPACING, TYPOGRAPHY } from './tokens'

describe('BRAND_COLORS', () => {
  it('exposes the canonical semantic slots', () => {
    for (const key of [
      'brandNavy',
      'brandSlate',
      'brandPlatinum',
      'brandGold',
      'brandTeal',
    ]) {
      expect(BRAND_COLORS).toHaveProperty(key)
    }
  })

  it('navy text on platinum passes WCAG 2.2 AAA for body copy', () => {
    const r = contrastRatio(BRAND_COLORS.brandNavy, BRAND_COLORS.brandPlatinum)
    expect(passesAaa(r, 'normal')).toBe(true)
  })

  it('platinum text on navy passes AAA — used for dark footers/ticker', () => {
    const r = contrastRatio(BRAND_COLORS.brandPlatinum, BRAND_COLORS.brandNavy)
    expect(passesAaa(r, 'normal')).toBe(true)
  })
})

describe('TYPOGRAPHY', () => {
  it('body font-size >= 16px — WCAG 2.2 readable minimum', () => {
    // Token is in rem; convert assuming the browser default of 1rem = 16px.
    const sizeRem = parseFloat(TYPOGRAPHY.body.fontSize)
    expect(sizeRem * 16).toBeGreaterThanOrEqual(16)
  })
  it('every heading has an explicit line-height', () => {
    for (const slot of ['h1', 'h2', 'h3', 'body', 'caption']) {
      expect((TYPOGRAPHY as never)[slot]).toHaveProperty('lineHeight')
    }
  })
})

describe('SPACING', () => {
  it('minimum touch target = 44px (WCAG 2.5.8 recommended)', () => {
    expect(SPACING.touchTarget).toBe('44px')
  })
})
