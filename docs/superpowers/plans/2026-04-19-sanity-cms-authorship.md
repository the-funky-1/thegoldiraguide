# Plan 2: Sanity CMS & Authorship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plan 1 (Foundation & Infrastructure) is shipped.

**Goal:** Back the site with Sanity CMS as the single source of truth for content. Model every editorial entity (Article, Author, Pillar, Fee Schedule, Editorial Guidelines, Expert Credential) as typed schemas, expose GROQ-backed fetchers to the Next.js app, wire ISR + on-demand revalidation, and render E-E-A-T signals ("Reviewed By", "Last Updated") on every Article — all without shipping the actual content or routes (those come in Plan 3).

**Architecture:** Co-located Sanity Studio at `/studio` inside the Next.js app. Schemas live in `src/sanity/schemas/`. All runtime fetching funnels through one typed client in `src/sanity/client.ts`. A single `<ArticleByline>` component owns the rendering of author + credentials + review + update metadata. An authenticated webhook at `/api/revalidate` triggers on-demand ISR. TypeScript types for every document are generated from schema via `sanity typegen`, not hand-maintained.

**Tech Stack additions (on top of Plan 1):** `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `@portabletext/react`, `groq`, `date-fns`, `zod` (webhook validation).

**Out of scope (deferred):** Pillar page routes and navigation (Plan 3), JSON-LD emission from schemas (Plan 4 — this plan stores the data, Plan 4 emits it), interactive calculators (Plan 5). This plan renders an `/articles/[slug]` demo route that proves the pipeline but is replaced by Plan 3.

---

## File Structure

- `sanity.config.ts` — Studio config, mounted at `/studio`
- `sanity.cli.ts` — CLI config
- `src/app/studio/[[...tool]]/page.tsx` — hosts Studio
- `src/app/api/revalidate/route.ts` — webhook consumer
- `src/app/articles/[slug]/page.tsx` — demo route (deleted by Plan 3)
- `src/sanity/client.ts` — read-only client
- `src/sanity/live-client.ts` — preview/draft client
- `src/sanity/env.ts` — typed env resolver
- `src/sanity/image.ts` — `urlForImage` helper
- `src/sanity/queries.ts` — GROQ string constants
- `src/sanity/fetchers.ts` — typed fetch wrappers
- `src/sanity/fetchers.test.ts`
- `src/sanity/schemas/index.ts` — schema registry
- `src/sanity/schemas/article.ts`
- `src/sanity/schemas/author.ts`
- `src/sanity/schemas/pillar.ts`
- `src/sanity/schemas/fee-schedule.ts`
- `src/sanity/schemas/editorial-guidelines.ts`
- `src/sanity/schemas/expert-credential.ts`
- `src/sanity/schemas/objects/seo.ts`
- `src/sanity/schemas/objects/reviewed-by.ts`
- `src/sanity/types.generated.ts` — `sanity typegen` output (gitignored rebuild target, committed for CI)
- `src/components/editorial/ArticleByline.tsx` + `.test.tsx`
- `src/components/editorial/ReviewedByBadge.tsx` + `.test.tsx`
- `src/components/editorial/PortableTextRenderer.tsx` + `.test.tsx`
- `src/components/editorial/LastUpdatedLabel.tsx` + `.test.tsx`
- `src/lib/date.ts` + `.test.ts`
- `tests/e2e/studio.spec.ts`
- `tests/e2e/revalidate.spec.ts`
- `.env.local` additions

Design rule: **No React component calls `sanityClient.fetch(...)` directly.** Every fetch goes through `src/sanity/fetchers.ts`, where queries are typed, cached, and revalidation-tagged. This keeps cache semantics auditable in one file.

---

## Task 1: Env, Dependencies, and Client Bootstrap

**Files:**
- Create: `src/sanity/env.ts`, `src/sanity/client.ts`, `src/sanity/live-client.ts`
- Modify: `.env.example`, `.env.local` (local only, gitignored)

- [ ] **Step 1.1: Install Sanity dependencies**

```bash
pnpm add sanity@^3.60.0 next-sanity@^9.4.0 @sanity/image-url @sanity/vision @portabletext/react groq date-fns zod
pnpm add -D @sanity/cli @sanity/types
```

- [ ] **Step 1.2: Extend `.env.example`**

Replace the commented-out block in `/opt/projects/thegoldiraguide/.env.example` with:

```env
# Public site URL used for canonical tags and absolute OG URLs.
NEXT_PUBLIC_SITE_URL=https://www.thegoldiraguide.com

# Sanity — Plan 2
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-01
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=

