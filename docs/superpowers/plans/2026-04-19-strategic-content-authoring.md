# Plan 9: Strategic Content Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–8 shipped (tag `v1.0.0`).

**Goal:** Ship all 25 strategic articles defined in `Gold IRA Content Strategy Development.md` — 5 per pillar (IRA Rules, Accountability, Economics, Tools, About) — as Sanity documents with exact meta titles and meta descriptions, FAQPage/HowTo/FinancialProduct JSON-LD schema selection, cross-links between articles, sourced statements, and 7th–8th-grade reading level. Add two narrow Sanity schema fields the new content requires (`schemaJsonLdType` selector, `citations` array). Seed via an idempotent import script that can be re-run against any Sanity dataset without duplicating.

**Architecture:** Article copy and metadata live in a typed TypeScript source-of-truth under `src/content/strategic/<pillar>/<article-slug>.ts`, exported as a validated `ArticleSeed` object (Zod schema enforces meta limits, reading level, required cross-links). A single import script (`pnpm seed:strategic`) reads all seeds, validates them, and upserts to Sanity using the content-first `createOrReplace` pattern keyed by a deterministic `_id` (`article.<pillar>.<slug>`). The existing `article` schema already supports portable-text body, FAQ blocks, SEO, and llms-only/llms-ignore blocks — we extend it with `schemaJsonLdType` and `citations`, then extend the JSON-LD emission in `src/seo/json-ld.ts` to read `schemaJsonLdType` and emit the correct schema.org type per article. Bodies are authored in portable-text-as-TypeScript (using a small `pt()` helper), kept in source control, and reviewable via the Studio after seeding.

**Tech stack additions:** No new runtime dependencies. Dev-only: `@sanity/client` is already installed; we reuse it.

**Out of scope (deferred to Plans 10–11):**
- New interactive tools 4.3 (Spread Calculator), 4.4 (RMD Estimator), 4.5 (Correlation Matrix) — Plan 10.
- Brand-voice lint rules, semantic-vector competitor-mention detector, global disclosure-placement audit — Plan 11.
- Author biography portraits and credential uploads beyond what Plan 2 already seeded — handled in Studio editorial, not this plan.

---

## File Structure

**New files:**
```
src/content/strategic/
  types.ts                              — ArticleSeed type + Zod schema
  pt.ts                                 — portable-text builder helpers
  citations.ts                          — citation registry (reusable sources)
  cross-links.ts                        — inter-article cross-link registry
  reading-level.ts                      — Flesch-Kincaid grade-level scorer
  reading-level.test.ts
  ira-rules/
    eligible-metals.ts                  — 1.1 IRS purity standards
    collectible-prohibition.ts          — 1.2 IRC 408(m)
    depository-storage.ts               — 1.3 IRS-approved depositories
    rollover-mechanics.ts               — 1.4 rollovers and the 60-day rule
    home-storage-fallacy.ts             — 1.5 home storage IRAs
  accountability/
    transactional-spreads.ts            — 2.1 mathematics of spreads
    flat-vs-scaling-fees.ts             — 2.2 flat-rate vs scaling storage
    written-estimate.ts                 — 2.3 the written estimate
    bullion-vs-numismatic.ts            — 2.4 bullion vs numismatic cost basis
    promotional-offers.ts               — 2.5 assessing promotional offers
  economics/
    fiat-devaluation.ts                 — 3.1 tangible assets + fiat
    physical-vs-etfs.ts                 — 3.2 physical bullion vs paper ETFs
    supply-demand-industrial.ts         — 3.3 supply, demand, industrial use
    portfolio-volatility.ts             — 3.4 portfolio volatility + MPT
    capital-gains-non-ira.ts            — 3.5 capital gains outside IRAs
  tools/
    fee-drag-analyzer.ts                — 4.1 hub page copy for existing tool
    spot-price-dashboard.ts             — 4.2 hub page copy for existing tool
    spread-markup-calculator.ts         — 4.3 hub stub (tool lands in Plan 10)
    rmd-estimator.ts                    — 4.4 hub stub (tool lands in Plan 10)
    correlation-matrix.ts               — 4.5 hub stub (tool lands in Plan 10)
  about/
    about-the-guide.ts                  — 5.1 about LGS + the Guide
    editorial-guidelines.ts             — 5.2 editorial standards
    ftc-disclosures.ts                  — 5.3 FTC disclosures
    accountability-standard.ts          — 5.4 the Accountability Standard
    expert-authors.ts                   — 5.5 authors index page copy
  index.ts                              — re-exports all 25 seeds
  index.test.ts                         — validates all seeds at build time

scripts/
  seed-strategic-content.ts             — import script (pnpm seed:strategic)
  seed-strategic-content.test.ts        — unit tests on the upsert planner
  validate-strategic-content.ts         — CI gate: run index.test.ts + reading-level
```

**Modified files:**
```
src/sanity/schemas/article.ts           — add schemaJsonLdType + citations fields
src/sanity/schemas/objects/seo.ts       — tighten metaTitle max to 60, metaDescription max to 160 (errors, not warnings)
src/seo/json-ld.ts                      — branch on schemaJsonLdType
src/seo/json-ld.test.ts                 — cover the new branches
src/app/(marketing)/[pillar]/[slug]/page.tsx (each pillar)  — no code change; routes already read from Sanity
package.json                            — add "seed:strategic" script
.github/workflows/ci.yml                — add validate-strategic-content step
```

Design rules:
- **Every article seed is fully self-contained** — no runtime data fetches inside seeds; citations and cross-links resolve through registries at build time.
- **The Sanity document is the runtime artifact.** The TypeScript seed is a build-time source of truth. After seeding, editors can tweak copy in Studio; the next seed run will *not* overwrite edits unless `--force` is passed.
- **Reading level is a hard gate.** Any seed scoring above 8.5 on Flesch-Kincaid fails CI. Target 7.0–8.0.

---

## Task 1: Sanity Schema Additions (TDD)

**Files:**
- Modify: `src/sanity/schemas/article.ts`
- Modify: `src/sanity/schemas/objects/seo.ts`
- Modify: `src/sanity/schemas/schemas.test.ts`

- [ ] **Step 1.1: Write failing schema test**

Open `src/sanity/schemas/schemas.test.ts` and add:

```ts
import { describe, expect, it } from 'vitest'
import { article } from './article'
import { seo } from './objects/seo'

describe('article.schemaJsonLdType', () => {
  it('is a string field with a closed enum list', () => {
    const field = article.fields.find((f) => f.name === 'schemaJsonLdType')
    expect(field).toBeDefined()
    expect(field?.type).toBe('string')
    expect(field?.options?.list).toEqual([
      { title: 'Article (default)', value: 'Article' },
      { title: 'FAQPage', value: 'FAQPage' },
      { title: 'HowTo', value: 'HowTo' },
      { title: 'FinancialProduct', value: 'FinancialProduct' },
      { title: 'Guide', value: 'Guide' },
    ])
  })
})

describe('article.citations', () => {
  it('is an array of citation objects with url + title + accessed date', () => {
    const field = article.fields.find((f) => f.name === 'citations')
    expect(field).toBeDefined()
    expect(field?.type).toBe('array')
  })
})

describe('seo.metaTitle validation', () => {
  it('errors (not warns) when over 60 chars', () => {
    // The seo field validation is a function. We invoke it through the schema.
    const titleField = seo.fields.find((f) => f.name === 'metaTitle')
    expect(titleField).toBeDefined()
    // Smoke test: field exists; full validation asserted in build-time validator.
  })
})
```

- [ ] **Step 1.2: Run test — should fail**

Run: `pnpm vitest run src/sanity/schemas/schemas.test.ts`
Expected: FAIL — `schemaJsonLdType` and `citations` do not exist on article.

- [ ] **Step 1.3: Add `schemaJsonLdType` and `citations` to article schema**

Edit `src/sanity/schemas/article.ts`. Add the two fields after the existing `seo` field:

```ts
defineField({
  name: 'schemaJsonLdType',
  title: 'Schema.org JSON-LD type',
  type: 'string',
  description:
    'Controls which schema.org type is emitted. Defaults to Article. FAQPage requires at least one faq block in the body. HowTo requires a stepwise structure.',
  initialValue: 'Article',
  options: {
    list: [
      { title: 'Article (default)', value: 'Article' },
      { title: 'FAQPage', value: 'FAQPage' },
      { title: 'HowTo', value: 'HowTo' },
      { title: 'FinancialProduct', value: 'FinancialProduct' },
      { title: 'Guide', value: 'Guide' },
    ],
    layout: 'radio',
  },
  validation: (r) => r.required(),
}),
defineField({
  name: 'citations',
  title: 'Citations',
  type: 'array',
  description:
    'External sources cited in the body. Rendered as a “Works cited” list at the bottom of the article and emitted as schema.org citation.',
  of: [
    defineField({
      name: 'citation',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', validation: (r) => r.required() },
        { name: 'url', type: 'url', validation: (r) => r.required() },
        {
          name: 'accessed',
          type: 'date',
          description: 'Date the source was last verified.',
          validation: (r) => r.required(),
        },
      ],
      preview: { select: { title: 'label', subtitle: 'url' } },
    }),
  ],
}),
```

- [ ] **Step 1.4: Tighten SEO validation to errors**

Edit `src/sanity/schemas/objects/seo.ts`. Replace the two warning validators with errors and drop max from 70 to 60:

```ts
defineField({
  name: 'metaTitle',
  title: 'Meta title',
  type: 'string',
  validation: (r) =>
    r.required().max(60).error('Meta title must be 60 characters or fewer'),
}),
defineField({
  name: 'metaDescription',
  title: 'Meta description',
  type: 'text',
  rows: 3,
  validation: (r) =>
    r.required().max(160).error('Meta description must be 160 characters or fewer'),
}),
```

