import { createClient, type SanityClient } from '@sanity/client'
import { ALL_SEEDS } from '../src/content/strategic/index'
import type { ArticleSeed } from '../src/content/strategic/types'

type References = {
  authorIdBySlug: Record<string, string>
  pillarIdBySlug: Record<string, string>
}

type Mutation = {
  createOrReplace: {
    _id: string
    _type: 'article'
    [field: string]: unknown
  }
}

export function planUpserts(
  seeds: ArticleSeed[],
  refs: References,
): Mutation[] {
  return seeds.map((seed) => {
    const authorId = refs.authorIdBySlug[seed.authorSlug]
    if (!authorId) {
      throw new Error(
        `seed-strategic: missing author "${seed.authorSlug}" (seed ${seed._id})`,
      )
    }
    const pillarId = refs.pillarIdBySlug[seed.pillar]
    if (!pillarId) {
      throw new Error(
        `seed-strategic: missing pillar "${seed.pillar}" (seed ${seed._id})`,
      )
    }
    return {
      createOrReplace: {
        _id: seed._id,
        _type: 'article',
        title: seed.title,
        slug: { _type: 'slug', current: seed.slug },
        pillar: { _type: 'reference', _ref: pillarId },
        author: { _type: 'reference', _ref: authorId },
        publishedAt: new Date(seed.publishedAt).toISOString(),
        updatedAt: new Date(seed.updatedAt).toISOString(),
        summary: seed.summary,
        body: seed.body,
        schemaJsonLdType: seed.schemaJsonLdType,
        citations: seed.citations.map((c) => ({
          _type: 'citation',
          label: c.label,
          url: c.url,
          accessed: c.accessed,
        })),
        seo: {
          _type: 'seo',
          metaTitle: seed.metaTitle,
          metaDescription: seed.metaDescription,
          noIndex: false,
        },
      },
    }
  })
}

async function loadReferences(client: SanityClient): Promise<References> {
  const authors = await client.fetch<
    { _id: string; slug: { current: string } }[]
  >(`*[_type=="author"]{ _id, slug }`)
  const pillars = await client.fetch<
    { _id: string; slug: { current: string } }[]
  >(`*[_type=="pillar"]{ _id, slug }`)
  return {
    authorIdBySlug: Object.fromEntries(
      authors.map((a) => [a.slug.current, a._id]),
    ),
    pillarIdBySlug: Object.fromEntries(
      pillars.map((p) => [p.slug.current, p._id]),
    ),
  }
}

async function main(): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId || !dataset || !token) {
    throw new Error(
      'seed-strategic: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN are required',
    )
  }
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })
  const refs = await loadReferences(client)
  const mutations = planUpserts(ALL_SEEDS, refs)
  const tx = client.transaction()
  for (const m of mutations) tx.createOrReplace(m.createOrReplace)
  const result = await tx.commit()
  console.log(`seed-strategic: committed ${result.results.length} mutations`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
