import { describe, expect, it, vi } from 'vitest'

// next/font/google functions are not available in Vitest's Node environment.
// The mock returns a factory that produces font objects with the expected shape.
vi.mock('next/font/google', () => ({
  IBM_Plex_Serif: () => ({ className: '', variable: '--font-serif', style: { fontFamily: '' } }),
  IBM_Plex_Mono: () => ({ className: '', variable: '--font-mono', style: { fontFamily: '' } }),
  Inter: () => ({ className: '', variable: '--font-sans', style: { fontFamily: '' } }),
}))

// next/link is not available in Vitest's Node environment.
vi.mock('next/link', () => ({
  default: ({ children }: { href: string; children?: unknown }) => children,
}))

import { metadata } from './layout'

describe('root metadata', () => {
  it('uses a reader-focused description', () => {
    expect(metadata.description).toMatch(
      /independent reference on self-directed precious metals IRAs/i,
    )
  })

  it('does not contain LGS-promotional phrases', () => {
    const desc = (metadata.description ?? '').toLowerCase()
    expect(desc).not.toContain('binding written estimate')
    expect(desc).not.toContain('institutional standard')
    expect(desc).not.toContain('owned and operated by')
  })

  it('still names Liberty Gold Silver as the owner (disclosure requirement)', () => {
    expect(metadata.description).toMatch(/Liberty Gold Silver/)
  })
})