# Reserved for later plans:
# METALS_API_KEY=
```

- [ ] **Step 1.3: Create `.env.local`** (locally — this file is gitignored)

```bash
cp .env.example .env.local
# Fill NEXT_PUBLIC_SANITY_PROJECT_ID from a new Sanity project (see Step 1.8).
# SANITY_REVALIDATE_SECRET can be any 32-char random string: `openssl rand -hex 32`.
```

- [ ] **Step 1.4: Write typed env resolver**

Create `/opt/projects/thegoldiraguide/src/sanity/env.ts`:

```ts
function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export const sanityEnv = {
  projectId: required('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-04-01',
  // Read token is OPTIONAL. Absent = public dataset, present = preview/draft access.
  readToken: process.env.SANITY_API_READ_TOKEN ?? null,
  revalidateSecret: process.env.SANITY_REVALIDATE_SECRET ?? null,
} as const
```

- [ ] **Step 1.5: Write the read-only client**

Create `/opt/projects/thegoldiraguide/src/sanity/client.ts`:

```ts
import { createClient } from 'next-sanity'
import { sanityEnv } from './env'

export const sanityClient = createClient({
  projectId: sanityEnv.projectId,
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { enabled: false, studioUrl: '/studio' },
})
```

- [ ] **Step 1.6: Write the preview (draft) client**

Create `/opt/projects/thegoldiraguide/src/sanity/live-client.ts`:

```ts
import { createClient } from 'next-sanity'
import { sanityEnv } from './env'

export function livePreviewClient() {
  if (!sanityEnv.readToken) {
    throw new Error(
      'SANITY_API_READ_TOKEN is required to use the preview client.',
    )
  }
  return createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
    perspective: 'previewDrafts',
    token: sanityEnv.readToken,
    stega: { enabled: true, studioUrl: '/studio' },
  })
}
```

- [ ] **Step 1.7: Sanity CLI config**

Create `/opt/projects/thegoldiraguide/sanity.cli.ts`:

```ts
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
})
```

- [ ] **Step 1.8: Initialize the Sanity project (one-time manual step)**

Run interactively — this creates the project in Sanity Cloud:

```bash
pnpm exec sanity init --env=.env.local --create-project "thegoldiraguide" --dataset production --output-path ./.sanity-init
```

Expected: prints a `projectId`. Copy that value into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`, then:

```bash
rm -rf .sanity-init
```

(The init is only used to provision the remote project; we don't use its generated files.)

- [ ] **Step 1.9: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example src/sanity/env.ts src/sanity/client.ts src/sanity/live-client.ts sanity.cli.ts
git commit -m "feat(sanity): typed env, read-only and preview clients"
```

---

## Task 2: Core Document Schemas (TDD via shape tests)

**Files:**
- Create: all files under `src/sanity/schemas/`

Sanity schemas are declarative JSON-like objects. We unit-test their *shape* (required fields, validation, field names) rather than their runtime behavior. Shape tests catch breakage when someone renames a field or drops a validation.

- [ ] **Step 2.1: Reusable `seo` object**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/objects/seo.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (r) => r.max(70).warning('Keep under 70 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(160).warning('Keep under 160 characters'),
    }),
    defineField({
      name: 'noIndex',
      title: 'No-index',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
```

- [ ] **Step 2.2: Reusable `reviewedBy` object**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/objects/reviewed-by.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const reviewedBy = defineType({
  name: 'reviewedBy',
  title: 'Reviewed by',
  type: 'object',
  fields: [
    defineField({
      name: 'reviewer',
      title: 'Reviewer',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed at',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
  ],
})
```

- [ ] **Step 2.3: `author` document**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/author.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'jobTitle', type: 'string' }),
    defineField({ name: 'bio', type: 'text', rows: 5 }),
    defineField({ name: 'portrait', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'credentials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'expertCredential' }] }],
    }),
    defineField({
      name: 'socialProfiles',
      type: 'array',
      of: [
        defineField({
          name: 'profile',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: ['linkedin', 'twitter', 'sec-iapd', 'finra-brokercheck', 'other'],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (r) => r.required().uri({ scheme: ['https'] }),
            }),
          ],
        }),
      ],
    }),
  ],
})
```

- [ ] **Step 2.4: `expertCredential` document**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/expert-credential.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const expertCredential = defineType({
  name: 'expertCredential',
  title: 'Expert credential',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'credentialCategory',
      type: 'string',
      options: { list: ['degree', 'license', 'certification'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'recognizedBy',
      type: 'string',
      description: 'Issuing body — e.g., FINRA, CFP Board, Harvard Law School',
    }),
    defineField({ name: 'dateEarned', type: 'date' }),
    defineField({ name: 'verificationUrl', type: 'url' }),
  ],
})
```

- [ ] **Step 2.5: `pillar` document**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/pillar.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({
      name: 'order',
      type: 'number',
      description: '1..5 — controls nav order',
      validation: (r) => r.required().integer().min(1).max(5),
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
})
```

- [ ] **Step 2.6: `feeSchedule` document**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/fee-schedule.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const feeSchedule = defineType({
  name: 'feeSchedule',
  title: 'Fee schedule',
  type: 'document',
  description:
    'Our institutional fee schedule — the canonical written-estimate template that every calculator and JSON-LD payload references. Only Liberty Gold Silver documents are published; the platform never ingests competitor data.',
  fields: [
    defineField({ name: 'dealerName', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'dealerName', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'setupFeeUsd', type: 'number', validation: (r) => r.min(0) }),
    defineField({ name: 'annualAdminFeeUsd', type: 'number', validation: (r) => r.min(0) }),
    defineField({
      name: 'storageModel',
      type: 'string',
      options: { list: ['flat', 'scaling'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'storageFlatFeeUsd',
      type: 'number',
      validation: (r) => r.min(0),
      hidden: ({ parent }) => parent?.storageModel !== 'flat',
    }),
    defineField({
      name: 'storageScalingPercent',
      type: 'number',
      validation: (r) => r.min(0).max(5),
      hidden: ({ parent }) => parent?.storageModel !== 'scaling',
    }),
    defineField({
      name: 'typicalPurchaseSpreadPercent',
      type: 'number',
      validation: (r) => r.required().min(0).max(200),
    }),
    defineField({
      name: 'typicalLiquidationSpreadPercent',
      type: 'number',
      validation: (r) => r.required().min(0).max(200),
    }),
    defineField({ name: 'minimumInvestmentUsd', type: 'number' }),
    defineField({
      name: 'mandatorySalesCall',
      type: 'boolean',
      initialValue: true,
      description: 'True if the dealer requires a phone call to complete a purchase.',
    }),
    defineField({ name: 'sourceUrl', type: 'url', validation: (r) => r.uri({ scheme: ['https'] }) }),
    defineField({ name: 'dataVerifiedAt', type: 'datetime', validation: (r) => r.required() }),
  ],
})
```

- [ ] **Step 2.7: `editorialGuidelines` singleton**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/editorial-guidelines.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const editorialGuidelines = defineType({
  name: 'editorialGuidelines',
  title: 'Editorial guidelines (singleton)',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Editorial guidelines' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'lastReviewedAt', type: 'datetime', validation: (r) => r.required() }),
  ],
})
```

- [ ] **Step 2.8: `article` document**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/article.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(120) }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pillar',
      type: 'reference',
      to: [{ type: 'pillar' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'reviewedBy', type: 'reviewedBy' }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      type: 'datetime',
      description: 'Emitted as schema.org dateModified.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 3, validation: (r) => r.max(320) }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        defineField({
          name: 'callout',
          type: 'object',
          fields: [
            { name: 'tone', type: 'string', options: { list: ['info', 'warning', 'danger'] } },
            { name: 'body', type: 'text', rows: 3 },
          ],
        }),
        defineField({
          name: 'faq',
          type: 'object',
          fields: [
            { name: 'question', type: 'string', validation: (r) => r.required() },
            { name: 'answer', type: 'text', rows: 4, validation: (r) => r.required() },
          ],
        }),
        defineField({
          name: 'feeTable',
          type: 'object',
          fields: [
            {
              name: 'rows',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'feeSchedule' }] }],
            },
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', pillar: 'pillar.title', updatedAt: 'updatedAt' },
    prepare({ title, pillar, updatedAt }) {
      return {
        title,
        subtitle: `${pillar ?? '—'} · updated ${updatedAt?.slice(0, 10) ?? '—'}`,
      }
    },
  },
})
```

- [ ] **Step 2.9: Schema registry**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/index.ts`:

