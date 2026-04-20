import { describe, expect, it } from 'vitest'
import { ArticleSeedSchema } from '../types'
import { extractPlainText, fleschKincaidGrade } from '../reading-level'
import { seed } from './promotional-offers'

describe('accountability/promotional-offers', () => {
  it('parses under ArticleSeedSchema', () => {
    expect(() => ArticleSeedSchema.parse(seed)).not.toThrow()
  })

  it('reads at 6.5–8.5 grade level', () => {
    const grade = fleschKincaidGrade(extractPlainText(seed.body))
    expect(grade).toBeGreaterThanOrEqual(6.5)
    expect(grade).toBeLessThanOrEqual(8.5)
  })

  it('has meta within char limits', () => {
    expect(seed.metaTitle.length).toBeLessThanOrEqual(60)
    expect(seed.metaDescription.length).toBeLessThanOrEqual(160)
    expect(seed.metaTitle.length).toBeGreaterThanOrEqual(10)
    expect(seed.metaDescription.length).toBeGreaterThanOrEqual(50)
  })

  it('has body word count in 700–1400 range', () => {
    const prose = extractPlainText(seed.body)
    const words = prose.split(/\s+/).filter((w) => /[a-z]/i.test(w)).length
    expect(words).toBeGreaterThanOrEqual(700)
    expect(words).toBeLessThanOrEqual(1400)
  })
})
