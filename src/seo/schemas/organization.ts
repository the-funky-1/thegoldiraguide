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
    description:
      'An independent educational reference on self-directed precious metals IRAs — rules, costs, and documented fee structures. Owned by Liberty Gold Silver.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    publishingPrinciples: `${siteUrl}/about/editorial-guidelines`,
    ethicsPolicy: `${siteUrl}/about/ftc-disclosure`,
    knowsAbout: [
      'Self-directed IRAs',
      'Precious metals IRA rules',
      'Gold IRA fees',
      'Written precious metals transaction estimates',
    ],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Liberty Gold Silver',
      url: 'https://www.libertygoldsilver.com',
    },
    sameAs: ['https://www.libertygoldsilver.com'],
  }
}
