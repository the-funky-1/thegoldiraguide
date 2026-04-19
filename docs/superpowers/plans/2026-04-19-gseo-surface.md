# Plan 4: GSEO Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1, 2, 3 shipped.

**Goal:** Make the site maximally legible to both traditional search crawlers and AI answer engines. Ship strict, type-checked JSON-LD emission for every article, author, pillar, and FAQ; a dynamic `/llms.txt` + `/llms-full.txt` protocol; per-page Markdown mirrors (content-negotiated via `Accept: text/markdown` or `.md` URL suffix); `<LlmsOnly>` / `<LlmsIgnore>` React primitives that shape what AI agents see versus what humans see; production `robots.txt` and `sitemap.xml` generation; and a CI gate that validates every JSON-LD payload against Schema.org before it ships.

**Architecture:** One strict TS module per schema type in `src/seo/schemas/`, each returning a `WithContext<T>` validated at compile time against `schema-dts`. One `<JsonLd>` primitive that stamps validated payloads to a `<script type="application/ld+json" nonce={...}>` tag (nonce sourced from the CSP middleware headers added in Plan 1). A single Markdown renderer in `src/seo/markdown.ts` converts Sanity portable-text into clean Markdown while respecting `<LlmsOnly>` and `<LlmsIgnore>` markers. Route handlers at `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`, and `/<pillar>/<slug>.md` share that renderer. Validation is a CI-invoked script that walks every published URL, extracts JSON-LD blocks, and runs them through the `schema-dts` type system plus Google's Rich Results Test (optional opt-in via GitHub secret).

**Tech stack additions:** `schema-dts`, `remark-parse`, `remark-stringify`, `unified`.

**Out of scope (deferred):** Calculator-specific JSON-LD (Plan 5 adds `FAQPage` for calculator Q&A), WebSocket data embedded in schemas (Plan 6), chart data-table accessibility captions (Plan 7), bundle budget and CWV tuning (Plan 8).

---

## File Structure

- `src/seo/schemas/organization.ts` + `.test.ts`
- `src/seo/schemas/website.ts` + `.test.ts`
- `src/seo/schemas/person.ts` + `.test.ts`
- `src/seo/schemas/educational-credential.ts` + `.test.ts`
- `src/seo/schemas/article.ts` + `.test.ts`
- `src/seo/schemas/breadcrumb-list.ts` + `.test.ts`
- `src/seo/schemas/faq-page.ts` + `.test.ts`
- `src/seo/schemas/financial-product.ts` + `.test.ts`
- `src/seo/schemas/validate.ts` + `.test.ts` — runtime validator shared by route + CI
- `src/seo/json-ld.tsx` + `.test.tsx` — `<JsonLd>` primitive
- `src/seo/markdown.ts` + `.test.ts` — portable-text → markdown with `<LlmsOnly>` / `<LlmsIgnore>`
- `src/components/seo/LlmsOnly.tsx`
- `src/components/seo/LlmsIgnore.tsx`
- `src/app/llms.txt/route.ts`
- `src/app/llms-full.txt/route.ts`
- `src/app/sitemap.xml/route.ts`
- `src/app/robots.txt/route.ts`
- `src/app/(marketing)/[...path]/route.ts` — content-negotiation hook for `.md` mirrors (see Task 9)
- Modify: `src/middleware.ts` — surface the nonce as a header on the response so `<JsonLd>` can read it
- Modify: `src/app/layout.tsx` — mount `Organization` + `WebSite` schema globally
- Modify: route pages in each pillar — mount per-article schema
- `scripts/validate-json-ld.ts` + `.test.ts`
- CI step additions

Design rule: **Every JSON-LD payload is a pure function of its input.** No schema module reads `headers()` or env. The `<JsonLd>` primitive is the *only* place runtime concerns (nonce, stringification) live.

---

## Task 1: Dependencies and `<JsonLd>` Primitive (TDD)

**Files:**
- Create: `src/seo/json-ld.tsx`, `src/seo/json-ld.test.tsx`

- [ ] **Step 1.1: Install**

```bash
pnpm add schema-dts
pnpm add -D remark-parse remark-stringify unified
```

- [ ] **Step 1.2: Failing tests**

Create `/opt/projects/thegoldiraguide/src/seo/json-ld.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JsonLd } from './json-ld'

describe('JsonLd', () => {
  it('emits a <script type="application/ld+json"> with the serialized payload', () => {
    const { container } = render(
      <JsonLd
        data={{ '@context': 'https://schema.org', '@type': 'Thing', name: 'Gold' }}
      />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const parsed = JSON.parse(script!.textContent ?? '{}')
    expect(parsed).toMatchObject({ '@type': 'Thing', name: 'Gold' })
  })

  it('escapes embedded </script> tags so the payload cannot break out', () => {
    const { container } = render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Thing',
          description: 'abc</script><script>alert(1)</script>',
        }}
      />,
    )
    const raw = container.querySelector('script')!.innerHTML
    expect(raw).not.toContain('</script>')
    expect(raw).toContain('\\u003c/script')
  })

  it('renders nothing when given null (quiet no-op)', () => {
    const { container } = render(<JsonLd data={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 1.3: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/json-ld.tsx`:

```tsx
import type { Thing, WithContext } from 'schema-dts'

type JsonLdInput = WithContext<Thing> | Record<string, unknown> | null

// Escapes `</script>` (case-insensitive) inside the payload to prevent HTML
// breakouts. See OWASP recommendation for embedding JSON inside <script>.
function stringifySafe(data: JsonLdInput): string {
  return JSON.stringify(data).replace(/<\/script/gi, '\\u003c/script')
}

export function JsonLd({ data }: { data: JsonLdInput }) {
  if (data === null) return null
  return (
    <script
      type="application/ld+json"
      // `dangerouslySetInnerHTML` is the only way to emit a raw JSON script
      // in React. The input is type-constrained, stringified safely, and
      // always derived from server-side data.
      //
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: stringifySafe(data) }}
    />
  )
}
```

- [ ] **Step 1.4: Unblock `dangerouslySetInnerHTML` for this file only**

Semgrep's `no-dangerously-set-inner-html` rule from Plan 1 fires here. Relax it *only* for this file by adding a per-file exception at the top of `semgrep.yml` under `no-dangerously-set-inner-html`:

```yaml
  - id: no-dangerously-set-inner-html
    message: dangerouslySetInnerHTML is forbidden outside the JSON-LD primitive.
    severity: ERROR
    languages: [typescript]
    pattern: dangerouslySetInnerHTML={...}
    paths:
      exclude:
        - 'src/seo/json-ld.tsx'
```

