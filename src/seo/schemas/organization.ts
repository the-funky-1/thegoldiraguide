import type { Organization, WithContext } from 'schema-dts'

// schema-dts's nominal `Organization` is a union that includes `string` (for
// JSON-LD @id references). The builder only ever returns a concrete object, so
// strip the `string` variant before wrapping with `WithContext`.
type ConcreteOrganization = Exclude<Organization, string>

export function buildOrganization({
  siteUrl,
}: {
  siteUrl: string
}): WithContext<ConcreteOrganization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Gold IRA Guide',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    parentOrganization: {
      '@type': 'Organization',
      name: 'Liberty Gold Silver',
      url: 'https://www.libertygoldsilver.com',
    },
    sameAs: ['https://www.libertygoldsilver.com'],
  }
}
