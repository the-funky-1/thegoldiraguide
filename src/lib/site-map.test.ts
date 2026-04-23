import { describe, expect, it } from 'vitest'
import {
  PILLARS,
  articleHref,
  pillarBySlug,
  pillarHref,
  pillarLabel,
} from './site-map'

const BANNED_IN_SUMMARIES = [
  /our institutional standard/i,
  /binding written estimate/i,
  /commits capital/i,
] as const

describe('PILLARS', () => {
  it('has exactly five pillars in the canonical order', () => {
    expect(PILLARS.map((p) => p.slug)).toEqual([
      'ira-rules',
      'accountability',
      'economics',
      'tools',
      'about',
    ])
  })

  it('defines all five pillars', () => {
    expect(PILLARS.map((p) => p.slug).sort()).toEqual(
      ['about', 'accountability', 'economics', 'ira-rules', 'tools'].sort(),
    )
  })

  it('contains no LGS-promotional phrases in any pillar summary', () => {
    for (const pillar of PILLARS) {
      for (const phrase of BANNED_IN_SUMMARIES) {
        expect(pillar.summary).not.toMatch(phrase)
      }
    }
  })

  it("accountability pillar summary describes the topic, not LGS's practice", () => {
    const accountability = pillarBySlug('accountability')
    expect(accountability?.summary).toMatch(
      /written estimates, fee disclosures, and how to verify what a dealer promises/i,
    )
  })

  it('about pillar summary leads with editorial content, not ownership', () => {
    const about = pillarBySlug('about')
    expect(about?.summary).toMatch(
      /^editorial guidelines, expert author biographies/i,
    )
  })
})

describe('pillarBySlug', () => {
  it('returns the pillar when it exists', () => {
    expect(pillarBySlug('ira-rules')?.label).toBe('IRA Rules')
  })
  it('returns undefined for unknown slugs', () => {
    expect(pillarBySlug('nope')).toBeUndefined()
  })
})

describe('pillarHref', () => {
  it('builds /<pillar>/', () => {
    expect(pillarHref('ira-rules')).toBe('/ira-rules')
  })
})

describe('articleHref', () => {
  it('builds /<pillar>/<slug>', () => {
    expect(articleHref('accountability', 'the-written-estimate-standard')).toBe(
      '/accountability/the-written-estimate-standard',
    )
  })
})

describe('pillarLabel', () => {
  it('returns the human-readable label', () => {
    expect(pillarLabel('about')).toBe('About')
  })
})
