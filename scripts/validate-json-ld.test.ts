import { describe, expect, it } from 'vitest'
import { extractJsonLdBlocks } from './validate-json-ld'

describe('extractJsonLdBlocks', () => {
  it('extracts a single well-formed block', () => {
    const html = `<html><head><script type="application/ld+json">{"@type":"Thing"}</script></head></html>`
    expect(extractJsonLdBlocks(html)).toEqual([{ '@type': 'Thing' }])
  })

  it('extracts multiple blocks in order', () => {
    const html = `
      <script type="application/ld+json">{"@type":"A"}</script>
      <script type="application/ld+json">{"@type":"B"}</script>
    `
    const blocks = extractJsonLdBlocks(html)
    expect(blocks).toHaveLength(2)
    expect((blocks[0] as { '@type': string })['@type']).toBe('A')
    expect((blocks[1] as { '@type': string })['@type']).toBe('B')
  })

  it('skips non-ld script tags', () => {
    const html = `<script>alert(1)</script><script type="application/ld+json">{"@type":"A"}</script>`
    expect(extractJsonLdBlocks(html)).toEqual([{ '@type': 'A' }])
  })
})
