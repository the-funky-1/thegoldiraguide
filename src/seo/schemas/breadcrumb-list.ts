import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts'

type Input = {
  siteUrl: string
  items: { label: string; path: string }[]
}

type ConcreteBreadcrumbList = Exclude<BreadcrumbList, string>
type ConcreteListItem = Exclude<ListItem, string>

export function buildBreadcrumbList({
  siteUrl,
  items,
}: Input): WithContext<ConcreteBreadcrumbList> {
  const itemListElement: ConcreteListItem[] = items.map((it, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: it.label,
    item: new URL(it.path, siteUrl).toString(),
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}