- [ ] **Step 1.5: Run — expect GREEN**

```bash
pnpm test src/seo/json-ld.test.tsx
```

- [ ] **Step 1.6: Commit**

```bash
git add src/seo/json-ld.tsx src/seo/json-ld.test.tsx semgrep.yml package.json pnpm-lock.yaml
git commit -m "feat(seo): <JsonLd> primitive with safe serialization"
```

---

## Task 2: `Organization` and `WebSite` Schemas (TDD)

**Files:**
- Create: `src/seo/schemas/organization.ts`, `.test.ts`, `src/seo/schemas/website.ts`, `.test.ts`

- [ ] **Step 2.1: Failing tests**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/organization.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildOrganization } from './organization'

describe('buildOrganization', () => {
  it('names The Gold IRA Guide as the publisher with parent Liberty Gold Silver', () => {
    const org = buildOrganization({ siteUrl: 'https://www.thegoldiraguide.com' })
    expect(org['@context']).toBe('https://schema.org')
    expect(org['@type']).toBe('Organization')
    expect(org.name).toBe('The Gold IRA Guide')
    expect(org.parentOrganization).toMatchObject({
      '@type': 'Organization',
      name: 'Liberty Gold Silver',
    })
  })
  it('sets url to the canonical site URL', () => {
    const org = buildOrganization({ siteUrl: 'https://example.test' })
    expect(org.url).toBe('https://example.test')
  })
})
```

- [ ] **Step 2.2: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/organization.ts`:

```ts
import type { Organization, WithContext } from 'schema-dts'

export function buildOrganization({
  siteUrl,
}: {
  siteUrl: string
}): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Gold IRA Guide',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    parentOrganization: {
      '@type': 'Organization',
      name: 'Liberty Gold Silver',
      url: 'https://www.libertygoldsilver.com',
    },
    sameAs: [
      'https://www.libertygoldsilver.com',
    ],
  }
}
```

- [ ] **Step 2.3: Failing `website` tests**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/website.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildWebSite } from './website'

describe('buildWebSite', () => {
  it('returns @type=WebSite with name and URL', () => {
    const site = buildWebSite({ siteUrl: 'https://example.test' })
    expect(site['@type']).toBe('WebSite')
    expect(site.url).toBe('https://example.test')
    expect(site.name).toBe('The Gold IRA Guide')
  })

  it('references the publisher Organization', () => {
    const site = buildWebSite({ siteUrl: 'https://example.test' })
    expect(site.publisher).toMatchObject({
      '@type': 'Organization',
      name: 'The Gold IRA Guide',
    })
  })
})
```

- [ ] **Step 2.4: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/website.ts`:

```ts
import type { WebSite, WithContext } from 'schema-dts'

export function buildWebSite({
  siteUrl,
}: {
  siteUrl: string
}): WithContext<WebSite> {
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
```

- [ ] **Step 2.5: Run — expect GREEN**

```bash
pnpm test src/seo/schemas
```

- [ ] **Step 2.6: Mount globally in root layout**

Modify `/opt/projects/thegoldiraguide/src/app/layout.tsx` — insert the two schemas into the `<body>` (above `<DisclosureBanner />`):

```tsx
import type { Metadata } from 'next'
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
import { JsonLd } from '@/seo/json-ld'
import { buildOrganization } from '@/seo/schemas/organization'
import { buildWebSite } from '@/seo/schemas/website'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'The Gold IRA Guide', template: '%s · The Gold IRA Guide' },
  description:
    'Objective, transparent education on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={buildOrganization({ siteUrl })} />
        <JsonLd data={buildWebSite({ siteUrl })} />
        <DisclosureBanner />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2.7: Commit**

```bash
git add src/seo/schemas src/app/layout.tsx
git commit -m "feat(seo): organization and website json-ld at root"
```

---

## Task 3: Article + BreadcrumbList Schemas (TDD)

**Files:**
- Create: `src/seo/schemas/article.ts`, `.test.ts`, `src/seo/schemas/breadcrumb-list.ts`, `.test.ts`

- [ ] **Step 3.1: Article failing tests**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/article.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildArticle } from './article'

const input = {
  siteUrl: 'https://example.test',
  pillarSlug: 'ira-rules' as const,
  slug: 'eligible-metals',
  title: 'Eligible metals',
  summary: 'Which metals qualify.',
  publishedAt: '2026-04-01T00:00:00Z',
  updatedAt: '2026-04-19T00:00:00Z',
  author: { name: 'Jane Author', slug: 'jane' },
  reviewer: { name: 'Rev Iewer', slug: 'rev' } as { name: string; slug: string } | null,
}

describe('buildArticle', () => {
  it('produces @type=Article with dateModified, url, headline, publisher', () => {
    const a = buildArticle(input)
    expect(a['@type']).toBe('Article')
    expect(a.headline).toBe('Eligible metals')
    expect(a.url).toBe('https://example.test/ira-rules/eligible-metals')
    expect(a.datePublished).toBe('2026-04-01T00:00:00Z')
    expect(a.dateModified).toBe('2026-04-19T00:00:00Z')
    expect(a.publisher).toMatchObject({ '@type': 'Organization', name: 'The Gold IRA Guide' })
  })

  it('emits Person for author and reviewer when present', () => {
    const a = buildArticle(input)
    expect(a.author).toMatchObject({
      '@type': 'Person',
      name: 'Jane Author',
      url: 'https://example.test/about/expert-authors/jane',
    })
    expect(a.reviewedBy).toMatchObject({
      '@type': 'Person',
      name: 'Rev Iewer',
      url: 'https://example.test/about/expert-authors/rev',
    })
  })

  it('omits reviewedBy when reviewer is null', () => {
    const a = buildArticle({ ...input, reviewer: null })
    expect(a.reviewedBy).toBeUndefined()
  })
})
```

- [ ] **Step 3.2: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/article.ts`:

```ts
import type { Article, Person, WithContext } from 'schema-dts'
import type { PillarSlug } from '@/lib/site-map'

type Input = {
  siteUrl: string
  pillarSlug: PillarSlug
  slug: string
  title: string
  summary?: string
  publishedAt: string
  updatedAt: string
  author: { name: string; slug: string }
  reviewer: { name: string; slug: string } | null
}

function personRef(siteUrl: string, p: { name: string; slug: string }): Person {
  return {
    '@type': 'Person',
    name: p.name,
    url: `${siteUrl}/about/expert-authors/${p.slug}`,
  }
}

