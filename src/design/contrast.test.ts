import { describe, expect, it } from 'vitest'
import { contrastRatio, hexToRgb, passesAa, passesAaa } from './contrast'

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#0B1F3B')).toEqual({ r: 11, g: 31, b: 59 })
  })
  it('parses 3-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
  })
})

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBe(21)
  })
  it('is commutative', () => {
    const a = contrastRatio('#0B1F3B', '#F8FAFC')
    const b = contrastRatio('#F8FAFC', '#0B1F3B')
    expect(a).toBe(b)
  })
})

describe('passesAa and passesAaa', () => {
  it('navy on platinum passes AAA for normal text', () => {
    const r = contrastRatio('#0B1F3B', '#F8FAFC')
    expect(passesAa(r, 'normal')).toBe(true)
    expect(passesAaa(r, 'normal')).toBe(true)
  })
  it('brand-gold on platinum fails AA for normal text', () => {
    const r = contrastRatio('#D4AF37', '#F8FAFC')
    expect(passesAa(r, 'normal')).toBe(false)
  })
})