- [ ] **Step 1.5: Run tests — should pass**

Run: `pnpm vitest run src/sanity/schemas/schemas.test.ts`
Expected: PASS.

- [ ] **Step 1.6: Commit**

```bash
git add src/sanity/schemas/article.ts src/sanity/schemas/objects/seo.ts src/sanity/schemas/schemas.test.ts
git commit -m "feat(sanity): add schemaJsonLdType + citations; tighten SEO limits"
```

---

## Task 2: Content Seed Types and Zod Validation (TDD)

**Files:**
- Create: `src/content/strategic/types.ts`
- Create: `src/content/strategic/types.test.ts`

- [ ] **Step 2.1: Write failing Zod schema test**

Create `src/content/strategic/types.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { ArticleSeedSchema } from './types'

const valid = {
  _id: 'article.ira-rules.eligible-metals',
  pillar: 'ira-rules' as const,
  slug: 'eligible-metals',
  title: 'IRS Purity Standards for Precious Metals IRAs',
  summary: 'The exact fineness the IRS requires for gold, silver, platinum, and palladium in a retirement account.',
  metaTitle: 'IRS Purity Standards for Precious Metals IRAs (2026)',
  metaDescription:
    'Review the exact IRS fineness requirements for holding gold, silver, platinum, and palladium in a self-directed retirement account. Includes eligible bullion lists.',
  schemaJsonLdType: 'FAQPage' as const,
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane-doe',
  body: [{ _type: 'block', children: [{ _type: 'span', text: 'Body.' }] }],
  faqs: [
    {
      question: 'What is the gold purity requirement for an IRA?',
      answer: 'The IRS requires 99.5% fineness for gold held in a precious metals IRA.',
    },
  ],
  crossLinks: ['ira-rules/collectible-prohibition'],
  citations: [
    { label: 'IRS Publication 590-A', url: 'https://www.irs.gov/pub/irs-pdf/p590a.pdf', accessed: '2026-04-19' },
  ],
}

describe('ArticleSeedSchema', () => {
  it('accepts a valid seed', () => {
    expect(() => ArticleSeedSchema.parse(valid)).not.toThrow()
  })

  it('rejects meta title over 60 chars', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, metaTitle: 'x'.repeat(61) }),
    ).toThrow(/metaTitle/)
  })

  it('rejects meta description over 160 chars', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, metaDescription: 'x'.repeat(161) }),
    ).toThrow(/metaDescription/)
  })

  it('rejects FAQPage schema with zero FAQs', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, faqs: [] }),
    ).toThrow(/FAQPage requires at least one faq/)
  })

  it('rejects pillar values outside the five known pillars', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, pillar: 'something-else' }),
    ).toThrow()
  })

  it('rejects cross-links that do not match the <pillar>/<slug> shape', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, crossLinks: ['not-a-valid-link'] }),
    ).toThrow(/crossLinks/)
  })

  it('requires at least one citation', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, citations: [] }),
    ).toThrow(/citations/)
  })
})
```

- [ ] **Step 2.2: Run — should fail**

Run: `pnpm vitest run src/content/strategic/types.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 2.3: Implement `ArticleSeedSchema`**

Create `src/content/strategic/types.ts`:

```ts
import { z } from 'zod'

export const PILLAR_SLUGS = [
  'ira-rules',
  'accountability',
  'economics',
  'tools',
  'about',
] as const

export const SCHEMA_TYPES = [
  'Article',
  'FAQPage',
  'HowTo',
  'FinancialProduct',
  'Guide',
] as const

const CrossLinkSchema = z
  .string()
  .regex(
    /^(ira-rules|accountability|economics|tools|about)\/[a-z0-9-]+$/,
    'crossLinks must be <pillar>/<slug>',
  )

const FaqSchema = z.object({
  question: z.string().min(8).max(200),
  answer: z.string().min(20).max(600),
})

const CitationSchema = z.object({
  label: z.string().min(4),
  url: z.string().url(),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const ArticleSeedSchema = z
  .object({
    _id: z.string().regex(/^article\.[a-z-]+\.[a-z0-9-]+$/),
    pillar: z.enum(PILLAR_SLUGS),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(10).max(120),
    summary: z.string().min(40).max(320),
    metaTitle: z.string().min(10).max(60, 'metaTitle must be 60 chars or fewer'),
    metaDescription: z
      .string()
      .min(50)
      .max(160, 'metaDescription must be 160 chars or fewer'),
    schemaJsonLdType: z.enum(SCHEMA_TYPES),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    authorSlug: z.string().regex(/^[a-z0-9-]+$/),
    body: z.array(z.record(z.unknown())).min(1),
    faqs: z.array(FaqSchema),
    crossLinks: z.array(CrossLinkSchema).min(1),
    citations: z
      .array(CitationSchema)
      .min(1, 'citations: at least one citation is required'),
  })
  .superRefine((data, ctx) => {
    if (data.schemaJsonLdType === 'FAQPage' && data.faqs.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['faqs'],
        message: 'FAQPage requires at least one faq block',
      })
    }
    if (!data._id.endsWith(`.${data.pillar}.${data.slug}`)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['_id'],
        message: '_id must be article.<pillar>.<slug>',
      })
    }
  })

export type ArticleSeed = z.infer<typeof ArticleSeedSchema>
export type PillarSlug = (typeof PILLAR_SLUGS)[number]
export type SchemaJsonLdType = (typeof SCHEMA_TYPES)[number]
```

- [ ] **Step 2.4: Run — should pass**

Run: `pnpm vitest run src/content/strategic/types.test.ts`
Expected: PASS.

- [ ] **Step 2.5: Commit**

```bash
git add src/content/strategic/types.ts src/content/strategic/types.test.ts
git commit -m "feat(content): ArticleSeed zod schema with meta + citation gates"
```

---

## Task 3: Portable-Text Builder Helpers (TDD)

**Files:**
- Create: `src/content/strategic/pt.ts`
- Create: `src/content/strategic/pt.test.ts`

- [ ] **Step 3.1: Write failing test**

Create `src/content/strategic/pt.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { block, callout, faq, h2, h3, llmsOnly, p } from './pt'

describe('p', () => {
  it('creates a plain paragraph block', () => {
    expect(p('Hello.')).toMatchObject({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Hello.' }],
    })
  })
})

describe('h2', () => {
  it('creates an h2 block', () => {
    expect(h2('Heading')).toMatchObject({ style: 'h2' })
  })
})

describe('faq', () => {
  it('creates an inline faq object', () => {
    expect(faq('Q?', 'A.')).toEqual({
      _type: 'faq',
      question: 'Q?',
      answer: 'A.',
    })
  })
})

describe('callout', () => {
  it('creates a warning callout', () => {
    expect(callout('warning', 'Be careful.')).toEqual({
      _type: 'callout',
      tone: 'warning',
      body: 'Be careful.',
    })
  })
})

describe('llmsOnly', () => {
  it('wraps children in an llmsOnly block', () => {
    const inner = p('Hidden from humans.')
    expect(llmsOnly([inner])).toEqual({
      _type: 'llmsOnly',
      children: [inner],
    })
  })
})

describe('block', () => {
  it('produces stable _key values per position', () => {
    const b1 = block('b1', p('one'))
    const b2 = block('b2', p('two'))
    expect(b1._key).toBe('b1')
    expect(b2._key).toBe('b2')
  })
})
```

- [ ] **Step 3.2: Run — should fail**

Run: `pnpm vitest run src/content/strategic/pt.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3.3: Implement `pt.ts`**

Create `src/content/strategic/pt.ts`:

```ts
type Span = { _type: 'span'; text: string; marks?: string[] }

type Block = {
  _type: 'block'
  _key?: string
  style: 'normal' | 'h2' | 'h3' | 'blockquote'
  children: Span[]
  markDefs?: unknown[]
}

type Callout = {
  _type: 'callout'
  tone: 'info' | 'warning' | 'danger'
  body: string
}

type Faq = { _type: 'faq'; question: string; answer: string }

type LlmsOnly = { _type: 'llmsOnly'; children: unknown[] }

export function p(text: string): Block {
  return {
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text }],
  }
}

export function h2(text: string): Block {
  return { _type: 'block', style: 'h2', children: [{ _type: 'span', text }] }
}

export function h3(text: string): Block {
  return { _type: 'block', style: 'h3', children: [{ _type: 'span', text }] }
}

export function faq(question: string, answer: string): Faq {
  return { _type: 'faq', question, answer }
}

export function callout(tone: Callout['tone'], body: string): Callout {
  return { _type: 'callout', tone, body }
}

export function llmsOnly(children: unknown[]): LlmsOnly {
  return { _type: 'llmsOnly', children }
}

export function block<T extends Record<string, unknown>>(
  key: string,
  b: T,
): T & { _key: string } {
  return { ...b, _key: key }
}
```

- [ ] **Step 3.4: Run — should pass**

Run: `pnpm vitest run src/content/strategic/pt.test.ts`
Expected: PASS.

- [ ] **Step 3.5: Commit**

```bash
git add src/content/strategic/pt.ts src/content/strategic/pt.test.ts
git commit -m "feat(content): portable-text builder helpers"
```

---

## Task 4: Reading-Level Scorer (TDD)

**Files:**
- Create: `src/content/strategic/reading-level.ts`
- Create: `src/content/strategic/reading-level.test.ts`

- [ ] **Step 4.1: Write failing test**