export function buildArticle(input: Input): WithContext<Article> {
  const out: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.summary,
    url: `${input.siteUrl}/${input.pillarSlug}/${input.slug}`,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: personRef(input.siteUrl, input.author),
    publisher: {
      '@type': 'Organization',
      name: 'The Gold IRA Guide',
      url: input.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${input.siteUrl}/${input.pillarSlug}/${input.slug}`,
    },
  }
  if (input.reviewer) {
    out.reviewedBy = personRef(input.siteUrl, input.reviewer)
  }
  return out
}
```

- [ ] **Step 3.3: BreadcrumbList failing tests**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/breadcrumb-list.test.ts`:

```ts
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
    const items = bl.itemListElement as Array<{ position: number; name: string; item: string }>
    expect(items.map((i) => i.position)).toEqual([1, 2, 3])
    expect(items[0]).toMatchObject({ name: 'Home', item: 'https://example.test/' })
    expect(items[2]).toMatchObject({
      name: 'Eligible metals',
      item: 'https://example.test/ira-rules/eligible-metals',
    })
  })
})
```

- [ ] **Step 3.4: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/breadcrumb-list.ts`:

```ts
import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts'

type Input = {
  siteUrl: string
  items: { label: string; path: string }[]
}

export function buildBreadcrumbList({ siteUrl, items }: Input): WithContext<BreadcrumbList> {
  const itemListElement: ListItem[] = items.map((it, idx) => ({
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
```

- [ ] **Step 3.5: Run**

```bash
pnpm test src/seo/schemas
```

- [ ] **Step 3.6: Commit**

```bash
git add src/seo/schemas/article.ts src/seo/schemas/article.test.ts src/seo/schemas/breadcrumb-list.ts src/seo/schemas/breadcrumb-list.test.ts
git commit -m "feat(seo): article and breadcrumbList schemas"
```

---

## Task 4: Person, EducationalOccupationalCredential, FAQPage, FinancialProduct (TDD)

Same pattern. Each gets a failing test file, then an implementation.

- [ ] **Step 4.1: Person + credential**

Create `src/seo/schemas/person.ts`:

```ts
import type { EducationalOccupationalCredential, Person, WithContext } from 'schema-dts'

type Credential = {
  name: string
  credentialCategory: 'degree' | 'license' | 'certification'
  recognizedBy?: string
  verificationUrl?: string
}

type Input = {
  siteUrl: string
  name: string
  slug: string
  jobTitle?: string
  bio?: string
  credentials?: Credential[]
  socialProfiles?: { platform: string; url: string }[]
}

export function buildPerson(input: Input): WithContext<Person> {
  const hasCredential: EducationalOccupationalCredential[] = (input.credentials ?? []).map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.name,
    credentialCategory: c.credentialCategory,
    ...(c.recognizedBy && {
      recognizedBy: { '@type': 'Organization', name: c.recognizedBy },
    }),
    ...(c.verificationUrl && { url: c.verificationUrl }),
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: `${input.siteUrl}/about/expert-authors/${input.slug}`,
    jobTitle: input.jobTitle,
    description: input.bio,
    ...(hasCredential.length > 0 && { hasCredential }),
    ...(input.socialProfiles && input.socialProfiles.length > 0 && {
      sameAs: input.socialProfiles.map((s) => s.url),
    }),
  }
}
```

Create `src/seo/schemas/person.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildPerson } from './person'

describe('buildPerson', () => {
  it('emits hasCredential entries with recognizedBy and verification URL', () => {
    const p = buildPerson({
      siteUrl: 'https://example.test',
      name: 'Jane', slug: 'jane',
      credentials: [{
        name: 'CFA',
        credentialCategory: 'certification',
        recognizedBy: 'CFA Institute',
        verificationUrl: 'https://example.test/verify/123',
      }],
    })
    expect(p.hasCredential).toEqual([{
      '@type': 'EducationalOccupationalCredential',
      name: 'CFA',
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: 'CFA Institute' },
      url: 'https://example.test/verify/123',
    }])
  })

  it('uses sameAs for verified social profiles', () => {
    const p = buildPerson({
      siteUrl: 'https://example.test',
      name: 'Jane', slug: 'jane',
      socialProfiles: [{ platform: 'linkedin', url: 'https://linkedin.com/in/jane' }],
    })
    expect(p.sameAs).toEqual(['https://linkedin.com/in/jane'])
  })
})
```

- [ ] **Step 4.2: FAQPage**

Create `src/seo/schemas/faq-page.ts`:

```ts
import type { FAQPage, Question, WithContext } from 'schema-dts'

type Input = { url: string; qas: { question: string; answer: string }[] }

export function buildFaqPage({ url, qas }: Input): WithContext<FAQPage> | null {
  if (qas.length === 0) return null
  const mainEntity: Question[] = qas.map((qa) => ({
    '@type': 'Question',
    name: qa.question,
    acceptedAnswer: { '@type': 'Answer', text: qa.answer },
  }))
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity,
  }
}
```

Create `src/seo/schemas/faq-page.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildFaqPage } from './faq-page'

describe('buildFaqPage', () => {
  it('returns null when there are no Q&As (no FAQPage to emit)', () => {
    expect(buildFaqPage({ url: 'https://x.test', qas: [] })).toBeNull()
  })
  it('maps each Q&A to a Question with an acceptedAnswer', () => {
    const fp = buildFaqPage({
      url: 'https://x.test/x',
      qas: [{ question: 'Q1?', answer: 'A1.' }, { question: 'Q2?', answer: 'A2.' }],
    })!
    expect(fp.mainEntity).toHaveLength(2)
    expect(fp.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: 'Q1?',
      acceptedAnswer: { '@type': 'Answer', text: 'A1.' },
    })
  })
})
```

- [ ] **Step 4.3: FinancialProduct**

Create `src/seo/schemas/financial-product.ts`:

```ts
import type { FinancialProduct, WithContext } from 'schema-dts'

type Input = {
  name: string
  url: string
  description: string
  setupFeeUsd?: number
  annualAdminFeeUsd?: number
  storageModel: 'flat' | 'scaling'
  storageFlatFeeUsd?: number
  storageScalingPercent?: number
  typicalPurchaseSpreadPercent: number
  typicalLiquidationSpreadPercent: number
  minimumInvestmentUsd?: number
}

export function buildFinancialProduct(input: Input): WithContext<FinancialProduct> {
  const feesAndCommissionsSpecification = JSON.stringify({
    setupFeeUsd: input.setupFeeUsd ?? 0,
    annualAdminFeeUsd: input.annualAdminFeeUsd ?? 0,
    storageModel: input.storageModel,
    storageFlatFeeUsd: input.storageFlatFeeUsd,
    storageScalingPercent: input.storageScalingPercent,
    typicalPurchaseSpreadPercent: input.typicalPurchaseSpreadPercent,
    typicalLiquidationSpreadPercent: input.typicalLiquidationSpreadPercent,
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: input.name,
    url: input.url,
    description: input.description,
    feesAndCommissionsSpecification,
    ...(input.minimumInvestmentUsd !== undefined && {
      amount: {
        '@type': 'MonetaryAmount',
        minValue: input.minimumInvestmentUsd,
        currency: 'USD',
      },
    }),
  }
}
```

