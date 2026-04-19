import type { WebSite, WithContext } from 'schema-dts'

type ConcreteWebSite = Exclude<WebSite, string>

export function buildWebSite({
  siteUrl,
}: {
  siteUrl: string
}): WithContext<ConcreteWebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Gold IRA Guide',
    url: siteUrl,
    publisher: {
      '@type': 'Organization',
      name: 'The Gold IRA Guide',
      url: siteUrl,
    },
  }
}