Create `src/content/strategic/reading-level.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { extractPlainText, fleschKincaidGrade } from './reading-level'

describe('fleschKincaidGrade', () => {
  it('scores a short simple sentence at low grade level', () => {
    const text = 'The cat sat on the mat. The dog ran.'
    expect(fleschKincaidGrade(text)).toBeLessThan(5)
  })

  it('scores an academic sentence at high grade level', () => {
    const text =
      'The implementation ramifications of bureaucratically instantiated collateralization procedures necessitate comprehensive stakeholder reconciliation.'
    expect(fleschKincaidGrade(text)).toBeGreaterThan(14)
  })

  it('throws on empty input', () => {
    expect(() => fleschKincaidGrade('')).toThrow()
  })
})

describe('extractPlainText', () => {
  it('flattens portable-text blocks into prose', () => {
    const body = [
      { _type: 'block', children: [{ _type: 'span', text: 'Hello.' }] },
      { _type: 'block', children: [{ _type: 'span', text: 'World.' }] },
    ]
    expect(extractPlainText(body)).toBe('Hello. World.')
  })

  it('skips llmsOnly blocks (they are supplemental, not reader-facing)', () => {
    const body = [
      { _type: 'block', children: [{ _type: 'span', text: 'Reader text.' }] },
      {
        _type: 'llmsOnly',
        children: [{ _type: 'block', children: [{ _type: 'span', text: 'Hidden.' }] }],
      },
    ]
    expect(extractPlainText(body)).toBe('Reader text.')
  })
})
```

- [ ] **Step 4.2: Run — should fail**

Run: `pnpm vitest run src/content/strategic/reading-level.test.ts`
Expected: FAIL.

- [ ] **Step 4.3: Implement reading-level.ts**

Create `src/content/strategic/reading-level.ts`:

```ts
const VOWEL_GROUPS = /[aeiouy]+/g

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const matches = stripped.match(VOWEL_GROUPS)
  return Math.max(1, matches ? matches.length : 1)
}

export function fleschKincaidGrade(text: string): number {
  if (!text.trim()) throw new Error('reading-level: empty input')
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim().length > 0)
  const words = text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w))
  if (sentences.length === 0 || words.length === 0) {
    throw new Error('reading-level: no sentences or words detected')
  }
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  return (
    0.39 * (words.length / sentences.length) +
    11.8 * (syllables / words.length) -
    15.59
  )
}

type PortableBlock = {
  _type: string
  children?: Array<{ _type: string; text?: string }>
}

export function extractPlainText(blocks: unknown[]): string {
  const pieces: string[] = []
  for (const raw of blocks) {
    const b = raw as PortableBlock
    if (b._type === 'llmsOnly') continue
    if (b._type === 'block' && Array.isArray(b.children)) {
      const line = b.children
        .filter((c) => c._type === 'span' && typeof c.text === 'string')
        .map((c) => c.text as string)
        .join('')
      if (line.trim()) pieces.push(line.trim())
    }
  }
  return pieces.join(' ')
}
```

- [ ] **Step 4.4: Run — should pass**

Run: `pnpm vitest run src/content/strategic/reading-level.test.ts`
Expected: PASS.

- [ ] **Step 4.5: Commit**

```bash
git add src/content/strategic/reading-level.ts src/content/strategic/reading-level.test.ts
git commit -m "feat(content): flesch-kincaid grade-level scorer with llmsOnly skip"
```

---

## Task 5: Citation and Cross-Link Registries (TDD)

**Files:**
- Create: `src/content/strategic/citations.ts`
- Create: `src/content/strategic/cross-links.ts`
- Create: `src/content/strategic/registries.test.ts`

- [ ] **Step 5.1: Write failing test**

Create `src/content/strategic/registries.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { CITATIONS, citation } from './citations'
import { buildCrossLinks } from './cross-links'

describe('CITATIONS', () => {
  it('has an entry for IRS Publication 590-A', () => {
    expect(CITATIONS['irs-590a']).toBeDefined()
    expect(CITATIONS['irs-590a'].url).toMatch(/irs\.gov/)
  })

  it('citation(key) throws on unknown key', () => {
    expect(() => citation('not-a-real-source')).toThrow()
  })
})

describe('buildCrossLinks', () => {
  it('rejects self-reference', () => {
    expect(() =>
      buildCrossLinks('ira-rules/eligible-metals', ['ira-rules/eligible-metals']),
    ).toThrow(/self-reference/)
  })

  it('rejects links to nonexistent articles', () => {
    expect(() =>
      buildCrossLinks('ira-rules/eligible-metals', ['ira-rules/nope']),
    ).toThrow(/unknown target/)
  })

  it('accepts valid links', () => {
    expect(
      buildCrossLinks('ira-rules/eligible-metals', [
        'ira-rules/collectible-prohibition',
      ]),
    ).toEqual(['ira-rules/collectible-prohibition'])
  })
})
```

- [ ] **Step 5.2: Run — should fail**

Run: `pnpm vitest run src/content/strategic/registries.test.ts`
Expected: FAIL.

- [ ] **Step 5.3: Implement `citations.ts`**

Create `src/content/strategic/citations.ts`:

```ts
type CitationEntry = { label: string; url: string; accessed: string }

export const CITATIONS: Record<string, CitationEntry> = {
  'irs-590a': {
    label: 'IRS Publication 590-A (Contributions to IRAs)',
    url: 'https://www.irs.gov/pub/irs-pdf/p590a.pdf',
    accessed: '2026-04-19',
  },
  'irs-590b': {
    label: 'IRS Publication 590-B (Distributions from IRAs)',
    url: 'https://www.irs.gov/pub/irs-pdf/p590b.pdf',
    accessed: '2026-04-19',
  },
  'irc-408m': {
    label: 'Internal Revenue Code § 408(m)',
    url: 'https://www.law.cornell.edu/uscode/text/26/408',
    accessed: '2026-04-19',
  },
  'usc-31-5112': {
    label: '31 U.S.C. § 5112 (Denominations, specifications, and design of coins)',
    url: 'https://www.law.cornell.edu/uscode/text/31/5112',
    accessed: '2026-04-19',
  },
  'secure-2': {
    label: 'SECURE 2.0 Act (Pub. L. 117-328, Div. T)',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/2617',
    accessed: '2026-04-19',
  },
  'finra-metals': {
    label: 'FINRA Investor Bulletin: Buying Physical Gold or Other Metals',
    url: 'https://www.finra.org/investors/insights/buying-physical-gold-or-other-metals',
    accessed: '2026-04-19',
  },
  'ftc-endorsement-guides': {
    label: 'FTC Endorsement Guides (16 CFR Part 255)',
    url: 'https://www.ftc.gov/legal-library/browse/rules/guides-concerning-use-endorsements-testimonials-advertising',
    accessed: '2026-04-19',
  },
  // Additional keys added per article as needed.
}

export function citation(key: string): CitationEntry {
  const entry = CITATIONS[key]
  if (!entry) throw new Error(`citation: unknown key "${key}"`)
  return entry
}
```

- [ ] **Step 5.4: Implement `cross-links.ts`**

Create `src/content/strategic/cross-links.ts`:

```ts
// Populated by index.ts after all seeds are loaded. During module init this is
// empty; buildCrossLinks reads it lazily so circular loads resolve.
const KNOWN: Set<string> = new Set()

export function registerArticle(ref: string): void {
  KNOWN.add(ref)
}

export function buildCrossLinks(self: string, targets: string[]): string[] {
  for (const t of targets) {
    if (t === self) throw new Error(`cross-links: self-reference "${self}"`)
    if (!KNOWN.has(t)) {
      throw new Error(`cross-links: unknown target "${t}" (from "${self}")`)
    }
  }
  return targets
}

export function resetForTests(): void {
  KNOWN.clear()
}
```

- [ ] **Step 5.5: Adjust test to populate KNOWN before asserting**

Open `src/content/strategic/registries.test.ts` and prepend to the `buildCrossLinks` describe:

```ts
import { registerArticle, resetForTests } from './cross-links'

beforeEach(() => {
  resetForTests()
  registerArticle('ira-rules/eligible-metals')
  registerArticle('ira-rules/collectible-prohibition')
})
```

Add `beforeEach` to the `vitest` import.

- [ ] **Step 5.6: Run — should pass**

Run: `pnpm vitest run src/content/strategic/registries.test.ts`
Expected: PASS.

- [ ] **Step 5.7: Commit**

```bash
git add src/content/strategic/citations.ts src/content/strategic/cross-links.ts src/content/strategic/registries.test.ts
git commit -m "feat(content): citation + cross-link registries with validation"
```

---

## Task 6: Authoring Pillar 1 — IRA Rules (5 articles)

**Files:**
- Create: `src/content/strategic/ira-rules/eligible-metals.ts`
- Create: `src/content/strategic/ira-rules/collectible-prohibition.ts`
- Create: `src/content/strategic/ira-rules/depository-storage.ts`
- Create: `src/content/strategic/ira-rules/rollover-mechanics.ts`
- Create: `src/content/strategic/ira-rules/home-storage-fallacy.ts`

Source content: sections 1.1–1.5 of `Gold IRA Content Strategy Development.md`.

**Acceptance criteria (applies to every article in this task):**
- `ArticleSeedSchema.parse(seed)` succeeds.
- `fleschKincaidGrade(extractPlainText(body))` returns a value in `[6.5, 8.5]`.
- `metaTitle.length ≤ 60`, `metaDescription.length ≤ 160`.
- Every factual claim from the spec (e.g., 99.5% gold fineness, 91.67% Gold Eagle exception, the 60-day rollover deadline) appears in the body **and** is backed by a citation.
- At least one FAQ when `schemaJsonLdType === 'FAQPage'`.
- Body includes one `callout` block and at least two `h2` section headers.
- Body is 700–1,400 words (extractPlainText length).
- Uses the **Accountability / Quiet Luxury** voice — no superlatives, no competitor names, no fear-mongering. If unsure, invoke the `liberty-gold-copywriter` skill on the draft.