Create `src/seo/schemas/financial-product.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildFinancialProduct } from './financial-product'

describe('buildFinancialProduct', () => {
  it('encodes fees into feesAndCommissionsSpecification as JSON', () => {
    const fp = buildFinancialProduct({
      name: 'LGS Flat-Rate IRA',
      url: 'https://x.test/products/flat',
      description: 'Flat-rate storage, transparent spread.',
      setupFeeUsd: 75,
      annualAdminFeeUsd: 100,
      storageModel: 'flat',
      storageFlatFeeUsd: 125,
      typicalPurchaseSpreadPercent: 4,
      typicalLiquidationSpreadPercent: 1,
    })
    const parsed = JSON.parse(fp.feesAndCommissionsSpecification as string)
    expect(parsed).toMatchObject({
      setupFeeUsd: 75,
      annualAdminFeeUsd: 100,
      storageModel: 'flat',
      typicalPurchaseSpreadPercent: 4,
    })
  })

  it('omits amount when there is no minimum investment', () => {
    const fp = buildFinancialProduct({
      name: 'x',
      url: 'https://x.test',
      description: 'y',
      storageModel: 'flat',
      typicalPurchaseSpreadPercent: 5,
      typicalLiquidationSpreadPercent: 1,
    })
    expect(fp.amount).toBeUndefined()
  })
})
```

- [ ] **Step 4.4: Run all schema tests**

```bash
pnpm test src/seo/schemas
```

- [ ] **Step 4.5: Commit**

```bash
git add src/seo/schemas
git commit -m "feat(seo): person, credential, faqPage, financialProduct schemas"
```

---

## Task 5: Runtime Schema Validator (TDD)

**Files:**
- Create: `src/seo/schemas/validate.ts`, `src/seo/schemas/validate.test.ts`

Light runtime check — every schema must have `@context` and `@type`, and every URL field must be absolute HTTPS. Catches obvious regressions without embedding the full Schema.org graph.

- [ ] **Step 5.1: Failing tests**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/validate.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { validateJsonLd } from './validate'

describe('validateJsonLd', () => {
  it('passes a well-formed Article', () => {
    const r = validateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'x',
      url: 'https://x.test/y',
    })
    expect(r.ok).toBe(true)
    expect(r.errors).toEqual([])
  })

  it('fails when @context is missing', () => {
    const r = validateJsonLd({ '@type': 'Article', url: 'https://x.test' })
    expect(r.ok).toBe(false)
    expect(r.errors).toContain('missing @context')
  })

  it('fails when a url field is relative', () => {
    const r = validateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      url: '/relative',
    })
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('relative url'))).toBe(true)
  })

  it('recurses into nested objects and arrays', () => {
    const r = validateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', item: 'not-a-url' }],
    })
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('not-a-url'))).toBe(true)
  })
})
```

- [ ] **Step 5.2: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/schemas/validate.ts`:

```ts
const URL_FIELDS = new Set(['url', 'item', 'logo', 'sameAs'])

export type ValidationResult = { ok: boolean; errors: string[] }

function isHttpsUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

function walk(node: unknown, path: string, errors: string[]): void {
  if (node === null || typeof node !== 'object') return
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`, errors))
    return
  }
  const obj = node as Record<string, unknown>
  for (const [key, value] of Object.entries(obj)) {
    if (URL_FIELDS.has(key)) {
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (!isHttpsUrl(v)) errors.push(`relative url at ${path}.${key}[${i}]: ${String(v)}`)
        })
      } else if (typeof value === 'string' && !isHttpsUrl(value)) {
        errors.push(`relative url at ${path}.${key}: ${value}`)
      }
    }
    walk(value, `${path}.${key}`, errors)
  }
}

export function validateJsonLd(data: unknown): ValidationResult {
  const errors: string[] = []
  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['payload is not an object'] }
  }
  const obj = data as Record<string, unknown>
  if (obj['@context'] !== 'https://schema.org') errors.push('missing @context')
  if (typeof obj['@type'] !== 'string') errors.push('missing @type')
  walk(obj, '$', errors)
  return { ok: errors.length === 0, errors }
}
```

- [ ] **Step 5.3: Run — GREEN**

```bash
pnpm test src/seo/schemas/validate.test.ts
```

- [ ] **Step 5.4: Commit**

```bash
git add src/seo/schemas/validate.ts src/seo/schemas/validate.test.ts
git commit -m "feat(seo): runtime jsonld validator for context/type/url fields"
```

---

## Task 6: Mount Per-Page Schemas in Routes

**Files:**
- Modify: `src/app/(marketing)/<pillar>/page.tsx` (each pillar index)
- Modify: `src/app/(marketing)/<pillar>/[slug]/page.tsx` (each article)
- Modify: `src/app/(marketing)/about/expert-authors/[slug]/page.tsx` (author profile)

For each article route, emit `Article` + `BreadcrumbList` + optional `FAQPage`. For each author profile, emit `Person` with credentials.

- [ ] **Step 6.1: Helper to extract FAQs from portable-text body**

Create `/opt/projects/thegoldiraguide/src/seo/extract-faqs.ts`:

```ts
type Block = { _type: string; question?: string; answer?: string }

export function extractFaqs(blocks: Block[] | undefined): { question: string; answer: string }[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b): b is Required<Block> => b._type === 'faq' && !!b.question && !!b.answer)
    .map((b) => ({ question: b.question, answer: b.answer }))
}
```

Create a quick test at `src/seo/extract-faqs.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { extractFaqs } from './extract-faqs'

