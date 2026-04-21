import { beforeEach, describe, expect, it } from 'vitest'
import { CITATIONS, citation } from './citations'
import { buildCrossLinks, registerArticle, resetForTests } from './cross-links'

describe('CITATIONS', () => {
  it('has an entry for IRS Publication 590-A', () => {
    expect(CITATIONS['irs-590a']).toBeDefined()
    expect(CITATIONS['irs-590a']!.url).toMatch(/irs\.gov/)
  })

  it('citation(key) throws on unknown key', () => {
    expect(() => citation('not-a-real-source')).toThrow()
  })
})

describe('buildCrossLinks', () => {
  beforeEach(() => {
    resetForTests()
    registerArticle('ira-rules/eligible-metals')
    registerArticle('ira-rules/collectible-prohibition')
  })

  it('rejects self-reference', () => {
    expect(() =>
      buildCrossLinks('ira-rules/eligible-metals', [
        'ira-rules/eligible-metals',
      ]),
    ).toThrow(/self-reference/)
  })

  it('rejects links to nonexistent articles', () => {
    expect(() =>
      buildCrossLinks('ira-rules/eligible-metals', ['ira-rules/nope']),
    ).toThrow(/unknown target/)
  })

  it('accepts valid links', () => {
    expect(
      buildCrossLinks('ira-rules/eligible-metals', [
        'ira-rules/collectible-prohibition',
      ]),
    ).toEqual(['ira-rules/collectible-prohibition'])
  })
})