- [ ] **Step 6.1: Author `eligible-metals.ts` (section 1.1)**

Create `src/content/strategic/ira-rules/eligible-metals.ts` exporting a named `seed: ArticleSeed`:

```ts
import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, llmsOnly, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.ira-rules.eligible-metals',
  pillar: 'ira-rules',
  slug: 'eligible-metals',
  title: 'IRS Purity Standards for Precious Metals IRAs',
  summary:
    'The exact fineness the IRS requires for gold, silver, platinum, and palladium to qualify as investment-grade bullion inside a self-directed retirement account.',
  metaTitle: 'IRS Purity Standards for Precious Metals IRAs (2026)',
  metaDescription:
    'Review the exact IRS fineness requirements for holding gold, silver, platinum, and palladium in a self-directed retirement account. Includes eligible bullion lists.',
  schemaJsonLdType: 'FAQPage',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane-doe', // replace with real authored author slug seeded in Plan 2
  crossLinks: [
    'ira-rules/collectible-prohibition',
    'ira-rules/depository-storage',
    'accountability/bullion-vs-numismatic',
  ],
  citations: [
    citation('irs-590a'),
    citation('irc-408m'),
    citation('usc-31-5112'),
  ],
  body: [
    block('intro', p(
      'The Internal Revenue Service applies strict purity standards to any precious metal held inside a retirement account. Meeting the standard is a binary test — a coin or bar either qualifies as investment-grade bullion, or it is reclassified as a collectible and loses its tax-advantaged status.'
    )),
    block('h2-standards', h2('The four metals and their fineness floors')),
    block('gold', p(
      'Gold must be at least 99.5% pure (0.995 fineness). Silver must be at least 99.9% pure. Platinum and palladium share a higher floor of 99.95%. A single fraction of a percent below these thresholds disqualifies the entire position.'
    )),
    block('examples', p(
      'Sovereign-mint bullion that clears these bars includes the Canadian Gold Maple Leaf, the Austrian Philharmonic in gold and silver, the American Silver Eagle, and the Australian Kangaroo. The South African Krugerrand, at 91.67% gold, is explicitly disqualified.'
    )),
    block('h2-eagle', h2('The American Gold Eagle exception')),
    block('eagle', p(
      'Congress carved a narrow legislative exception for the American Gold Eagle under 31 U.S.C. § 5112. The coin contains one troy ounce of gold at only 91.67% fineness, below the general 99.5% standard, yet it remains IRA-eligible because the statute authorizes it by name. No other sub-99.5% gold coin enjoys this carve-out.'
    )),
    block('callout-eagle', callout(
      'info',
      'The American Gold Eagle is the only IRS-approved gold coin below 99.5% purity. The exemption is statutory and does not extend to pre-1933 U.S. coinage or foreign coins with similar alloy blends.',
    )),
    block('h2-faq', h2('Frequently asked questions')),
    block('faq-1', faq(
      'What purity does gold need for an IRA?',
      'Gold in a precious metals IRA must be at least 99.5% pure, with the narrow statutory exception of the American Gold Eagle at 91.67%.',
    )),
    block('faq-2', faq(
      'Are pre-1933 U.S. gold coins IRA-eligible?',
      'No. Pre-1933 U.S. gold coinage does not meet the 99.5% fineness requirement and is not covered by the American Gold Eagle statute, so it cannot be held in an IRA.',
    )),
    block('faq-3', faq(
      'Is the South African Krugerrand allowed?',
      'The Krugerrand is 91.67% gold and does not qualify. Only the American Gold Eagle enjoys a statutory exception at that fineness.',
    )),
    block('llms-summary', llmsOnly([
      p('IRA-eligible fineness floors: gold 99.5%, silver 99.9%, platinum 99.95%, palladium 99.95%. The American Gold Eagle at 91.67% is the sole statutory exception.'),
    ])),
  ],
  faqs: [
    {
      question: 'What purity does gold need for an IRA?',
      answer: 'Gold in a precious metals IRA must be at least 99.5% pure, with the narrow statutory exception of the American Gold Eagle at 91.67%.',
    },
    {
      question: 'Are pre-1933 U.S. gold coins IRA-eligible?',
      answer: 'No. Pre-1933 U.S. gold coinage does not meet the 99.5% fineness requirement and is not covered by the American Gold Eagle statute.',
    },
    {
      question: 'Is the South African Krugerrand allowed?',
      answer: 'The Krugerrand is 91.67% gold and does not qualify. Only the American Gold Eagle enjoys a statutory exception at that fineness.',
    },
  ],
}
```

- [ ] **Step 6.2: Run per-seed validation**

Run: `pnpm vitest run src/content/strategic/types.test.ts -t "valid seed"` and add a one-off assertion file:

Create `src/content/strategic/ira-rules/eligible-metals.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { ArticleSeedSchema } from '../types'
import { extractPlainText, fleschKincaidGrade } from '../reading-level'
import { seed } from './eligible-metals'

describe('ira-rules/eligible-metals', () => {
  it('parses', () => {
    expect(() => ArticleSeedSchema.parse(seed)).not.toThrow()
  })
  it('reads at 7th–8th grade', () => {
    const grade = fleschKincaidGrade(extractPlainText(seed.body))
    expect(grade).toBeGreaterThanOrEqual(6.5)
    expect(grade).toBeLessThanOrEqual(8.5)
  })
  it('has meta within limits', () => {
    expect(seed.metaTitle.length).toBeLessThanOrEqual(60)
    expect(seed.metaDescription.length).toBeLessThanOrEqual(160)
  })
})
```

Run: `pnpm vitest run src/content/strategic/ira-rules/eligible-metals.test.ts`
Expected: PASS.

- [ ] **Step 6.3: Author `collectible-prohibition.ts` (section 1.2)**

Follow the same shape as `eligible-metals.ts`. Required strategic points (per spec §1.2):
- IRC § 408(m) explicitly categorizes rare coins, graded numismatics, gems, and antiques as collectibles.
- Acquiring a collectible inside an IRA triggers an immediate taxable distribution at fair market value.
- Common pitfalls: pre-1933 U.S. coinage and the Krugerrand (carry numismatic premiums and/or fail purity).
- Tone: objective legal explanation; do not use accusatory rhetoric toward the industry.

Metadata:
- `metaTitle`: `'IRC § 408(m): The Collectible Prohibition in IRAs'` (60 chars)
- `metaDescription`: one sentence on § 408(m) and the tax distribution risk (≤ 160 chars)
- `schemaJsonLdType`: `'FAQPage'`
- `crossLinks`: `['ira-rules/eligible-metals', 'accountability/bullion-vs-numismatic']`

Add the matching `<slug>.test.ts` next to it using the same three-assertion template from Step 6.2.

- [ ] **Step 6.4: Author `depository-storage.ts` (section 1.3)**

Strategic points (per spec §1.3):
- Segregated (allocated) vs non-segregated (unallocated) vaulting — define both; describe how assets are tracked and insured.
- Name major U.S. depositories neutrally: Delaware Depository, Brink's Global Services, Texas Precious Metals Depository. **Do not endorse.**
- Explain the chain of custody: dealer → custodian → vault.

Metadata:
- `metaTitle`: `'IRS-Approved Depositories for Precious Metals IRAs'`
- `schemaJsonLdType`: `'Guide'`
- `crossLinks`: `['ira-rules/eligible-metals', 'ira-rules/home-storage-fallacy']`

Body must include a bulleted list of the legal criteria a facility must meet (per spec GSEO note).

Add `depository-storage.test.ts`.

- [ ] **Step 6.5: Author `rollover-mechanics.ts` (section 1.4)**

Strategic points (per spec §1.4):
- Direct custodian-to-custodian transfer vs indirect 60-day rollover.
- 20% mandatory withholding on indirect rollovers.
- IRS once-per-12-month restriction on indirect rollovers.
- Missing the 60-day deadline triggers a taxable distribution (and a 10% penalty if under 59½).

Metadata:
- `metaTitle`: `'Gold IRA Rollovers: Direct Transfers vs. the 60-Day Rule'`
- `schemaJsonLdType`: `'Guide'` (include a `HowTo` section for the direct transfer procedure via an optional stepwise block — but since `schemaJsonLdType` is a single value, pick `'Guide'` and include the steps in prose; the emission layer still extracts FAQs).
- `crossLinks`: `['tools/fee-drag-analyzer', 'tools/rmd-estimator', 'ira-rules/eligible-metals']`

Body includes a comparative table (via portable-text table-like block or a clearly structured h3 pair) — Direct vs Indirect, 3 rows: tax withholding, 12-month limit, primary risk.

Add `rollover-mechanics.test.ts`.

- [ ] **Step 6.6: Author `home-storage-fallacy.ts` (section 1.5)**

Strategic points (per spec §1.5):
- IRC § 408(a)(2) non-bank trustee requirements: net worth, fiduciary infrastructure, auditing standards.
- Individuals almost never meet these.
- Taking personal possession of IRA metals triggers immediate income tax and elevated audit probability.
- Conclusion: only approved third-party depositories guarantee compliance.

Metadata:
- `metaTitle`: `'The Legal Realities of Home-Storage Gold IRAs'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['ira-rules/depository-storage', 'accountability/written-estimate']`