```ts
import { article } from './article'
import { author } from './author'
import { editorialGuidelines } from './editorial-guidelines'
import { expertCredential } from './expert-credential'
import { feeSchedule } from './fee-schedule'
import { pillar } from './pillar'
import { reviewedBy } from './objects/reviewed-by'
import { seo } from './objects/seo'

export const schemaTypes = [
  article,
  author,
  editorialGuidelines,
  expertCredential,
  feeSchedule,
  pillar,
  reviewedBy,
  seo,
]
```

- [ ] **Step 2.10: Shape tests**

Create `/opt/projects/thegoldiraguide/src/sanity/schemas/schemas.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { schemaTypes } from './index'

const byName = Object.fromEntries(schemaTypes.map((s) => [s.name, s]))

describe('schema registry', () => {
  it('contains every required document and object type', () => {
    const expected = [
      'article', 'author', 'editorialGuidelines', 'expertCredential',
      'feeSchedule', 'pillar', 'reviewedBy', 'seo',
    ]
    for (const name of expected) expect(byName[name]).toBeDefined()
  })

  it('article requires title, slug, pillar, author, publishedAt, updatedAt, body', () => {
    const article = byName.article
    const fieldNames = (article.fields ?? []).map((f) => (f as { name: string }).name)
    for (const f of ['title', 'slug', 'pillar', 'author', 'publishedAt', 'updatedAt', 'body']) {
      expect(fieldNames).toContain(f)
    }
  })

  it('feeSchedule carries structured numerical fee fields', () => {
    const fs = byName.feeSchedule
    const fieldNames = (fs.fields ?? []).map((f) => (f as { name: string }).name)
    for (const f of [
      'setupFeeUsd', 'annualAdminFeeUsd', 'storageModel',
      'typicalPurchaseSpreadPercent', 'typicalLiquidationSpreadPercent',
      'dataVerifiedAt',
    ]) {
      expect(fieldNames).toContain(f)
    }
  })
})
```

- [ ] **Step 2.11: Run shape tests — expect GREEN**

```bash
pnpm test src/sanity/schemas/schemas.test.ts
```

Expected: 3 passed.

- [ ] **Step 2.12: Commit**

```bash
git add src/sanity/schemas
git commit -m "feat(sanity): core schemas for article, author, pillar, fee schedule, credentials"
```

---

## Task 3: Mount Studio at `/studio`

**Files:**
- Create: `sanity.config.ts`, `src/app/studio/[[...tool]]/page.tsx`, `tests/e2e/studio.spec.ts`

- [ ] **Step 3.1: `sanity.config.ts`**

Create `/opt/projects/thegoldiraguide/sanity.config.ts`:

```ts
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'
import { sanityEnv } from './src/sanity/env'

export default defineConfig({
  name: 'thegoldiraguide',
  title: 'The Gold IRA Guide',
  projectId: sanityEnv.projectId,
  dataset: sanityEnv.dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool({ defaultApiVersion: sanityEnv.apiVersion })],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 3.2: Studio route**

Create `/opt/projects/thegoldiraguide/src/app/studio/[[...tool]]/page.tsx`:

```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 3.3: Update Next config to allow Studio's iframes and style-src requirements**

Modify `/opt/projects/thegoldiraguide/src/middleware.ts` — add a Studio bypass so the CSP-heavy Studio UI can boot:

Replace the `config.matcher` block with:

```ts
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|studio).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

Rationale: Studio is an internal auth-gated admin surface, not consumer-facing. The strict nonce-CSP is incompatible with its runtime-injected styles. Access control is handled by Sanity's auth.

- [ ] **Step 3.4: Studio smoke E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/studio.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('studio root responds 200 and loads the Sanity app shell', async ({ page }) => {
  const response = await page.goto('/studio')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(/The Gold IRA Guide|Sanity/i)
})
```

- [ ] **Step 3.5: Run E2E**

```bash
pnpm test:e2e tests/e2e/studio.spec.ts
```

Expected: 1 passed. (Note: first load is slow — Studio bundles ~3MB.)

- [ ] **Step 3.6: Commit**

```bash
git add sanity.config.ts src/app/studio src/middleware.ts tests/e2e/studio.spec.ts
git commit -m "feat(sanity): mount studio at /studio with auth-gated access"
```

---

## Task 4: GROQ Queries and Typed Fetchers (TDD)

**Files:**
- Create: `src/sanity/queries.ts`, `src/sanity/fetchers.ts`, `src/sanity/fetchers.test.ts`, `src/sanity/image.ts`

- [ ] **Step 4.1: Generate TypeScript types from schema**

```bash
pnpm exec sanity schema extract --enforce-required-fields
pnpm exec sanity typegen generate
```

Expected: creates `schema.json` (transient) and `src/sanity/types.generated.ts`. Commit the generated types.

- [ ] **Step 4.2: `src/sanity/queries.ts`**

Create `/opt/projects/thegoldiraguide/src/sanity/queries.ts`:

```ts
import { groq } from 'next-sanity'

const authorProjection = groq`
  _id,
  name,
  "slug": slug.current,
  jobTitle,
  bio,
  "portrait": portrait.asset->url,
  "credentials": credentials[]->{ _id, name, credentialCategory, recognizedBy, dateEarned, verificationUrl },
  "socialProfiles": socialProfiles[]{ platform, url }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    updatedAt,
    "pillar": pillar->{ _id, title, "slug": slug.current, order },
    "author": author->{ ${authorProjection} },
    "reviewedBy": reviewedBy{
      reviewedAt,
      "reviewer": reviewer->{ ${authorProjection} }
    },
    body,
    seo
  }
`

export const allArticleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`

export const pillarsQuery = groq`
  *[_type == "pillar"] | order(order asc){
    _id, title, "slug": slug.current, summary, order
  }
`

export const feeScheduleBySlugQuery = groq`
  *[_type == "feeSchedule" && slug.current == $slug][0]{
    _id,
    dealerName,
    "slug": slug.current,
    setupFeeUsd,
    annualAdminFeeUsd,
    storageModel,
    storageFlatFeeUsd,
    storageScalingPercent,
    typicalPurchaseSpreadPercent,
    typicalLiquidationSpreadPercent,
    minimumInvestmentUsd,
    mandatorySalesCall,
    sourceUrl,
    dataVerifiedAt
  }
`

export const allFeeSchedulesQuery = groq`
  *[_type == "feeSchedule"] | order(dealerName asc){
    _id, dealerName, "slug": slug.current, storageModel, typicalPurchaseSpreadPercent
  }
`
```

- [ ] **Step 4.3: `src/sanity/image.ts`**

Create `/opt/projects/thegoldiraguide/src/sanity/image.ts`:

```ts
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto('format').fit('max')
}
```

- [ ] **Step 4.4: Write failing fetcher tests**

Create `/opt/projects/thegoldiraguide/src/sanity/fetchers.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock must be hoisted — see vitest docs on vi.mock.
vi.mock('./client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from './client'
import { getArticleBySlug, listArticleSlugs, listFeeSchedules } from './fetchers'

const mockedFetch = sanityClient.fetch as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockedFetch.mockReset()
})

describe('getArticleBySlug', () => {
  it('returns null when no article matches', async () => {
    mockedFetch.mockResolvedValue(null)
    const result = await getArticleBySlug('missing')
    expect(result).toBeNull()
  })

  it('passes slug as a named GROQ parameter', async () => {
    mockedFetch.mockResolvedValue({ _id: '1', title: 'x', slug: 'x' })
    await getArticleBySlug('x')
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('slug.current == $slug'),
      { slug: 'x' },
      expect.objectContaining({ next: expect.objectContaining({ tags: ['article:x'] }) }),
    )
  })
})

describe('listArticleSlugs', () => {
  it('returns an array of string slugs', async () => {
    mockedFetch.mockResolvedValue([{ slug: 'a' }, { slug: 'b' }])
    const slugs = await listArticleSlugs()
    expect(slugs).toEqual(['a', 'b'])
  })
})

describe('listFeeSchedules', () => {
  it('tags the result for revalidation', async () => {
    mockedFetch.mockResolvedValue([])
    await listFeeSchedules()
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.any(String),
      {},
      expect.objectContaining({ next: expect.objectContaining({ tags: ['feeSchedule'] }) }),
    )
  })
})
```

- [ ] **Step 4.5: Run — expect RED**

```bash
pnpm test src/sanity/fetchers.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 4.6: Implement fetchers**

Create `/opt/projects/thegoldiraguide/src/sanity/fetchers.ts`:

```ts
import { sanityClient } from './client'
import {
  allArticleSlugsQuery,
  allFeeSchedulesQuery,
  articleBySlugQuery,
  feeScheduleBySlugQuery,
  pillarsQuery,
} from './queries'

type FetchOpts = { tags: string[] }

async function tagged<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
): Promise<T> {
  return sanityClient.fetch<T>(query, params, { next: { tags } } as FetchOpts)
}

export async function getArticleBySlug<T = unknown>(slug: string): Promise<T | null> {
  const result = await tagged<T | null>(articleBySlugQuery, { slug }, [
    `article:${slug}`,
    'article',
  ])
  return result ?? null
}

export async function listArticleSlugs(): Promise<string[]> {
  const rows = await tagged<{ slug: string }[]>(allArticleSlugsQuery, {}, ['article'])
  return rows.map((r) => r.slug)
}

export async function listPillars<T = unknown>(): Promise<T[]> {
  return tagged<T[]>(pillarsQuery, {}, ['pillar'])
}

export async function getFeeScheduleBySlug<T = unknown>(slug: string): Promise<T | null> {
  const result = await tagged<T | null>(feeScheduleBySlugQuery, { slug }, [
    `feeSchedule:${slug}`,
    'feeSchedule',
  ])
  return result ?? null
}

export async function listFeeSchedules<T = unknown>(): Promise<T[]> {
  return tagged<T[]>(allFeeSchedulesQuery, {}, ['feeSchedule'])
}
```

- [ ] **Step 4.7: Run — expect GREEN**

```bash
pnpm test src/sanity/fetchers.test.ts
```

Expected: 4 passed.

- [ ] **Step 4.8: Commit**

```bash
git add src/sanity/queries.ts src/sanity/fetchers.ts src/sanity/fetchers.test.ts src/sanity/image.ts src/sanity/types.generated.ts
git commit -m "feat(sanity): groq queries and tag-aware typed fetchers"
```

---

## Task 5: Date Utilities (TDD)

**Files:**
- Create: `src/lib/date.ts`, `src/lib/date.test.ts`

- [ ] **Step 5.1: Write failing tests**

Create `/opt/projects/thegoldiraguide/src/lib/date.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatLongDate, formatIsoDateOnly, relativeFromNow } from './date'

describe('formatLongDate', () => {
  it('formats an ISO datetime as "Month D, YYYY"', () => {
    expect(formatLongDate('2026-04-19T10:30:00Z')).toBe('April 19, 2026')
  })

  it('returns empty string for invalid input', () => {
    expect(formatLongDate('not-a-date')).toBe('')
  })
})

describe('formatIsoDateOnly', () => {
  it('strips the time portion', () => {
    expect(formatIsoDateOnly('2026-04-19T10:30:00Z')).toBe('2026-04-19')
  })
})

describe('relativeFromNow', () => {
  it('returns "today" for a datetime within the current day', () => {
    const now = new Date('2026-04-19T12:00:00Z')
    expect(relativeFromNow('2026-04-19T06:00:00Z', now)).toBe('today')
  })

  it('returns "N days ago" for prior dates', () => {
    const now = new Date('2026-04-19T12:00:00Z')
    expect(relativeFromNow('2026-04-15T12:00:00Z', now)).toBe('4 days ago')
  })
})
```

- [ ] **Step 5.2: Implement**

Create `/opt/projects/thegoldiraguide/src/lib/date.ts`:

```ts
import { differenceInCalendarDays, format, parseISO } from 'date-fns'

function safeParse(iso: string): Date | null {
  try {
    const d = parseISO(iso)
    return Number.isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

export function formatLongDate(iso: string): string {
  const d = safeParse(iso)
  return d ? format(d, 'MMMM d, yyyy') : ''
}

export function formatIsoDateOnly(iso: string): string {
  const d = safeParse(iso)
  return d ? format(d, 'yyyy-MM-dd') : ''
}

export function relativeFromNow(iso: string, now: Date = new Date()): string {
  const d = safeParse(iso)
  if (!d) return ''
  const days = differenceInCalendarDays(now, d)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
```

- [ ] **Step 5.3: Run — expect GREEN**

```bash
pnpm test src/lib/date.test.ts
```

Expected: 5 passed.

- [ ] **Step 5.4: Commit**

```bash
git add src/lib/date.ts src/lib/date.test.ts
git commit -m "feat(lib): date formatting with safe parsing"
```

---

## Task 6: Editorial Rendering Components (TDD)

**Files:**
- Create: all four component files + their tests

- [ ] **Step 6.1: `LastUpdatedLabel` — failing test**

Create `/opt/projects/thegoldiraguide/src/components/editorial/LastUpdatedLabel.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LastUpdatedLabel } from './LastUpdatedLabel'

describe('LastUpdatedLabel', () => {
  it('renders a <time> with an ISO datetime attribute', () => {
    render(<LastUpdatedLabel updatedAt="2026-04-19T10:30:00Z" />)
    const el = screen.getByText(/last updated/i).querySelector('time')
    expect(el).toBeInTheDocument()
    expect(el?.getAttribute('datetime')).toBe('2026-04-19T10:30:00Z')
  })

  it('renders human-readable long-form date', () => {
    render(<LastUpdatedLabel updatedAt="2026-04-19T10:30:00Z" />)
    expect(screen.getByText(/April 19, 2026/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6.2: Implement `LastUpdatedLabel`**

Create `/opt/projects/thegoldiraguide/src/components/editorial/LastUpdatedLabel.tsx`:

```tsx
import { formatLongDate } from '@/lib/date'