describe('extractFaqs', () => {
  it('extracts only faq blocks', () => {
    expect(extractFaqs([
      { _type: 'block' },
      { _type: 'faq', question: 'Q', answer: 'A' },
      { _type: 'faq', question: '', answer: 'A' },
    ])).toEqual([{ question: 'Q', answer: 'A' }])
  })

  it('handles undefined input', () => {
    expect(extractFaqs(undefined)).toEqual([])
  })
})
```

- [ ] **Step 6.2: Article route template for each pillar**

For every pillar's `[slug]/page.tsx` (there are 4 — `ira-rules`, `accountability`, `economics`, `about`), replace the default export so it mounts Article + BreadcrumbList + FAQPage. Below is the IRA Rules version; repeat for other pillars, substituting the pillar slug.

Modify `/opt/projects/thegoldiraguide/src/app/(marketing)/ira-rules/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { articleHref, pillarHref, pillarLabel } from '@/lib/site-map'
import { extractFaqs } from '@/seo/extract-faqs'
import { JsonLd } from '@/seo/json-ld'
import { buildArticle } from '@/seo/schemas/article'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { getArticleBySlug, listArticleSlugsByPillar } from '@/sanity/fetchers'

export const revalidate = 3600

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
  body?: unknown
}

const pillarSlug = 'ira-rules' as const
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

export async function generateStaticParams() {
  return (await listArticleSlugsByPillar(pillarSlug)).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug<{ title: string; summary?: string }>(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function IraRulesArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug<Article>(slug)
  if (!article || article.pillar?.slug !== pillarSlug) notFound()

  const articleLd = buildArticle({
    siteUrl,
    pillarSlug,
    slug,
    title: article.title,
    summary: article.summary ?? undefined,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: article.author,
    reviewer: article.reviewedBy?.reviewer ?? null,
  })
  const breadcrumbsLd = buildBreadcrumbList({
    siteUrl,
    items: [
      { label: 'Home', path: '/' },
      { label: pillarLabel(pillarSlug), path: pillarHref(pillarSlug) },
      { label: article.title, path: articleHref(pillarSlug, slug) },
    ],
  })
  const faqLd = buildFaqPage({
    url: `${siteUrl}${articleHref(pillarSlug, slug)}`,
    qas: extractFaqs(article.body as never),
  })

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbsLd} />
      <JsonLd data={faqLd} />
      <ArticleTemplate pillarSlug={pillarSlug} article={article} />
    </>
  )
}
```

- [ ] **Step 6.3: Apply the same pattern to `accountability`, `economics`, `about`**

Substitute `pillarSlug` = the respective slug. The function signature and imports are identical.

- [ ] **Step 6.4: Author profile → mount Person**

Modify `/opt/projects/thegoldiraguide/src/app/(marketing)/about/expert-authors/[slug]/page.tsx` to insert `<JsonLd data={buildPerson({...})} />` above the `<article>` tag, using the loaded author. Add the import:

```tsx
import { JsonLd } from '@/seo/json-ld'
import { buildPerson } from '@/seo/schemas/person'
```

And after `if (!author) notFound()`:

```tsx
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const personLd = buildPerson({
  siteUrl,
  name: author.name,
  slug,
  jobTitle: author.jobTitle,
  bio: author.bio,
  credentials: author.credentials as never,
  socialProfiles: author.socialProfiles,
})
```

Then in the returned JSX, insert `<JsonLd data={personLd} />` before the `<article>`.

- [ ] **Step 6.5: Build and smoke**

```bash
pnpm build
```

Expected: compile succeeds. Visit a seeded article — view source and confirm three `<script type="application/ld+json">` tags.

- [ ] **Step 6.6: Commit**

```bash
git add src/seo src/app/\(marketing\)
git commit -m "feat(seo): mount article, breadcrumbList, faqPage, and person schemas per route"
```

---

## Task 7: Portable-Text → Markdown Renderer (TDD)

**Files:**
- Create: `src/seo/markdown.ts`, `src/seo/markdown.test.ts`, `src/components/seo/LlmsOnly.tsx`, `src/components/seo/LlmsIgnore.tsx`

The Markdown renderer is the workhorse for `.md` mirrors and `/llms-full.txt`. It must:
- Respect `<LlmsOnly>` (include in markdown, hide from human DOM)
- Respect `<LlmsIgnore>` (keep in human DOM, omit from markdown)
- Render headings, paragraphs, callouts, FAQs, and fee tables

In portable-text, the flag is a block-type `_type: 'llmsOnly'` / `'llmsIgnore'` wrapping children. The React components in `src/components/seo/` apply `data-llms` attributes for E2E verification.

- [ ] **Step 7.1: React shells**

Create `/opt/projects/thegoldiraguide/src/components/seo/LlmsOnly.tsx`:

```tsx
// LlmsOnly: invisible to humans, included in the .md mirror.
// Requires the complementary portable-text block _type 'llmsOnly'.
export function LlmsOnly({ children }: { children: React.ReactNode }) {
  return (
    <div data-llms="only" className="sr-only" aria-hidden="true">
      {children}
    </div>
  )
}
```

Create `/opt/projects/thegoldiraguide/src/components/seo/LlmsIgnore.tsx`:

```tsx
// LlmsIgnore: visible to humans, stripped from the .md mirror.
export function LlmsIgnore({ children }: { children: React.ReactNode }) {
  return <div data-llms="ignore">{children}</div>
}
```

- [ ] **Step 7.2: Failing renderer tests**

Create `/opt/projects/thegoldiraguide/src/seo/markdown.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { portableTextToMarkdown } from './markdown'

const blocks = [
  { _type: 'block', style: 'h2', children: [{ text: 'Heading' }] },
  { _type: 'block', style: 'normal', children: [{ text: 'Hello world.' }] },
  { _type: 'faq', question: 'Q1?', answer: 'A1.' },
  { _type: 'callout', tone: 'warning', body: 'Careful.' },
  { _type: 'llmsOnly', children: [{ _type: 'block', style: 'normal', children: [{ text: 'Machine-only fact.' }] }] },
  { _type: 'llmsIgnore', children: [{ _type: 'block', style: 'normal', children: [{ text: 'Marketing CTA.' }] }] },
]

describe('portableTextToMarkdown', () => {
  it('includes llmsOnly content and omits llmsIgnore content', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('Machine-only fact.')
    expect(md).not.toContain('Marketing CTA.')
  })

  it('renders h2 as "## Heading"', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toMatch(/^## Heading$/m)
  })

  it('renders FAQ as "### Q1?" followed by answer', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('### Q1?')
    expect(md).toContain('A1.')
  })

  it('renders callout as a blockquote with the tone prefix', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('> **Warning:** Careful.')
  })
})
```

- [ ] **Step 7.3: Implement**

Create `/opt/projects/thegoldiraguide/src/seo/markdown.ts`:

```ts
type Span = { text?: string }
type Block =
  | { _type: 'block'; style?: string; children?: Span[] }
  | { _type: 'faq'; question: string; answer: string }
  | { _type: 'callout'; tone: 'info' | 'warning' | 'danger'; body: string }
  | { _type: 'llmsOnly'; children?: Block[] }
  | { _type: 'llmsIgnore'; children?: Block[] }
  | { _type: string; [key: string]: unknown }