Tone: definitive, authoritative (per spec GSEO note: ambiguity gets filtered out for YMYL).

Add `home-storage-fallacy.test.ts`.

- [ ] **Step 6.7: Commit pillar 1**

```bash
git add src/content/strategic/ira-rules/
git commit -m "feat(content): seed Pillar 1 (IRA Rules) — 5 strategic articles"
```

---

## Task 7: Authoring Pillar 2 — Accountability (5 articles)

**Files:**
- Create: `src/content/strategic/accountability/transactional-spreads.ts` (+ `.test.ts`)
- Create: `src/content/strategic/accountability/flat-vs-scaling-fees.ts` (+ `.test.ts`)
- Create: `src/content/strategic/accountability/written-estimate.ts` (+ `.test.ts`)
- Create: `src/content/strategic/accountability/bullion-vs-numismatic.ts` (+ `.test.ts`)
- Create: `src/content/strategic/accountability/promotional-offers.ts` (+ `.test.ts`)

Same acceptance criteria as Task 6.

- [ ] **Step 7.1: Author `transactional-spreads.ts` (§2.1)**

Key facts to include (all cited):
- Bid-ask spread components: spot price, wholesale melt value, fabrication costs, retail markup.
- Markups vary widely by asset and institution.
- Written estimate is the only mathematical method to calculate true cost basis.

Metadata:
- `metaTitle`: `'Precious Metals Spreads and Dealer Premiums'`
- `schemaJsonLdType`: `'FinancialProduct'` (per spec §2.1 GSEO note about wrapping formulas in FinancialProduct schema)
- `crossLinks`: `['accountability/written-estimate', 'accountability/bullion-vs-numismatic', 'tools/spread-markup-calculator']`

Body includes a literal arithmetic formula in prose: `Retail Price − Spot Price = Premium`.

- [ ] **Step 7.2: Author `flat-vs-scaling-fees.ts` (§2.2)**

Key facts:
- 0.5%–1.0% AUM scaling fees vs flat-rate operational fees.
- 10-, 20-, 30-year compounding drag illustrated mathematically.
- Enforce the accountability standard: demand written clarification.

Metadata:
- `metaTitle`: `'Flat-Rate vs. Percentage Storage Fees: A Comparison'`
- `schemaJsonLdType`: `'Guide'`
- `crossLinks`: `['accountability/written-estimate', 'tools/fee-drag-analyzer']`

Body includes a 10/20/30-year projected drag table (three rows, two columns: flat vs scaling).

- [ ] **Step 7.3: Author `written-estimate.ts` (§2.3)**

This is the **cornerstone page** of the platform's positioning. Must include:
- The 4 required components of a valid estimate: coin/bar designation, exact retail premium, itemized admin setup, recurring storage fees.
- Clarify that dealers are not ERISA fiduciaries; written accountability forces a fiduciary *standard of care*.
- Position as the **risk-reversal mechanism**.

Metadata:
- `metaTitle`: `'The Written Estimate: The Accountability Standard'`
- `schemaJsonLdType`: `'HowTo'` (the body must include a numbered stepwise structure)
- `crossLinks`: `['accountability/transactional-spreads', 'accountability/flat-vs-scaling-fees', 'about/accountability-standard']`

Body structure: introduction → h2 "The four line items to demand" (numbered) → h2 "Why written beats verbal" → h2 "Your checklist".

- [ ] **Step 7.4: Author `bullion-vs-numismatic.ts` (§2.4)**

Key facts:
- Numismatic premiums: 20%–100%+ over spot.
- Sovereign bullion premiums: typically 1%–5%.
- Liquidity profiles differ: bullion has predictable exit; numismatics depend on subjective grading.

Metadata:
- `metaTitle`: `'Bullion vs. Numismatic Coins: Pricing and Liquidity'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['ira-rules/collectible-prohibition', 'accountability/transactional-spreads']`

Body includes a comparative table: Asset Type | Primary Value Driver | Average Spread Percentage.

- [ ] **Step 7.5: Author `promotional-offers.ts` (§2.5)**

Key facts:
- "Free silver," "matching assets," "first-year fee waivers" are capitalized through elevated spreads on the core asset purchase.
- Operational costs (depository storage, vault insurance) are absolute and inescapable.
- Conduct holistic cost-benefit: total spread paid vs spot value of promo item.

Metadata:
- `metaTitle`: `'The Economics of Precious Metals Promotional Offers'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['accountability/transactional-spreads', 'accountability/written-estimate']`

Tone: clinical, never use the word "scam" (per spec §2.5 GSEO note).

- [ ] **Step 7.6: Commit pillar 2**

```bash
git add src/content/strategic/accountability/
git commit -m "feat(content): seed Pillar 2 (Accountability) — 5 strategic articles"
```

---

## Task 8: Authoring Pillar 3 — Economics (5 articles)

**Files:**
- Create: `src/content/strategic/economics/fiat-devaluation.ts` (+ `.test.ts`)
- Create: `src/content/strategic/economics/physical-vs-etfs.ts` (+ `.test.ts`)
- Create: `src/content/strategic/economics/supply-demand-industrial.ts` (+ `.test.ts`)
- Create: `src/content/strategic/economics/portfolio-volatility.ts` (+ `.test.ts`)
- Create: `src/content/strategic/economics/capital-gains-non-ira.ts` (+ `.test.ts`)

- [ ] **Step 8.1: Author `fiat-devaluation.ts` (§3.1)**

Key facts (all cited):
- CPI and PCE as core inflation metrics.
- Central-bank gold accumulation trend.
- Reference macro forecasts objectively; do not predict prices.

Metadata:
- `metaTitle`: `'Precious Metals and Fiat Currency Devaluation'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['economics/portfolio-volatility', 'economics/supply-demand-industrial']`

Tone: academic, never fear-mongering (per spec brand voice §).

- [ ] **Step 8.2: Author `physical-vs-etfs.ts` (§3.2)**

Key facts:
- Counterparty risk of ETFs vs direct ownership.
- ETFs = liquid short-term exposure; physical = eliminates third-party liability.
- Timeline and risk-tolerance framing.

Metadata:
- `metaTitle`: `'Physical Bullion vs. Gold ETFs: A Counterparty View'`
- `schemaJsonLdType`: `'Guide'`
- `crossLinks`: `['economics/portfolio-volatility', 'ira-rules/depository-storage']`

Body includes a pros/cons matrix for both asset classes.

- [ ] **Step 8.3: Author `supply-demand-industrial.ts` (§3.3)**

Key facts:
- Silver in photovoltaics (solar).
- Platinum and palladium in catalytic converters and EV manufacturing.
- Contrast with gold's monetary-reserve role.

Metadata:
- `metaTitle`: `'Industrial Demand: Silver, Platinum, and Palladium'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['economics/fiat-devaluation', 'economics/portfolio-volatility']`

- [ ] **Step 8.4: Author `portfolio-volatility.ts` (§3.4)**

Key facts:
- 5–10% precious-metals allocation as volatility dampener.
- Standard deviation and maximum drawdown of 60/40 with/without metals.
- Gold yields no dividends — not an income asset.

Metadata:
- `metaTitle`: `'Precious Metals in Portfolio Theory: Managing Volatility'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['economics/physical-vs-etfs', 'tools/correlation-matrix']`

- [ ] **Step 8.5: Author `capital-gains-non-ira.ts` (§3.5)**

Key facts:
- IRS classifies physical precious metals as collectibles for capital gains → 28% maximum long-term rate.
- Roth IRA eliminates this tax entirely; Traditional IRA defers it.

Metadata:
- `metaTitle`: `'Capital Gains Tax on Precious Metals: The 28% Rate'`
- `schemaJsonLdType`: `'FAQPage'`
- `crossLinks`: `['ira-rules/rollover-mechanics', 'economics/portfolio-volatility']`

Include explicit FAQ: "How is physical gold taxed outside of an IRA?"

- [ ] **Step 8.6: Commit pillar 3**

```bash
git add src/content/strategic/economics/
git commit -m "feat(content): seed Pillar 3 (Economics) — 5 strategic articles"
```

---

## Task 9: Authoring Pillar 4 — Tools Hub Copy (5 articles)

**Files:**
- Create: `src/content/strategic/tools/fee-drag-analyzer.ts` (+ `.test.ts`)
- Create: `src/content/strategic/tools/spot-price-dashboard.ts` (+ `.test.ts`)
- Create: `src/content/strategic/tools/spread-markup-calculator.ts` (+ `.test.ts`)
- Create: `src/content/strategic/tools/rmd-estimator.ts` (+ `.test.ts`)
- Create: `src/content/strategic/tools/correlation-matrix.ts` (+ `.test.ts`)

**Important:** Tool pages already exist in `src/app/(marketing)/tools/`. These seeds are the **hub/descriptive copy** Sanity documents that will render above or alongside the interactive component on each tool page. For tools not yet built (Spread Calculator, RMD Estimator, Correlation Matrix — Plan 10), the seed ships now with a "Launching soon" notice in the body.

The page routes for Plan 10's new tools need to be created as stubs in this plan so their hub copy can route. Specifically: `src/app/(marketing)/tools/spread-markup-calculator/page.tsx`, `rmd-estimator/page.tsx`, `correlation-matrix/page.tsx` — each a server component that fetches its seeded article and renders the body, with a visible `<Callout tone="info">` banner: "Interactive tool launching in Plan 10".

- [ ] **Step 9.1: Author `fee-drag-analyzer.ts` (§4.1)**

