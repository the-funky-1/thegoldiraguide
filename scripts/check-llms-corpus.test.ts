import { describe, expect, it } from 'vitest'
import { auditLlmsCorpus } from './check-llms-corpus'

const passing = {
  'src/app/llms.txt/route.ts': 'PUBLIC_TOOL_PAGES',
  'src/app/llms-full.txt/route.ts': 'PUBLIC_TOOL_PAGES',
  'src/app/api/md/[...path]/route.ts': 'getPublicToolPage',
  'src/app/sitemap.xml/route.ts': 'PUBLIC_TOOL_PAGES',
  'src/app/(marketing)/tools/page.tsx': [
    "slug: 'fee-drag-analyzer'",
    "slug: 'roi-calculator'",
    "slug: 'live-spot-prices'",
    "slug: 'written-estimate-checklist'",
    "slug: 'spread-markup-calculator'",
    "slug: 'rmd-estimator'",
    "slug: 'correlation-matrix'",
  ].join('\n'),
}

describe('auditLlmsCorpus', () => {
  it('passes when tool registry consumers and landing links are present', () => {
    expect(auditLlmsCorpus(passing)).toEqual([])
  })

  it('flags a missing public tool link', () => {
    const result = auditLlmsCorpus({
      ...passing,
      'src/app/(marketing)/tools/page.tsx': "slug: 'fee-drag-analyzer'",
    })
    expect(result).toContainEqual({
      file: 'src/app/(marketing)/tools/page.tsx',
      message: 'missing public tool link for roi-calculator',
    })
  })
})
