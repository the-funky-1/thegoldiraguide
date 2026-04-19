import { describe, expect, it } from 'vitest'
import { buildWebSite } from './website'

describe('buildWebSite', () => {
  it('returns @type=WebSite with name and URL', () => {
    const site = buildWebSite({ siteUrl: 'https://example.test' })
    expect(site['@type']).toBe('WebSite')
    expect(site.url).toBe('https://example.test')
    expect(site.name).toBe('The Gold IRA Guide')
  })

  it('references the publisher Organization', () => {
    const site = buildWebSite({ siteUrl: 'https://example.test' })
    expect(site.publisher).toMatchObject({
      '@type': 'Organization',
      name: 'The Gold IRA Guide',
    })
  })
})