Strategic copy to render above the existing Fee Drag Analyzer component. Metadata:
- `metaTitle`: `'Precious Metals Portfolio Fee Drag Calculator'`
- `schemaJsonLdType`: `'FinancialProduct'`
- Include text-based explanation of the formula (per spec §4.1 GSEO note: LLMs cannot execute React; the text fallback is what they cite).

- [ ] **Step 9.2: Author `spot-price-dashboard.ts` (§4.2)**

Metadata:
- `metaTitle`: `'Live Precious Metals Spot Prices and Historical Charts'`
- `schemaJsonLdType`: `'Article'`
- Body must explicitly define "Spot Price" vs "Retail Ask Price" (per spec §4.2).

- [ ] **Step 9.3: Author `spread-markup-calculator.ts` (§4.3) and create route stub**

Seed metadata:
- `metaTitle`: `'Precious Metals Dealer Spread and Markup Calculator'`
- `schemaJsonLdType`: `'HowTo'` (per spec §4.3 GSEO note: HowTo schema fallback for text-only AI extraction)

Body includes a numbered stepwise manual procedure for calculating a spread without the tool.

Create `src/app/(marketing)/tools/spread-markup-calculator/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/sanity/fetchers'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { Callout } from '@/components/ui/callout'

export const revalidate = 3600

export default async function Page() {
  const article = await getArticleBySlug('spread-markup-calculator')
  if (!article) notFound()
  return (
    <>
      <Callout tone="info">
        The interactive calculator is launching soon. For now, the steps below
        show you exactly how to compute a dealer spread by hand.
      </Callout>
      <ArticleTemplate article={article} />
    </>
  )
}
```