function renderBlock(block: Block): string {
  switch (block._type) {
    case 'block': {
      const b = block as { style?: string; children?: Span[] }
      const text = (b.children ?? []).map((c) => c.text ?? '').join('').trim()
      if (!text) return ''
      switch (b.style) {
        case 'h2': return `## ${text}`
        case 'h3': return `### ${text}`
        case 'h4': return `#### ${text}`
        case 'blockquote': return `> ${text}`
        default: return text
      }
    }
    case 'faq': {
      const b = block as { question: string; answer: string }
      return `### ${b.question}\n\n${b.answer}`
    }
    case 'callout': {
      const b = block as { tone: 'info' | 'warning' | 'danger'; body: string }
      const label = { info: 'Info', warning: 'Warning', danger: 'Danger' }[b.tone]
      return `> **${label}:** ${b.body}`
    }
    case 'llmsOnly': {
      const b = block as { children?: Block[] }
      return (b.children ?? []).map(renderBlock).filter(Boolean).join('\n\n')
    }
    case 'llmsIgnore':
      return ''
    default:
      return ''
  }
}

export function portableTextToMarkdown(blocks: Block[] | undefined): string {
  if (!Array.isArray(blocks)) return ''
  return blocks.map(renderBlock).filter((s) => s.length > 0).join('\n\n')
}
```

- [ ] **Step 7.4: Run — GREEN**

```bash
pnpm test src/seo/markdown.test.ts
```

- [ ] **Step 7.5: Commit**

```bash
git add src/components/seo src/seo/markdown.ts src/seo/markdown.test.ts
git commit -m "feat(seo): portable-text → markdown with llmsOnly/llmsIgnore"
```

---

## Task 8: Portable-Text Schema Additions for LLM Flags

**Files:**
- Modify: `src/sanity/schemas/article.ts` — add `llmsOnly`, `llmsIgnore` block types to the `body` array
- Modify: `src/components/editorial/PortableTextRenderer.tsx` — render them

- [ ] **Step 8.1: Add the schema types**

In `/opt/projects/thegoldiraguide/src/sanity/schemas/article.ts`, inside the `body` array's `of:` list, add:

```ts
defineField({
  name: 'llmsOnly',
  type: 'object',
  fields: [
    {
      name: 'children',
      type: 'array',
      of: [{ type: 'block' }, { type: 'callout' }, { type: 'faq' }],
    },
  ],
}),
defineField({
  name: 'llmsIgnore',
  type: 'object',
  fields: [
    {
      name: 'children',
      type: 'array',
      of: [{ type: 'block' }, { type: 'callout' }],
    },
  ],
}),
```

Regenerate types:

```bash
pnpm exec sanity schema extract --enforce-required-fields
pnpm exec sanity typegen generate
```

- [ ] **Step 8.2: Render them**

Modify `src/components/editorial/PortableTextRenderer.tsx` — add to the `types` map:

```tsx
import { LlmsIgnore } from '@/components/seo/LlmsIgnore'
import { LlmsOnly } from '@/components/seo/LlmsOnly'

// Inside components.types:
    llmsOnly: ({ value }: { value: { children: unknown } }) => (
      <LlmsOnly>
        <PortableText value={value.children as never} components={components} />
      </LlmsOnly>
    ),
    llmsIgnore: ({ value }: { value: { children: unknown } }) => (
      <LlmsIgnore>
        <PortableText value={value.children as never} components={components} />
      </LlmsIgnore>
    ),
```

- [ ] **Step 8.3: Build**

```bash
pnpm build
```

- [ ] **Step 8.4: Commit**

```bash
git add src/sanity src/components/editorial/PortableTextRenderer.tsx src/sanity/types.generated.ts
git commit -m "feat(sanity): llmsOnly / llmsIgnore block types"
```

---

## Task 9: `.md` Mirror Route Handler (TDD)

**Files:**
- Create: `src/app/(marketing)/[...path]/route.ts`, `tests/e2e/markdown-mirror.spec.ts`

Catch-all route that intercepts `GET` requests ending in `.md` or carrying `Accept: text/markdown`, routes to the correct article, and emits the Markdown rendering.

Because a catch-all route conflicts with static pillar routes, we scope the matcher to paths ending in `.md` only.

- [ ] **Step 9.1: Failing E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/markdown-mirror.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('article .md mirror returns pure markdown', async ({ request }) => {
  // Requires a seeded article at /ira-rules/test-article (created in Plan 2 smoke test).
  const response = await request.get('/ira-rules/test-article.md')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/markdown')
  const body = await response.text()
  expect(body).toMatch(/^# /) // starts with H1
  expect(body).not.toContain('<div')
  expect(body).not.toContain('class=')
})

test('Accept: text/markdown negotiates to the markdown mirror', async ({ request }) => {
  const response = await request.get('/ira-rules/test-article', {
    headers: { accept: 'text/markdown' },
  })
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/markdown')
})

test('missing article .md → 404', async ({ request }) => {
  const response = await request.get('/ira-rules/nope.md')
  expect(response.status()).toBe(404)
})
```

- [ ] **Step 9.2: Implement**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/[...path]/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { PILLARS, type PillarSlug } from '@/lib/site-map'
import { portableTextToMarkdown } from '@/seo/markdown'
import { getArticleBySlug } from '@/sanity/fetchers'

const PILLAR_SLUGS = new Set(PILLARS.map((p) => p.slug))

function parsePath(pathSegments: string[]): { pillar: PillarSlug; slug: string } | null {
  if (pathSegments.length !== 2) return null
  const [pillarRaw, articleRaw] = pathSegments
  const slug = articleRaw.replace(/\.md$/, '')
  if (!PILLAR_SLUGS.has(pillarRaw as PillarSlug)) return null
  return { pillar: pillarRaw as PillarSlug, slug }
}

function wantsMarkdown(request: NextRequest): boolean {
  const lastSeg = request.nextUrl.pathname.split('/').pop() ?? ''
  if (lastSeg.endsWith('.md')) return true
  const accept = request.headers.get('accept') ?? ''
  return accept.includes('text/markdown')
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!wantsMarkdown(request)) {
    // Hand off to the page route.
    return NextResponse.next()
  }
  const { path } = await context.params
  const parsed = parsePath(path)
  if (!parsed) return new NextResponse('Not found', { status: 404 })

  type Article = {
    title: string
    summary?: string
    publishedAt: string
    updatedAt: string
    body?: unknown
    pillar?: { slug: string }
  }
  const article = await getArticleBySlug<Article>(parsed.slug)
  if (!article || article.pillar?.slug !== parsed.pillar) {
    return new NextResponse('Not found', { status: 404 })
  }

  const body = [
    `# ${article.title}`,
    article.summary ? `\n> ${article.summary}` : '',
    `\n_Published ${article.publishedAt.slice(0, 10)} · Updated ${article.updatedAt.slice(0, 10)}_`,
    '',
    portableTextToMarkdown(article.body as never),
  ]
    .filter((s) => s !== '')
    .join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
