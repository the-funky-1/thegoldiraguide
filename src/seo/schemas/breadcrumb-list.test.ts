import { describe, expect, it } from 'vitest'
import { buildBreadcrumbList } from './breadcrumb-list'

describe('buildBreadcrumbList', () => {
  it('emits ordered ListItem with position and absolute URLs', () => {
    const bl = buildBreadcrumbList({
      siteUrl: 'https://example.test',
      items: [
        { label: 'Home', path: '/' },
        { label: 'IRA Rules', path: '/ira-rules' },
        { label: 'Eligible metals', path: '/ira-rules/eligible-metals' },
      ],
    })
    expect(bl['@type']).toBe('BreadcrumbList')
    const items = bl.itemListElement as unknown as Array<{
      position: number
      name: string
      item: string
    }>
    expect(items.map((i) => i.position)).toEqual([1, 2, 3])
    expect(items[0]).toMatchObject({
      name: 'Home',
      item: 'https://example.test/',
    })
    expect(items[2]).toMatchObject({
      name: 'Eligible metals',
      item: 'https://example.test/ira-rules/eligible-metals',
    })
  })
})