export function LastUpdatedLabel({ updatedAt }: { updatedAt: string }) {
  return (
    <span className="text-sm text-slate-charcoal">
      Last updated:{' '}
      <time dateTime={updatedAt}>{formatLongDate(updatedAt)}</time>
    </span>
  )
}
```

- [ ] **Step 6.3: Run — expect GREEN**

```bash
pnpm test src/components/editorial/LastUpdatedLabel.test.tsx
```

- [ ] **Step 6.4: `ReviewedByBadge` — failing test**

Create `/opt/projects/thegoldiraguide/src/components/editorial/ReviewedByBadge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReviewedByBadge } from './ReviewedByBadge'

const reviewer = {
  name: 'Jane Expert, CFA',
  slug: 'jane-expert',
  credentials: [{ name: 'CFA', credentialCategory: 'certification', recognizedBy: 'CFA Institute' }],
}

describe('ReviewedByBadge', () => {
  it('renders reviewer name and review date', () => {
    render(<ReviewedByBadge reviewer={reviewer} reviewedAt="2026-04-19T10:00:00Z" />)
    expect(screen.getByText(/Reviewed by/i)).toBeInTheDocument()
    expect(screen.getByText('Jane Expert, CFA')).toBeInTheDocument()
    expect(screen.getByText(/April 19, 2026/)).toBeInTheDocument()
  })

  it('lists each credential explicitly', () => {
    render(<ReviewedByBadge reviewer={reviewer} reviewedAt="2026-04-19T10:00:00Z" />)
    expect(screen.getByText(/CFA/)).toBeInTheDocument()
    expect(screen.getByText(/CFA Institute/)).toBeInTheDocument()
  })

  it('renders nothing visible when reviewer is missing', () => {
    const { container } = render(<ReviewedByBadge reviewer={null} reviewedAt={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 6.5: Implement `ReviewedByBadge`**

Create `/opt/projects/thegoldiraguide/src/components/editorial/ReviewedByBadge.tsx`:

```tsx
import { formatLongDate } from '@/lib/date'

type Credential = {
  name: string
  credentialCategory: 'degree' | 'license' | 'certification'
  recognizedBy?: string
}

type Reviewer = {
  name: string
  slug: string
  credentials?: Credential[]
}

type Props = {
  reviewer: Reviewer | null
  reviewedAt: string | null
}

export function ReviewedByBadge({ reviewer, reviewedAt }: Props) {
  if (!reviewer || !reviewedAt) return null

  return (
    <div
      className="rounded border border-slate-charcoal/20 bg-white p-4 text-sm"
      role="note"
      aria-label="Editorial review"
    >
      <div className="font-semibold">
        Reviewed by{' '}
        <a href={`/about/expert-authors/${reviewer.slug}`} className="underline">
          {reviewer.name}
        </a>{' '}
        on <time dateTime={reviewedAt}>{formatLongDate(reviewedAt)}</time>
      </div>
      {reviewer.credentials && reviewer.credentials.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {reviewer.credentials.map((c) => (
            <li
              key={c.name}
              className="rounded bg-platinum px-2 py-1 text-xs text-ledger-navy"
            >
              {c.name}
              {c.recognizedBy ? ` · ${c.recognizedBy}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 6.6: `PortableTextRenderer` — failing test**

Create `/opt/projects/thegoldiraguide/src/components/editorial/PortableTextRenderer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortableTextRenderer } from './PortableTextRenderer'

const blocks = [
  { _type: 'block', _key: 'a', style: 'h2', children: [{ _type: 'span', _key: 's1', text: 'Heading' }] },
  { _type: 'block', _key: 'b', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'Paragraph.' }] },
  { _type: 'callout', _key: 'c', tone: 'warning', body: 'Be careful.' },
  { _type: 'faq', _key: 'f', question: 'Q?', answer: 'A.' },
]

describe('PortableTextRenderer', () => {
  it('renders headings, paragraphs, callouts, and FAQ pairs', () => {
    render(<PortableTextRenderer value={blocks as never} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Heading' })).toBeInTheDocument()
    expect(screen.getByText('Paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Be careful.')).toBeInTheDocument()
    expect(screen.getByText('Q?')).toBeInTheDocument()
    expect(screen.getByText('A.')).toBeInTheDocument()
  })

  it('marks the callout region with role="note"', () => {
    render(<PortableTextRenderer value={blocks as never} />)
    const note = screen.getByRole('note')
    expect(note).toHaveTextContent('Be careful.')
  })
})
```

- [ ] **Step 6.7: Implement `PortableTextRenderer`**

Create `/opt/projects/thegoldiraguide/src/components/editorial/PortableTextRenderer.tsx`:

```tsx
import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  types: {
    callout: ({ value }: { value: { tone: string; body: string } }) => (
      <aside
        role="note"
        className={`my-6 rounded-l-4 border-l-4 p-4 ${
          value.tone === 'danger'
            ? 'border-red-600 bg-red-50'
            : value.tone === 'warning'
              ? 'border-old-gold bg-yellow-50'
              : 'border-ledger-navy bg-platinum'
        }`}
      >
        {value.body}
      </aside>
    ),
    faq: ({ value }: { value: { question: string; answer: string } }) => (
      <div className="my-4">
        <p className="font-semibold">{value.question}</p>
        <p>{value.answer}</p>
      </div>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 text-xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  },
}

export function PortableTextRenderer({ value }: { value: Parameters<typeof PortableText>[0]['value'] }) {
  return <PortableText value={value} components={components} />
}
```

- [ ] **Step 6.8: `ArticleByline` — failing test**

Create `/opt/projects/thegoldiraguide/src/components/editorial/ArticleByline.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleByline } from './ArticleByline'

const author = { name: 'Alex Writer', slug: 'alex', jobTitle: 'Senior Editor' }

describe('ArticleByline', () => {
  it('renders author name linking to profile, job title, and updated date', () => {
    render(
      <ArticleByline
        author={author}
        publishedAt="2026-04-01T00:00:00Z"
        updatedAt="2026-04-19T10:30:00Z"
      />,
    )
    const link = screen.getByRole('link', { name: 'Alex Writer' })
    expect(link).toHaveAttribute('href', '/about/expert-authors/alex')
    expect(screen.getByText(/Senior Editor/)).toBeInTheDocument()
    expect(screen.getByText(/Last updated/)).toBeInTheDocument()
    expect(screen.getByText(/April 19, 2026/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6.9: Implement `ArticleByline`**

Create `/opt/projects/thegoldiraguide/src/components/editorial/ArticleByline.tsx`:

```tsx
import { LastUpdatedLabel } from './LastUpdatedLabel'

type Props = {
  author: { name: string; slug: string; jobTitle?: string }
  publishedAt: string
  updatedAt: string
}

export function ArticleByline({ author, publishedAt, updatedAt }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span>
        By{' '}
        <a
          href={`/about/expert-authors/${author.slug}`}
          className="font-semibold underline"
        >
          {author.name}
        </a>
      </span>
      {author.jobTitle && (
        <span className="text-slate-charcoal">· {author.jobTitle}</span>
      )}
      <span aria-hidden>·</span>
      <time dateTime={publishedAt} className="text-slate-charcoal">
        Published {publishedAt.slice(0, 10)}
      </time>
      <span aria-hidden>·</span>
      <LastUpdatedLabel updatedAt={updatedAt} />
    </div>
  )
}
```

- [ ] **Step 6.10: Run all editorial tests — expect GREEN**

```bash
pnpm test src/components/editorial
```

Expected: all tests pass.

- [ ] **Step 6.11: Commit**

```bash
git add src/components/editorial
git commit -m "feat(editorial): article byline, reviewed-by badge, portable text renderer"
```

---

## Task 7: Demo Article Route (Temporary — Plan 3 replaces it)

**Files:**
- Create: `src/app/articles/[slug]/page.tsx`

This route exists to prove the Sanity → Next.js pipeline end-to-end. Plan 3 deletes it and introduces the real pillar routes.

- [ ] **Step 7.1: Write the route**

Create `/opt/projects/thegoldiraguide/src/app/articles/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { ArticleByline } from '@/components/editorial/ArticleByline'
import { PortableTextRenderer } from '@/components/editorial/PortableTextRenderer'
import { ReviewedByBadge } from '@/components/editorial/ReviewedByBadge'
import { getArticleBySlug, listArticleSlugs } from '@/sanity/fetchers'

export const revalidate = 3600 // 1h ISR fallback

type Article = {
  title: string
  summary?: string
  publishedAt: string
  updatedAt: string
  author: { name: string; slug: string; jobTitle?: string }
  reviewedBy?: {
    reviewedAt: string
    reviewer: { name: string; slug: string; credentials?: unknown[] }
  } | null
  body: unknown
}

export async function generateStaticParams() {
  const slugs = await listArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug<Article>(slug)
  if (!article) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">{article.title}</h1>
      {article.summary && <p className="mt-4 text-lg">{article.summary}</p>}
      <div className="mt-6">
        <ArticleByline
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
        />
      </div>
      {article.reviewedBy && (
        <div className="mt-4">
          <ReviewedByBadge
            reviewer={article.reviewedBy.reviewer as never}
            reviewedAt={article.reviewedBy.reviewedAt}
          />
        </div>
      )}
      <div className="prose mt-10">
        <PortableTextRenderer value={article.body as never} />
      </div>
    </article>
  )
}
```

- [ ] **Step 7.2: Manual smoke**

```bash
pnpm dev
```

In the Studio at `http://localhost:3000/studio`, create:
1. One `Author` document.
2. One `Pillar` with order `1`.
3. One `Article` tied to both, with a `publishedAt`, `updatedAt`, body, and a slug like `test-article`.
4. Publish it.

Visit `http://localhost:3000/articles/test-article`. Confirm byline, dates, body render. Stop dev.

- [ ] **Step 7.3: Commit**

```bash
git add src/app/articles
git commit -m "feat(demo): temporary /articles/[slug] route proves sanity pipeline"
```

---

## Task 8: On-Demand Revalidation Webhook (TDD)

**Files:**
- Create: `src/app/api/revalidate/route.ts`, `tests/e2e/revalidate.spec.ts`

Sanity sends a signed webhook on publish. We verify the signature, parse the document type and slug, and call `revalidateTag()` on the matching tag. This eliminates stale fee data — critical for YMYL.

- [ ] **Step 8.1: Write failing E2E (secret mismatch → 401)**

Create `/opt/projects/thegoldiraguide/tests/e2e/revalidate.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('rejects requests without a valid signature', async ({ request }) => {
  const response = await request.post('/api/revalidate', {
    data: { _type: 'article', slug: { current: 'x' } },
    headers: { 'sanity-webhook-signature': 'bad' },
  })
  expect([401, 403]).toContain(response.status())
})

test('accepts requests with a valid HMAC signature', async ({ request }) => {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  test.skip(!secret, 'SANITY_REVALIDATE_SECRET not set in this env')

  const body = JSON.stringify({ _type: 'article', slug: { current: 'test-article' } })
  const crypto = await import('node:crypto')
  const sig = crypto
    .createHmac('sha256', secret as string)
    .update(body)
    .digest('hex')

  const response = await request.post('/api/revalidate', {
    data: body,
    headers: {
      'content-type': 'application/json',
      'sanity-webhook-signature': `t=${Date.now()},v1=${sig}`,
    },
  })
  expect(response.status()).toBe(200)
  const json = await response.json()
  expect(json).toMatchObject({ revalidated: true, tags: expect.arrayContaining(['article:test-article', 'article']) })
})
```

- [ ] **Step 8.2: Run — expect RED**

```bash
pnpm test:e2e tests/e2e/revalidate.spec.ts
```

Expected: FAIL — route doesn't exist yet.

- [ ] **Step 8.3: Implement webhook route**

Create `/opt/projects/thegoldiraguide/src/app/api/revalidate/route.ts`:

```ts
import crypto from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { sanityEnv } from '@/sanity/env'

const payloadSchema = z.object({
  _type: z.string(),
  slug: z.object({ current: z.string() }).optional(),
})

function verify(signatureHeader: string | null, rawBody: string, secret: string): boolean {
  if (!signatureHeader) return false
  const match = signatureHeader.match(/v1=([a-f0-9]+)/)
  const provided = match?.[1]
  if (!provided) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const secret = sanityEnv.revalidateSecret
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('sanity-webhook-signature')

  if (!verify(signature, rawBody, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let parsed: z.infer<typeof payloadSchema>
  try {
    parsed = payloadSchema.parse(JSON.parse(rawBody))
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const tags: string[] = [parsed._type]
  if (parsed.slug?.current) tags.push(`${parsed._type}:${parsed.slug.current}`)
  for (const tag of tags) revalidateTag(tag)

  return NextResponse.json({ revalidated: true, tags })
}
```

- [ ] **Step 8.4: Run — expect GREEN**

```bash
pnpm test:e2e tests/e2e/revalidate.spec.ts
```

Expected: 2 passed (second test skipped if secret not set locally; runs green in CI once secret is provisioned).

- [ ] **Step 8.5: Commit**

```bash
git add src/app/api/revalidate tests/e2e/revalidate.spec.ts
git commit -m "feat(sanity): signed webhook revalidates tags on publish"
```

---

## Task 9: CI Additions

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 9.1: Add schema-type generation step**

In the `Verify` job of `.github/workflows/ci.yml`, add this step **before** `Typecheck`:

```yaml
      - name: Sanity type generation
        run: |
          pnpm exec sanity schema extract --enforce-required-fields
          pnpm exec sanity typegen generate
          if ! git diff --quiet src/sanity/types.generated.ts; then
            echo "Generated Sanity types are out of date. Run 'pnpm exec sanity typegen generate' and commit."
            git diff src/sanity/types.generated.ts
            exit 1
          fi
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
```

- [ ] **Step 9.2: Add environment secrets to existing `env` blocks**

In the `Verify` job, add an `env:` key at the job level (above `steps:`):

```yaml
    env:
      NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
      NEXT_PUBLIC_SANITY_DATASET: production
      NEXT_PUBLIC_SANITY_API_VERSION: '2026-04-01'
      SANITY_API_READ_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
      SANITY_REVALIDATE_SECRET: ${{ secrets.SANITY_REVALIDATE_SECRET }}
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
```

- [ ] **Step 9.3: Provision GitHub + Vercel secrets** (manual)

In GitHub → Settings → Secrets and variables → Actions, add:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_API_READ_TOKEN` (create a read-only token in Sanity dashboard → API)
- `SANITY_REVALIDATE_SECRET` (generate with `openssl rand -hex 32`)

In Vercel → Project Settings → Environment Variables, add the same values for Production + Preview.

In Sanity → API → Webhooks, create a webhook:
- URL: `https://www.thegoldiraguide.com/api/revalidate`
- Dataset: `production`
- Trigger on: Create, Update, Delete
- Filter: `_type in ["article", "feeSchedule", "author", "pillar", "editorialGuidelines", "expertCredential"]`
- Projection: `{ _type, slug }`
- Secret: paste `SANITY_REVALIDATE_SECRET` value

- [ ] **Step 9.4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: generate sanity types in pipeline and wire secrets"
```

---

## Task 10: Final Verification

- [ ] **Step 10.1: Local all-gates pass**

```bash
pnpm check:all && pnpm test:e2e
```

Expected: every gate green. Studio, revalidate, and (if seeded) article demo route included.

- [ ] **Step 10.2: Push and watch CI**

```bash
git push
```

Confirm `Verify` and `Semgrep SAST` jobs green.

- [ ] **Step 10.3: Tag milestone**

```bash
git tag -a v0.2.0-sanity -m "Plan 2: Sanity CMS & authorship complete"
git push origin v0.2.0-sanity
```

---

## Done Means

1. `/studio` renders a functional Sanity Studio with all six schemas.
2. Any editor can publish an Article with author, reviewer, and credentials; `/articles/[slug]` renders it with byline, reviewed-by badge, and last-updated label.
3. `sanity typegen generate` is idempotent and CI-enforced.
4. The signed revalidation webhook invalidates only the tags it should — verified by E2E.
5. No component calls `sanityClient.fetch` directly. Every fetch is routed through `src/sanity/fetchers.ts` with explicit revalidation tags.
6. Plan 3 can now replace `/articles/[slug]` with real pillar routes without disturbing the CMS layer.
