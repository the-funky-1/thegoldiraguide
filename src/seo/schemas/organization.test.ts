import { describe, expect, it } from 'vitest'
import { buildOrganization } from './organization'

describe('buildOrganization', () => {
  it('names The Gold IRA Guide as the publisher with parent Liberty Gold Silver', () => {
    const org = buildOrganization({
      siteUrl: 'https://www.thegoldiraguide.com',
    })
    expect(org['@context']).toBe('https://schema.org')
    expect(org['@type']).toBe('Organization')
    expect(org.name).toBe('The Gold IRA Guide')
    expect(org.parentOrganization).toMatchObject({
      '@type': 'Organization',
      name: 'Liberty Gold Silver',
    })
  })

  it('sets url to the canonical site URL', () => {
    const org = buildOrganization({ siteUrl: 'https://example.test' })
    expect(org.url).toBe('https://example.test')
  })
})