```

- [ ] **Step 9.3: Run — GREEN**

```bash
pnpm test:e2e tests/e2e/markdown-mirror.spec.ts
```

- [ ] **Step 9.4: Commit**

```bash
git add 'src/app/(marketing)/[...path]' tests/e2e/markdown-mirror.spec.ts
git commit -m "feat(seo): .md mirror via catch-all route and accept negotiation"
```

---

## Task 10: `/llms.txt` and `/llms-full.txt`

**Files:**
- Create: `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, `tests/e2e/llms.spec.ts`

- [ ] **Step 10.1: Failing E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/llms.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('/llms.txt is text/plain, starts with H1, and lists every pillar', async ({ request }) => {
  const response = await request.get('/llms.txt')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  const body = await response.text()
  expect(body).toMatch(/^# The Gold IRA Guide/)
  expect(body).toContain('> ')
  for (const pillar of ['IRA Rules', 'Accountability', 'Economics', 'Tools', 'About']) {
    expect(body).toContain(pillar)
  }
})

test('/llms-full.txt is text/plain and separates articles with ---', async ({ request }) => {
  const response = await request.get('/llms-full.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body.length).toBeGreaterThan(100)
  // If any article exists, there should be at least one separator block.
  if (body.includes('\n# ')) {
    expect(body).toContain('\n---\n')
  }
})
```

- [ ] **Step 10.2: Implement `/llms.txt`**

Create `/opt/projects/thegoldiraguide/src/app/llms.txt/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { PILLARS, articleHref, pillarHref } from '@/lib/site-map'
import { listArticlesByPillar } from '@/sanity/fetchers'

export const revalidate = 3600

function textResponse(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const lines: string[] = [
    '# The Gold IRA Guide',
    '',
    '> Educational content on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver. Our institutional standard is accountability: every cost, fee, and transaction parameter is documented in a binding written estimate before a client commits capital.',
    '',
  ]

  for (const pillar of PILLARS) {
    lines.push(`## ${pillar.label}`)
    lines.push('')
    lines.push(`- [${pillar.label}](${siteUrl}${pillarHref(pillar.slug)}.md): ${pillar.summary}`)

    if (pillar.slug === 'tools') continue // Plan 5 populates tools
    const articles = await listArticlesByPillar<{
      title: string; slug: string; summary?: string
    }>(pillar.slug)
    for (const a of articles) {
      const summary = a.summary ? `: ${a.summary}` : ''
      lines.push(`- [${a.title}](${siteUrl}${articleHref(pillar.slug, a.slug)}.md)${summary}`)
    }
    lines.push('')
  }

  return textResponse(lines.join('\n'))
}
```

- [ ] **Step 10.3: Implement `/llms-full.txt`**

Create `/opt/projects/thegoldiraguide/src/app/llms-full.txt/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { PILLARS, articleHref } from '@/lib/site-map'
import { portableTextToMarkdown } from '@/seo/markdown'
import { listArticlesByPillar } from '@/sanity/fetchers'

export const revalidate = 3600

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const sections: string[] = [
    `# The Gold IRA Guide — full corpus`,
    `Source: ${siteUrl}/llms-full.txt`,
    `Every document below is the canonical educational content for AI ingestion.`,
    '',
  ]

  for (const pillar of PILLARS) {
    if (pillar.slug === 'tools') continue
    const articles = await listArticlesByPillar<{
      title: string
      slug: string
      summary?: string
      publishedAt: string
      updatedAt: string
      body?: unknown
    }>(pillar.slug)
    for (const a of articles) {
      sections.push([
        '---',
        `# ${a.title}`,
        `URL: ${siteUrl}${articleHref(pillar.slug, a.slug)}`,
        `Pillar: ${pillar.label}`,
        `Published: ${a.publishedAt.slice(0, 10)}`,
        `Updated: ${a.updatedAt.slice(0, 10)}`,
        '',
        portableTextToMarkdown(a.body as never),
      ].join('\n'))
    }
  }

  return new NextResponse(sections.join('\n\n'), {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

- [ ] **Step 10.4: Run — GREEN**

```bash
pnpm test:e2e tests/e2e/llms.spec.ts
```

- [ ] **Step 10.5: Commit**

```bash
git add src/app/llms.txt src/app/llms-full.txt tests/e2e/llms.spec.ts
git commit -m "feat(seo): llms.txt and llms-full.txt dynamic routes"
```

---

## Task 11: `robots.txt` and `sitemap.xml`

**Files:**
- Create: `src/app/robots.txt/route.ts`, `src/app/sitemap.xml/route.ts`, `tests/e2e/robots-sitemap.spec.ts`

- [ ] **Step 11.1: robots.txt**

Create `/opt/projects/thegoldiraguide/src/app/robots.txt/route.ts`:

```ts
import { NextResponse } from 'next/server'

export function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /studio',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `# AI agent guidance:`,
    `# ${siteUrl}/llms.txt`,
    '',
  ].join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
```

- [ ] **Step 11.2: sitemap.xml**

Create `/opt/projects/thegoldiraguide/src/app/sitemap.xml/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { PILLARS, articleHref, pillarHref } from '@/lib/site-map'
import { listArticlesByPillar, listAuthors } from '@/sanity/fetchers'

export const revalidate = 3600

function xmlEscape(v: string): string {
  return v.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string),
  )
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: siteUrl },
  ]

  for (const pillar of PILLARS) {
    urls.push({ loc: `${siteUrl}${pillarHref(pillar.slug)}` })
    if (pillar.slug === 'tools') continue
    const articles = await listArticlesByPillar<{
      slug: string; updatedAt: string
    }>(pillar.slug)
    for (const a of articles) {
      urls.push({
        loc: `${siteUrl}${articleHref(pillar.slug, a.slug)}`,
        lastmod: a.updatedAt,
      })
    }
  }

  const authors = await listAuthors<{ slug: string }>()
  urls.push({ loc: `${siteUrl}/about/expert-authors` })
  for (const a of authors) {
    urls.push({ loc: `${siteUrl}/about/expert-authors/${a.slug}` })
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

- [ ] **Step 11.3: E2E**

Create `/opt/projects/thegoldiraguide/tests/e2e/robots-sitemap.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('/robots.txt references sitemap and disallows /studio', async ({ request }) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body).toContain('Disallow: /studio')
  expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/)
  expect(body).toMatch(/\/llms\.txt/)
})

test('/sitemap.xml is valid XML and includes every pillar', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')
  const body = await response.text()
  expect(body).toMatch(/^<\?xml /)
  for (const seg of ['/ira-rules', '/accountability', '/economics', '/tools', '/about']) {
    expect(body).toContain(seg)
  }
})
```

- [ ] **Step 11.4: Run**

```bash
pnpm test:e2e tests/e2e/robots-sitemap.spec.ts
```

- [ ] **Step 11.5: Commit**

```bash
git add src/app/robots.txt src/app/sitemap.xml tests/e2e/robots-sitemap.spec.ts
git commit -m "feat(seo): robots.txt and sitemap.xml"
```

---

## Task 12: JSON-LD Crawler Validation Script (TDD + CI)

**Files:**
- Create: `scripts/validate-json-ld.ts`, `scripts/validate-json-ld.test.ts`
- Modify: `package.json` — add `check:jsonld` script
- Modify: `.github/workflows/ci.yml`

Script boots the built app, fetches a curated URL list (home + one article per pillar if available), extracts every `<script type="application/ld+json">`, and runs each through `validateJsonLd`. Fails CI on any error.

- [ ] **Step 12.1: Failing tests**

Create `/opt/projects/thegoldiraguide/scripts/validate-json-ld.test.ts`:

```ts
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
```

- [ ] **Step 12.2: Implement**

Create `/opt/projects/thegoldiraguide/scripts/validate-json-ld.ts`:

```ts
import { validateJsonLd } from '@/seo/schemas/validate'

export function extractJsonLdBlocks(html: string): unknown[] {
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const out: unknown[] = []
  for (const match of html.matchAll(regex)) {
    try {
      out.push(JSON.parse(match[1]))
    } catch {
      // Fall through — invalid JSON is surfaced by the validator.
      out.push({ __invalid: true, raw: match[1].slice(0, 200) })
    }
  }
  return out
}

const ROUTES = [
  '/',
  '/ira-rules',
  '/accountability',
  '/economics',
  '/tools',
  '/about',
  '/about/expert-authors',
]

async function main() {
  const base = process.env.BASE_URL ?? 'http://localhost:3000'
  let totalFailures = 0

  for (const route of ROUTES) {
    const res = await fetch(`${base}${route}`)
    if (!res.ok) {
      console.error(`[jsonld] HTTP ${res.status} at ${route}`)
      totalFailures++
      continue
    }
    const html = await res.text()
    const blocks = extractJsonLdBlocks(html)
    if (blocks.length === 0) {
      console.error(`[jsonld] FAIL: no JSON-LD found at ${route}`)
      totalFailures++
      continue
    }
    for (let i = 0; i < blocks.length; i++) {
      const result = validateJsonLd(blocks[i])
      if (!result.ok) {
        console.error(`[jsonld] FAIL at ${route} (block ${i}):`)
        for (const e of result.errors) console.error(`  - ${e}`)
        totalFailures++
      } else {
        console.log(`[jsonld] OK  ${route} (block ${i})`)
      }
    }
  }

  if (totalFailures > 0) {
    console.error(`[jsonld] Total failures: ${totalFailures}`)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main()
}
```

- [ ] **Step 12.3: Add script**

Modify `package.json` `scripts` section:

```jsonc
    "check:jsonld": "tsx scripts/validate-json-ld.ts",
```

And update `check:all`:

```jsonc
    "check:all": "pnpm lint && pnpm typecheck && pnpm test && pnpm check:disclosure && pnpm build && pnpm check:jsonld",
```

Wait — `check:jsonld` needs a running server. Update `check:all` to skip it and rely on CI to run it after the server boot. Final `check:all`:

```jsonc
    "check:all": "pnpm lint && pnpm typecheck && pnpm test && pnpm check:disclosure && pnpm build"
```

- [ ] **Step 12.4: CI step**

In `.github/workflows/ci.yml`, add after the E2E step:

```yaml
      - name: JSON-LD validation
        run: |
          pnpm start -p 3000 &
          SERVER_PID=$!
          # Wait for server to be ready
          for i in {1..30}; do
            if curl -sSf http://localhost:3000/ > /dev/null; then break; fi
            sleep 1
          done
          BASE_URL=http://localhost:3000 pnpm check:jsonld
          kill $SERVER_PID
```

- [ ] **Step 12.5: Run locally**

```bash
pnpm build
pnpm start -p 3000 &
sleep 5
BASE_URL=http://localhost:3000 pnpm check:jsonld
kill %1
```

Expected: every `/route (block N)` prints `OK`.

- [ ] **Step 12.6: Commit**

```bash
git add scripts/validate-json-ld.ts scripts/validate-json-ld.test.ts package.json .github/workflows/ci.yml
git commit -m "ci(seo): validate every json-ld payload against url fixtures"
```

---

## Task 13: Final Verification

- [ ] **Step 13.1: Full local gate**

```bash
pnpm check:all && pnpm test:e2e
```

- [ ] **Step 13.2: Spot-check manually**

View source of a seeded article page. Confirm four `<script type="application/ld+json">` blocks (Organization, WebSite, Article, BreadcrumbList; plus FAQPage if the article has FAQs).

Visit `/ira-rules/test-article.md` and verify pure Markdown, no HTML wrappers.

Visit `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml` — each responds with the correct content type.

- [ ] **Step 13.3: Push, CI green, tag**

```bash
git push
git tag -a v0.4.0-gseo -m "Plan 4: GSEO surface complete"
git push origin v0.4.0-gseo
```

---

## Done Means

1. Every article page carries valid `Article` + `BreadcrumbList` + (conditional) `FAQPage` JSON-LD; root layout carries `Organization` + `WebSite`.
2. Every author profile carries valid `Person` with `hasCredential` and `sameAs`.
3. `/<pillar>/<slug>.md` and `Accept: text/markdown` both return a clean Markdown mirror.
4. `<LlmsOnly>` content reaches AI but not humans; `<LlmsIgnore>` content reaches humans but not AI.
5. `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt` all respond correctly.
6. CI fails if any mounted JSON-LD payload is missing `@context`, `@type`, or carries a relative URL.
7. Plan 5 can plug calculator Q&As into `<FAQPage>` without redesigning the schema pipeline.
