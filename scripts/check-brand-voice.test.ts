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
})
