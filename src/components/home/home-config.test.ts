import { describe, expect, it } from 'vitest'
import { PILLARS } from '@/lib/site-map'
import { FEATURED_PILLAR_SLUG } from './home-config'

describe('home-config', () => {
  it('FEATURED_PILLAR_SLUG resolves to a real pillar', () => {
    expect(PILLARS.map((p) => p.slug)).toContain(FEATURED_PILLAR_SLUG)
  })

  it('featured pillar is "ira-rules" — the canonical entry point for new readers', () => {
    expect(FEATURED_PILLAR_SLUG).toBe('ira-rules')
  })
})