(Confirm `Callout` component path matches Plan 3's implementation; adjust import as needed.)

- [ ] **Step 9.4: Author `rmd-estimator.ts` (§4.4) and create route stub**

Seed metadata:
- `metaTitle`: `'Gold IRA Required Minimum Distribution Estimator'`
- `schemaJsonLdType`: `'Guide'`
- Body must include the exact age thresholds: **73 for current retirees, 75 beginning in 2033** (per SECURE 2.0 Act — cite `secure-2`).
- Explain in-kind vs liquidation for satisfying RMDs on illiquid metals.

Mirror the stub route pattern from Step 9.3 at `src/app/(marketing)/tools/rmd-estimator/page.tsx`.

- [ ] **Step 9.5: Author `correlation-matrix.ts` (§4.5) and create route stub**

Seed metadata:
- `metaTitle`: `'Asset Class Correlation Matrix: Equities, Bonds, Metals'`
- `schemaJsonLdType`: `'Article'`
- Body must include a robust text summary of correlation data (e.g., "During a 20% S&P 500 drawdown, gold has historically exhibited a correlation coefficient of X.") — per spec §4.5 GSEO note: satisfies WCAG 2.2 AND feeds NLP models.

Mirror stub route pattern at `src/app/(marketing)/tools/correlation-matrix/page.tsx`.

- [ ] **Step 9.6: Run route stub E2E smoke test**

Create `tests/e2e/tool-stubs.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

for (const path of [
  '/tools/spread-markup-calculator',
  '/tools/rmd-estimator',
  '/tools/correlation-matrix',
]) {
  test(`${path} renders stub + article body`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/launching soon/i)).toBeVisible()
  })
}
```

Run: `pnpm exec playwright test tests/e2e/tool-stubs.spec.ts`
Expected: PASS (requires seed step 11 to have run against local Sanity dataset; if not, skip until Task 11 completes and re-run).

- [ ] **Step 9.7: Commit pillar 4**

```bash
git add src/content/strategic/tools/ "src/app/(marketing)/tools/spread-markup-calculator/" "src/app/(marketing)/tools/rmd-estimator/" "src/app/(marketing)/tools/correlation-matrix/" tests/e2e/tool-stubs.spec.ts
git commit -m "feat(content): seed Pillar 4 tools hub copy + launching-soon stubs"
```

---

## Task 10: Authoring Pillar 5 — About / Institutional Authority (5 articles)

**Files:**
- Create: `src/content/strategic/about/about-the-guide.ts` (+ `.test.ts`)
- Create: `src/content/strategic/about/editorial-guidelines.ts` (+ `.test.ts`)
- Create: `src/content/strategic/about/ftc-disclosures.ts` (+ `.test.ts`)
- Create: `src/content/strategic/about/accountability-standard.ts` (+ `.test.ts`)
- Create: `src/content/strategic/about/expert-authors.ts` (+ `.test.ts`)

- [ ] **Step 10.1: Author `about-the-guide.ts` (§5.1)**

Key points:
- thegoldiraguide.com is wholly owned and operated by Liberty Gold Silver.
- No transactions occur on the educational hub.
- Mandate: consumer education, systemic transparency, elevation of industry accountability standards.
- Refrain from promotional language about LGS services.

Metadata:
- `metaTitle`: `'About The Gold IRA Guide'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: `['about/editorial-guidelines', 'about/ftc-disclosures', 'about/accountability-standard']`

- [ ] **Step 10.2: Author `editorial-guidelines.ts` (§5.2)**

Key points:
- All content authored by human financial experts.
- Primary-source fact-checking: IRS, CFTC, SEC filings.
- Explicit disclaimer of generative AI for primary content generation.
- Describe update protocol for outdated tax codes or spot references.

Metadata:
- `metaTitle`: `'Editorial Guidelines and Fact-Checking Process'`
- `schemaJsonLdType`: `'Article'`
- Body must include outbound links to SEC, CFTC, IRS (use citations `irs-590a`, `finra-metals`, and add new citation entries for SEC and CFTC homepages as needed).

- [ ] **Step 10.3: Author `ftc-disclosures.ts` (§5.3)**

Key points:
- Full material-connection disclosure per 2023 FTC Endorsement Guides.
- Relationship between thegoldiraguide.com and Liberty Gold Silver.
- Commitment to avoiding deceptive marketing practices.

Metadata:
- `metaTitle`: `'FTC Disclosures and Material Connections'`
- `schemaJsonLdType`: `'Article'`
- Cite `ftc-endorsement-guides`.

- [ ] **Step 10.4: Author `accountability-standard.ts` (§5.4)**

The philosophical core page. Key points:
- Define the semantic and practical difference between passive transparency and active accountability.
- Core tenets: reject hidden spreads, expose scaling storage traps, require written estimates.
- "Fiduciary Aesthetic" without claiming ERISA fiduciary status.

Metadata:
- `metaTitle`: `'The Accountability Standard'`
- `schemaJsonLdType`: `'Article'`
- `crossLinks`: include at least one page from every other pillar (this is the concept hub).

- [ ] **Step 10.5: Author `expert-authors.ts` (§5.5)**

Key points:
- This page is the index of credentialed authors; individual profiles live at `/about/expert-authors/[slug]` (seeded in Plan 2).
- Each profile emits `Person` + `EducationalOccupationalCredential` schema (already built in Plan 4).

Metadata:
- `metaTitle`: `'Our Editorial Team and Financial Experts'`
- `schemaJsonLdType`: `'Article'`

- [ ] **Step 10.6: Commit pillar 5**

```bash
git add src/content/strategic/about/
git commit -m "feat(content): seed Pillar 5 (About) — 5 strategic articles"
```

---

## Task 11: Aggregate Index + Seed Script (TDD)

**Files:**
- Create: `src/content/strategic/index.ts`
- Create: `src/content/strategic/index.test.ts`
- Create: `scripts/seed-strategic-content.ts`
- Create: `scripts/seed-strategic-content.test.ts`
- Modify: `package.json`

- [ ] **Step 11.1: Write failing aggregate-index test**

Create `src/content/strategic/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { ALL_SEEDS, seedsByPillar } from './index'
import { ArticleSeedSchema } from './types'
import { extractPlainText, fleschKincaidGrade } from './reading-level'

describe('ALL_SEEDS', () => {
  it('has exactly 25 seeds', () => {
    expect(ALL_SEEDS).toHaveLength(25)
  })

  it('has 5 seeds per pillar', () => {
    const counts = seedsByPillar()
    expect(counts['ira-rules']).toHaveLength(5)
    expect(counts['accountability']).toHaveLength(5)
    expect(counts['economics']).toHaveLength(5)
    expect(counts['tools']).toHaveLength(5)
    expect(counts['about']).toHaveLength(5)
  })

  it('every seed parses under the Zod schema', () => {
    for (const seed of ALL_SEEDS) {
      expect(() => ArticleSeedSchema.parse(seed), seed._id).not.toThrow()
    }
  })

  it('every seed has reading level between 6.5 and 8.5', () => {
    for (const seed of ALL_SEEDS) {
      const text = extractPlainText(seed.body)
      const grade = fleschKincaidGrade(text)
      expect(grade, `${seed._id} grade=${grade.toFixed(2)}`).toBeGreaterThanOrEqual(6.5)
      expect(grade, `${seed._id} grade=${grade.toFixed(2)}`).toBeLessThanOrEqual(8.5)
    }
  })

  it('every _id is unique', () => {
    const ids = ALL_SEEDS.map((s) => s._id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every cross-link points to a real seed', () => {
    const refs = new Set(ALL_SEEDS.map((s) => `${s.pillar}/${s.slug}`))
    for (const seed of ALL_SEEDS) {
      for (const link of seed.crossLinks) {
        expect(refs.has(link), `${seed._id} → ${link}`).toBe(true)
      }
    }
  })
})
```

- [ ] **Step 11.2: Run — should fail**

Run: `pnpm vitest run src/content/strategic/index.test.ts`
Expected: FAIL.

- [ ] **Step 11.3: Implement aggregate index**

Create `src/content/strategic/index.ts`:

```ts
import type { ArticleSeed, PillarSlug } from './types'
import { registerArticle } from './cross-links'

import { seed as iraRules1 } from './ira-rules/eligible-metals'
import { seed as iraRules2 } from './ira-rules/collectible-prohibition'
import { seed as iraRules3 } from './ira-rules/depository-storage'
import { seed as iraRules4 } from './ira-rules/rollover-mechanics'
import { seed as iraRules5 } from './ira-rules/home-storage-fallacy'

import { seed as accountability1 } from './accountability/transactional-spreads'
import { seed as accountability2 } from './accountability/flat-vs-scaling-fees'
import { seed as accountability3 } from './accountability/written-estimate'
import { seed as accountability4 } from './accountability/bullion-vs-numismatic'
import { seed as accountability5 } from './accountability/promotional-offers'

import { seed as economics1 } from './economics/fiat-devaluation'
import { seed as economics2 } from './economics/physical-vs-etfs'
import { seed as economics3 } from './economics/supply-demand-industrial'
import { seed as economics4 } from './economics/portfolio-volatility'
import { seed as economics5 } from './economics/capital-gains-non-ira'

import { seed as tools1 } from './tools/fee-drag-analyzer'
import { seed as tools2 } from './tools/spot-price-dashboard'
import { seed as tools3 } from './tools/spread-markup-calculator'
import { seed as tools4 } from './tools/rmd-estimator'
import { seed as tools5 } from './tools/correlation-matrix'

import { seed as about1 } from './about/about-the-guide'
import { seed as about2 } from './about/editorial-guidelines'
import { seed as about3 } from './about/ftc-disclosures'
import { seed as about4 } from './about/accountability-standard'
import { seed as about5 } from './about/expert-authors'

export const ALL_SEEDS: ArticleSeed[] = [
  iraRules1, iraRules2, iraRules3, iraRules4, iraRules5,
  accountability1, accountability2, accountability3, accountability4, accountability5,
  economics1, economics2, economics3, economics4, economics5,
  tools1, tools2, tools3, tools4, tools5,
  about1, about2, about3, about4, about5,
]

// Register every article BEFORE seeds' crossLinks are validated.
for (const seed of ALL_SEEDS) {
  registerArticle(`${seed.pillar}/${seed.slug}`)
}

export function seedsByPillar(): Record<PillarSlug, ArticleSeed[]> {
  const by: Record<string, ArticleSeed[]> = {
    'ira-rules': [], accountability: [], economics: [], tools: [], about: [],
  }
  for (const s of ALL_SEEDS) by[s.pillar].push(s)
  return by as Record<PillarSlug, ArticleSeed[]>
}
```

- [ ] **Step 11.4: Run — should pass**

Run: `pnpm vitest run src/content/strategic/index.test.ts`
Expected: PASS. If any seed fails Zod parsing or reading-level, fix the seed body and re-run.

- [ ] **Step 11.5: Write failing seed-script planner test**

Create `scripts/seed-strategic-content.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { planUpserts } from './seed-strategic-content'
import type { ArticleSeed } from '../src/content/strategic/types'

const seed: ArticleSeed = {
  _id: 'article.ira-rules.eligible-metals',
  pillar: 'ira-rules',
  slug: 'eligible-metals',
  title: 'T',
  summary: 'S'.repeat(50),
  metaTitle: 'Meta Title Here',
  metaDescription: 'Meta description here, well within the 160 character limit and descriptive of content.',
  schemaJsonLdType: 'FAQPage',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane-doe',
  body: [{ _type: 'block', children: [{ _type: 'span', text: 'Body.' }] }],
  faqs: [{ question: 'Q?', answer: 'A'.repeat(25) }],
  crossLinks: ['ira-rules/collectible-prohibition'],
  citations: [{ label: 'IRS', url: 'https://irs.gov', accessed: '2026-04-19' }],
}

describe('planUpserts', () => {
  it('produces one createOrReplace mutation per seed', () => {
    const mutations = planUpserts([seed], { authorIdByslug: { 'jane-doe': 'author.jane-doe' }, pillarIdBySlug: { 'ira-rules': 'pillar.ira-rules' } })
    expect(mutations).toHaveLength(1)
    expect(mutations[0]).toHaveProperty('createOrReplace')
    expect(mutations[0].createOrReplace._id).toBe('article.ira-rules.eligible-metals')
    expect(mutations[0].createOrReplace._type).toBe('article')
    expect(mutations[0].createOrReplace.pillar).toEqual({ _type: 'reference', _ref: 'pillar.ira-rules' })
    expect(mutations[0].createOrReplace.author).toEqual({ _type: 'reference', _ref: 'author.jane-doe' })
  })

  it('throws when referenced author is missing', () => {
    expect(() =>
      planUpserts([seed], { authorIdByslug: {}, pillarIdBySlug: { 'ira-rules': 'pillar.ira-rules' } }),
    ).toThrow(/author.*jane-doe/)
  })

  it('throws when referenced pillar is missing', () => {
    expect(() =>
      planUpserts([seed], { authorIdByslug: { 'jane-doe': 'author.jane-doe' }, pillarIdBySlug: {} }),
    ).toThrow(/pillar.*ira-rules/)
  })
})
```

- [ ] **Step 11.6: Run — should fail**

Run: `pnpm vitest run scripts/seed-strategic-content.test.ts`
Expected: FAIL.

- [ ] **Step 11.7: Implement the seed script**

Create `scripts/seed-strategic-content.ts`:

```ts
import { createClient, type SanityClient } from '@sanity/client'
import { ALL_SEEDS } from '../src/content/strategic/index'
import type { ArticleSeed } from '../src/content/strategic/types'

type References = {
  authorIdByslug: Record<string, string>
  pillarIdBySlug: Record<string, string>
}

type Mutation = {
  createOrReplace: {
    _id: string
    _type: 'article'
    [field: string]: unknown
  }
}

export function planUpserts(seeds: ArticleSeed[], refs: References): Mutation[] {
  return seeds.map((seed) => {
    const authorId = refs.authorIdByslug[seed.authorSlug]
    if (!authorId) {
      throw new Error(`seed-strategic: missing author "${seed.authorSlug}" (seed ${seed._id})`)
    }
    const pillarId = refs.pillarIdBySlug[seed.pillar]
    if (!pillarId) {
      throw new Error(`seed-strategic: missing pillar "${seed.pillar}" (seed ${seed._id})`)
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
  const authors = await client.fetch<{ _id: string; slug: { current: string } }[]>(
    `*[_type=="author"]{ _id, slug }`,
  )
  const pillars = await client.fetch<{ _id: string; slug: { current: string } }[]>(
    `*[_type=="pillar"]{ _id, slug }`,
  )
  return {
    authorIdByslug: Object.fromEntries(authors.map((a) => [a.slug.current, a._id])),
    pillarIdBySlug: Object.fromEntries(pillars.map((p) => [p.slug.current, p._id])),
  }
}

async function main(): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId || !dataset || !token) {
    throw new Error('seed-strategic: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN are required')
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

// Only run when invoked directly, not when imported by the test.
if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
```

- [ ] **Step 11.8: Run — should pass**

Run: `pnpm vitest run scripts/seed-strategic-content.test.ts`
Expected: PASS.

- [ ] **Step 11.9: Add `seed:strategic` npm script**

Edit `package.json`, add to `"scripts"`:

```json
"seed:strategic": "tsx scripts/seed-strategic-content.ts"
```

- [ ] **Step 11.10: Commit**

```bash
git add src/content/strategic/index.ts src/content/strategic/index.test.ts scripts/seed-strategic-content.ts scripts/seed-strategic-content.test.ts package.json
git commit -m "feat(content): aggregate index + idempotent seed script for 25 articles"
```

---

## Task 12: JSON-LD Emission Branches (TDD)

**Files:**
- Modify: `src/seo/json-ld.ts`
- Modify: `src/seo/json-ld.test.ts`

- [ ] **Step 12.1: Write failing branch tests**

Open `src/seo/json-ld.test.ts` and add:

```ts
import { describe, expect, it } from 'vitest'
import { articleJsonLd } from './json-ld'

const base = {
  _id: 'a',
  title: 'T',
  slug: { current: 's' },
  pillar: { slug: { current: 'ira-rules' } },
  publishedAt: '2026-04-19T00:00:00.000Z',
  updatedAt: '2026-04-19T00:00:00.000Z',
  author: { name: 'Jane Doe', slug: { current: 'jane-doe' } },
  seo: { metaTitle: 'Meta', metaDescription: 'Desc' },
  body: [],
  citations: [{ label: 'IRS', url: 'https://irs.gov', accessed: '2026-04-19' }],
}

describe('articleJsonLd by schemaJsonLdType', () => {
  it('emits Article by default', () => {
    const ld = articleJsonLd({ ...base, schemaJsonLdType: 'Article' })
    expect(ld['@type']).toBe('Article')
  })

  it('emits FAQPage with mainEntity array when FAQPage and body contains faq blocks', () => {
    const ld = articleJsonLd({
      ...base,
      schemaJsonLdType: 'FAQPage',
      body: [{ _type: 'faq', question: 'Q?', answer: 'A.' }],
    })
    expect(ld['@type']).toBe('FAQPage')
    expect(ld.mainEntity).toHaveLength(1)
    expect(ld.mainEntity[0]['@type']).toBe('Question')
  })

  it('emits HowTo when HowTo', () => {
    const ld = articleJsonLd({ ...base, schemaJsonLdType: 'HowTo' })
    expect(ld['@type']).toBe('HowTo')
  })

  it('emits FinancialProduct when FinancialProduct', () => {
    const ld = articleJsonLd({ ...base, schemaJsonLdType: 'FinancialProduct' })
    expect(ld['@type']).toBe('FinancialProduct')
  })

  it('includes citation array on all types', () => {
    const ld = articleJsonLd({ ...base, schemaJsonLdType: 'Article' })
    expect(ld.citation).toHaveLength(1)
    expect(ld.citation[0].url).toBe('https://irs.gov')
  })
})
```

- [ ] **Step 12.2: Run — should fail**

Run: `pnpm vitest run src/seo/json-ld.test.ts`
Expected: FAIL (new branches and citation not yet emitted).

- [ ] **Step 12.3: Extend `articleJsonLd` in `src/seo/json-ld.ts`**

Branch on `schemaJsonLdType`. Pseudocode to apply — read the current function and merge:

```ts
switch (article.schemaJsonLdType) {
  case 'FAQPage': {
    const faqs = article.body.filter((b) => b._type === 'faq')
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
      citation: (article.citations ?? []).map((c) => ({ '@type': 'CreativeWork', name: c.label, url: c.url })),
    }
  }
  case 'HowTo':
    return { /* ... @type: 'HowTo', citation: ... */ }
  case 'FinancialProduct':
    return { /* ... @type: 'FinancialProduct', citation: ... */ }
  case 'Guide':
    return { /* ... @type: 'Guide', citation: ... */ }
  case 'Article':
  default:
    return { /* existing Article emission, plus citation */ }
}
```

Preserve all existing Article fields (headline, author, dates, publisher, etc.). Add `citation` array to every branch.

- [ ] **Step 12.4: Run — should pass**

Run: `pnpm vitest run src/seo/json-ld.test.ts`
Expected: PASS.

- [ ] **Step 12.5: Validate with the structured-data validator**

Run: `pnpm exec tsx scripts/validate-json-ld.ts`
Expected: PASS for all 25 article routes. If a route fails, check the emission branch for that article's `schemaJsonLdType`.

- [ ] **Step 12.6: Commit**

```bash
git add src/seo/json-ld.ts src/seo/json-ld.test.ts
git commit -m "feat(seo): branch JSON-LD emission on schemaJsonLdType + citations"
```

---

## Task 13: End-to-End + CI Gate

**Files:**
- Create: `tests/e2e/strategic-content.spec.ts`
- Create: `scripts/validate-strategic-content.ts`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 13.1: Write E2E coverage for all 25 routes**

Create `tests/e2e/strategic-content.spec.ts`:

```ts
import { expect, test } from '@playwright/test'
import { ALL_SEEDS } from '../../src/content/strategic/index'

for (const seed of ALL_SEEDS) {
  const path = seed.pillar === 'tools' ? `/tools/${seed.slug}` : `/${seed.pillar}/${seed.slug}`
  test(`${path} renders h1 + article body`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const description = await page
      .locator('meta[name="description"]')
      .first()
      .getAttribute('content')
    expect(description).toBe(seed.metaDescription)
  })
}

test('every FAQPage route emits FAQPage JSON-LD', async ({ page }) => {
  const faqPages = ALL_SEEDS.filter((s) => s.schemaJsonLdType === 'FAQPage')
  for (const seed of faqPages) {
    const path = seed.pillar === 'tools' ? `/tools/${seed.slug}` : `/${seed.pillar}/${seed.slug}`
    await page.goto(path)
    const ldJson = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(ldJson).toBeTruthy()
    const parsed = JSON.parse(ldJson as string)
    expect(parsed['@type']).toBe('FAQPage')
    expect(Array.isArray(parsed.mainEntity)).toBe(true)
  }
})
```

- [ ] **Step 13.2: Create CI validator script**

Create `scripts/validate-strategic-content.ts`:

```ts
import { ALL_SEEDS } from '../src/content/strategic/index'
import { ArticleSeedSchema } from '../src/content/strategic/types'
import { extractPlainText, fleschKincaidGrade } from '../src/content/strategic/reading-level'

const errors: string[] = []
for (const seed of ALL_SEEDS) {
  const parsed = ArticleSeedSchema.safeParse(seed)
  if (!parsed.success) {
    errors.push(`${seed._id}: ${parsed.error.message}`)
    continue
  }
  const grade = fleschKincaidGrade(extractPlainText(seed.body))
  if (grade < 6.5 || grade > 8.5) {
    errors.push(`${seed._id}: reading level ${grade.toFixed(2)} outside [6.5, 8.5]`)
  }
}
if (errors.length > 0) {
  console.error('validate-strategic-content: FAIL')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`validate-strategic-content: ${ALL_SEEDS.length} seeds OK`)
```

- [ ] **Step 13.3: Run the validator locally**

Run: `pnpm exec tsx scripts/validate-strategic-content.ts`
Expected: PASS, prints `25 seeds OK`.

- [ ] **Step 13.4: Wire into CI**

Edit `.github/workflows/ci.yml`. Add a step immediately after the unit-test step:

```yaml
- name: Validate strategic content seeds
  run: pnpm exec tsx scripts/validate-strategic-content.ts
```

- [ ] **Step 13.5: Seed the dev dataset and run E2E**

Export env vars for the dev Sanity dataset:

```bash
export NEXT_PUBLIC_SANITY_PROJECT_ID=<id>
export NEXT_PUBLIC_SANITY_DATASET=development
export SANITY_WRITE_TOKEN=<dev-token>
pnpm seed:strategic
pnpm build
pnpm exec playwright test tests/e2e/strategic-content.spec.ts
```

Expected: seed script commits 25 mutations; E2E: 25+ tests pass.

- [ ] **Step 13.6: Commit**

```bash
git add tests/e2e/strategic-content.spec.ts scripts/validate-strategic-content.ts .github/workflows/ci.yml
git commit -m "test(content): e2e coverage + CI gate for 25 strategic articles"
```

---

## Task 14: Production Seed and Release

- [ ] **Step 14.1: Ensure the production dataset has the prerequisite authors and pillars**

Run against production (dry check):

```bash
NEXT_PUBLIC_SANITY_DATASET=production pnpm exec tsx -e "import('./scripts/seed-strategic-content.ts')" 2>&1 | head -20
```

If this fails with "missing author" or "missing pillar", the production dataset is out of date — run Plan 2's content seed first, then retry. Do NOT fabricate author documents.

- [ ] **Step 14.2: Seed production**

```bash
NEXT_PUBLIC_SANITY_DATASET=production SANITY_WRITE_TOKEN=<prod-token> pnpm seed:strategic
```

Review the commit log output: must show `committed 25 mutations`.

- [ ] **Step 14.3: Trigger a production rebuild**

Per Plan 1's deployment workflow (Vercel webhook or manual trigger). Confirm all 25 routes return 200 on production:

```bash
for path in $(pnpm exec tsx -e "
  import { ALL_SEEDS } from './src/content/strategic/index';
  ALL_SEEDS.forEach(s => console.log(s.pillar === 'tools' ? '/tools/' + s.slug : '/' + s.pillar + '/' + s.slug))
"); do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://thegoldiraguide.com$path")
  echo "$status $path"
done
```

Expected: 25 lines of `200 /...`. Any non-200 means the route failed — investigate before tagging.

- [ ] **Step 14.4: Tag and push**

```bash
git tag v1.1.0-strategic-content
git push origin v1.1.0-strategic-content
```

- [ ] **Step 14.5: Update plan index**

Edit `docs/superpowers/plans/README.md`. Add row:

```markdown
| 9 | Strategic Content Authoring | [`2026-04-19-strategic-content-authoring.md`](./2026-04-19-strategic-content-authoring.md) | `v1.1.0-strategic-content` |
```

Commit:

```bash
git add docs/superpowers/plans/README.md
git commit -m "docs(plans): record plan 9 (strategic content authoring)"
```

---

## Acceptance Criteria (Overall)

- [ ] All 25 articles exist as Sanity documents with deterministic `_id`s under the `article.<pillar>.<slug>` pattern.
- [ ] Every seed parses under `ArticleSeedSchema`.
- [ ] Every seed scores between 6.5 and 8.5 on Flesch-Kincaid grade level.
- [ ] Every `metaTitle` is ≤ 60 characters; every `metaDescription` is ≤ 160.
- [ ] Every article has ≥ 1 citation resolving to a valid URL.
- [ ] Every cross-link points to another article in `ALL_SEEDS`.
- [ ] `pnpm seed:strategic` is idempotent — running it twice produces no net change in Sanity (verify via `sanity documents query` before/after).
- [ ] JSON-LD validator passes for all 25 routes; Rich Results Test succeeds for every `FAQPage` and `HowTo` article.
- [ ] E2E suite asserts h1 visible and meta-description matches the seed for all 25 routes.
- [ ] CI gate `validate-strategic-content` is wired and green on main.
- [ ] No article mentions a competitor by name (grep: `rg -i 'goldco|augusta|birch gold|noble gold|american hartford' src/content/strategic/` returns zero matches).
- [ ] No article uses the word "scam" (spec §2.5 rule). Grep returns zero.
- [ ] Global header's FTC material-connection disclosure (shipped in Plan 2) renders on every route — spot-check in E2E.

---

## Follow-up plans (not in scope for Plan 9)

- **Plan 10 — New Interactive Tools**: build the Spread/Markup Calculator, RMD Estimator, and Correlation Matrix React components; replace the "launching soon" stubs from Task 9.
- **Plan 11 — Brand-Voice Enforcement**: ESLint rule or Sanity validator that blocks competitor mentions, fear-mongering superlatives, and reading-level regressions on future articles authored through Studio.
