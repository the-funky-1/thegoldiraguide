import { createClient } from '@sanity/client'
import { PILLARS } from '../src/lib/site-map'

const AUTHOR_JANE = {
  _id: 'author.jane',
  _type: 'author' as const,
  name: 'Jane Ortiz',
  slug: { _type: 'slug' as const, current: 'jane' },
  jobTitle: 'Senior Editor, The Gold IRA Guide',
  bio: 'Jane Ortiz leads the editorial desk at The Gold IRA Guide. She coordinates fact-checking across IRS publications, CFTC notices, and SEC filings, and reviews every article for accuracy before publication.',
}

async function main(): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId || !dataset || !token) {
    throw new Error(
      'seed-strategic-prerequisites: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN are required',
    )
  }
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  const pillarDocs = PILLARS.map((p) => ({
    _id: `pillar.${p.slug}`,
    _type: 'pillar' as const,
    title: p.label,
    slug: { _type: 'slug' as const, current: p.slug },
    summary: p.summary,
    order: p.order,
  }))

  const tx = client.transaction()
  tx.createIfNotExists(AUTHOR_JANE)
  for (const doc of pillarDocs) tx.createIfNotExists(doc)
  const result = await tx.commit()
  console.log(
    `seed-strategic-prerequisites: committed ${result.results.length} prerequisite documents`,
  )
  for (const r of result.results) {
    console.log(`  - ${r.operation}: ${r.id}`)
  }
}

import { fileURLToPath } from 'node:url'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { main }
