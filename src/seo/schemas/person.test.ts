import { describe, expect, it } from 'vitest'
import { buildPerson } from './person'

describe('buildPerson', () => {
  it('emits hasCredential entries with recognizedBy and verification URL', () => {
    const p = buildPerson({
      siteUrl: 'https://example.test',
      name: 'Jane',
      slug: 'jane',
      credentials: [
        {
          name: 'CFA',
          credentialCategory: 'certification',
          recognizedBy: 'CFA Institute',
          verificationUrl: 'https://example.test/verify/123',
        },
      ],
    })
    expect(p.hasCredential).toEqual([
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'CFA',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'CFA Institute' },
        url: 'https://example.test/verify/123',
      },
    ])
  })

  it('uses sameAs for verified social profiles', () => {
    const p = buildPerson({
      siteUrl: 'https://example.test',
      name: 'Jane',
      slug: 'jane',
      socialProfiles: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/jane' },
      ],
    })
    expect(p.sameAs).toEqual(['https://linkedin.com/in/jane'])
  })
})
