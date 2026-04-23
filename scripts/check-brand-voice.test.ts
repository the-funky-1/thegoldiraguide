import { describe, expect, it } from 'vitest'
import { findBrandVoiceViolations } from './check-brand-voice'

describe('findBrandVoiceViolations', () => {
  it('flags banned urgency and fear-based language', () => {
    const result = findBrandVoiceViolations(
      'src/app/page.tsx',
      'const copy = "Act now to avoid hidden fees"',
    )
    expect(result).toEqual([
      { file: 'src/app/page.tsx', line: 1, phrase: 'act now' },
      { file: 'src/app/page.tsx', line: 1, phrase: 'hidden fees' },
    ])
  })

  it('allows accountability-standard content to define the contrast explicitly', () => {
    const result = findBrandVoiceViolations(
      'src/content/strategic/about/accountability-standard.ts',
      'Every precious metals firm advertises itself as transparent.',
    )
    expect(result).toEqual([])
  })

  it('flags "binding written estimate" outside /about/ content', () => {
    const violations = findBrandVoiceViolations(
      'src/components/compliance/DisclosureBanner.tsx',
      'every cost is documented in a binding written estimate before a client commits capital.',
    )
    expect(violations.map((v) => v.phrase)).toContain(
      'binding written estimate',
    )
  })

  it('flags "institutional standard" outside /about/ content', () => {
    const violations = findBrandVoiceViolations(
      'src/app/(marketing)/page.tsx',
      'Our institutional standard is accountability.',
    )
    expect(violations.map((v) => v.phrase)).toContain('institutional standard')
  })

  it('allows LGS-ownership phrases inside src/content/strategic/about/ (any file)', () => {
    const violations = findBrandVoiceViolations(
      'src/content/strategic/about/ftc-disclosures.ts',
      'The Gold IRA Guide is owned and operated by Liberty Gold Silver; binding written estimate applies on the dealer desk.',
    )
    expect(violations).toEqual([])
  })

  it('still flags the existing hyperbole phrases (regression)', () => {
    const violations = findBrandVoiceViolations(
      'src/app/(marketing)/page.tsx',
      'Gold is a safe haven with guaranteed returns.',
    )
    expect(violations.map((v) => v.phrase)).toEqual(
      expect.arrayContaining(['safe haven', 'guaranteed returns']),
    )
  })
})
