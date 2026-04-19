import { describe, expect, it } from 'vitest'
import { validateJsonLd } from './validate'

describe('validateJsonLd', () => {
  it('passes a well-formed Article', () => {
    const r = validateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'x',
      url: 'https://x.test/y',
    })
    expect(r.ok).toBe(true)
    expect(r.errors).toEqual([])
  })

  it('fails when @context is missing', () => {
    const r = validateJsonLd({ '@type': 'Article', url: 'https://x.test' })
    expect(r.ok).toBe(false)
    expect(r.errors).toContain('missing @context')
  })

  it('fails when a url field is relative', () => {
    const r = validateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      url: '/relative',
    })
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('relative url'))).toBe(true)
  })

  it('recurses into nested objects and arrays', () => {
    const r = validateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', item: 'not-a-url' }],
    })
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('not-a-url'))).toBe(true)
  })
})
