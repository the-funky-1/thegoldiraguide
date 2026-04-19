import { describe, expect, it } from 'vitest'
import {
  PILLARS,
  articleHref,
  pillarBySlug,
  pillarHref,
  pillarLabel,
} from './site-map'

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
    expect(
      articleHref('accountability', 'the-written-estimate-standard'),
    ).toBe('/accountability/the-written-estimate-standard')
  })
})

describe('pillarLabel', () => {
  it('returns the human-readable label', () => {
    expect(pillarLabel('about')).toBe('Institutional Accountability')
  })
})
