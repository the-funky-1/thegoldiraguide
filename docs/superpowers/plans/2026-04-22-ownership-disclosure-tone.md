# Plan 11: Ownership Disclosure & Editorial Tone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–10 shipped.

**Goal:** Reposition the FTC disclosure below the footer instead of above the site header, rewrite the disclosure copy to be neutral (dropping the LGS sales pitch embedded in it), add a small "An educational project by Liberty Gold Silver" lockup to the hero and footer, and remove promotional LGS language from shared components and non-`/about/` content so the site reads as an independent reference owned by LGS — not an LGS advertisement.

**Architecture:** The compliance guard (`scripts/check-disclosure.ts`) only requires `<DisclosureBanner />` to be imported and rendered in `src/app/layout.tsx` and not hidden. It does **not** constrain placement order. We move the banner from before `{children}` to after it so it renders below the footer on every page. Banner copy is rewritten to a two-sentence neutral disclosure. A new `OwnershipLockup` component renders a small "An educational project by [Liberty Gold Silver logo]" line, reused by the homepage hero and the footer. Promotional phrases are scrubbed from the homepage, pillar summaries, and the disclosure banner; a new brand-voice banned-phrase scanner (extending `scripts/check-brand-voice.ts`) prevents regression outside `/about/` pages where ownership discussion is appropriate.

**Tech stack additions:** No new runtime dependencies. Uses existing `next/image`, Tailwind tokens, Vitest, and the existing `check-brand-voice.ts` script.

**Out of scope (explicit non-goals):**
- Redesign of the homepage layout, pillar cards, or typography (covered in a follow-up visual plan).
- Dark mode or new color tokens.
- Changes to `/about/ftc-disclosure`, `/about/about-the-guide`, or other `/about/` articles — those pages are the correct place for detailed LGS discussion.
- Replacing the logo asset itself. We move `iraguiidelogo.png` (or a new LGS SVG) into `public/brand/` and reference it; sourcing a final vector logo is out of scope.
- Changes to the `organization.ts` / `website.ts` JSON-LD schemas — ownership is expressed there correctly.
- Changes to the Sanity-authored strategic content under `src/content/strategic/about/` (those are about ownership).

---

## File Structure

**Disclosure placement + copy (Task 1, 2):**
```
src/app/layout.tsx                            — MODIFY: move <DisclosureBanner /> to render after {children}
src/components/compliance/DisclosureBanner.tsx — REWRITE: neutral two-sentence disclosure
src/components/compliance/DisclosureBanner.test.tsx — REWRITE: assert new copy, drop sales-language assertions
scripts/check-disclosure.ts                   — (unchanged — still passes, placement is not constrained)
scripts/check-disclosure.test.ts              — (unchanged)
```

**Ownership lockup component (Task 3):**
```
public/brand/lgs-lockup.svg                   — CREATE: placeholder LGS wordmark SVG (plain text + gold accent, replaceable later)
src/components/brand/OwnershipLockup.tsx      — CREATE: renders "An educational project by [logo] Liberty Gold Silver"
src/components/brand/OwnershipLockup.test.tsx — CREATE: renders accessible label, link target
```

**Hero + footer copy (Task 4, 5):**
```
src/app/(marketing)/page.tsx                  — MODIFY: rewrite hero, insert <OwnershipLockup />
src/components/nav/Footer.tsx                 — MODIFY: replace "Owned and operated by…" paragraph with <OwnershipLockup />
src/components/nav/Footer.test.tsx            — MODIFY: assert lockup presence instead of old paragraph copy
```

**Pillar summary + site-map copy (Task 6):**
```
src/lib/site-map.ts                           — MODIFY: rewrite `accountability` pillar summary, neutralize `about` pillar summary
src/lib/site-map.test.ts                      — CREATE IF MISSING: assert pillars exist + summaries contain no banned phrases
```

**Brand-voice regression guard (Task 7):**
```
scripts/check-brand-voice.ts                  — MODIFY: add LGS-promotional banned phrases, scope them outside /about/ content
scripts/check-brand-voice.test.ts             — MODIFY: add tests for new phrases and path scoping
```

**Root metadata copy (Task 8):**
```
src/app/layout.tsx                            — MODIFY: rewrite <metadata.description> to drop sales phrasing
```

---

## Task 1: Move the FTC disclosure below the footer

**Files:**
- Modify: `src/app/layout.tsx`
- Verify: `scripts/check-disclosure.ts` (no edits — must still pass)

**Context:** The disclosure guard only requires (a) the import, (b) the `<DisclosureBanner>` JSX present in `layout.tsx`, and (c) no `hidden`/`sr-only`/`invisible`/`display-none` class in the 400 chars before the tag. Rendering it as the last child of `<body>` satisfies all three.

- [ ] **Step 1: Read the current layout**

Run: `cat src/app/layout.tsx`

Expected: You see `<DisclosureBanner />` rendered **before** `{children}` on line 32.

- [ ] **Step 2: Move the banner below children**

Replace the body block so the banner renders after children:

```tsx
      <body>
        <JsonLd data={buildOrganization({ siteUrl })} />
        <JsonLd data={buildWebSite({ siteUrl })} />
        {children}
        <DisclosureBanner />
      </body>
```

Full file after edit:

```tsx
import type { Metadata } from 'next'
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
import { fontMono, fontSans, fontSerif } from '@/design/typography'
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
    'Independent reference on self-directed precious metals IRAs — rules, costs, and the numbers behind them. An educational project by Liberty Gold Silver.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body>
        <JsonLd data={buildOrganization({ siteUrl })} />
        <JsonLd data={buildWebSite({ siteUrl })} />
        {children}
        <DisclosureBanner />
      </body>
    </html>
  )
}
```

Note: this step also rewrites `metadata.description` — one edit is cleanest. Task 8 verifies it in isolation if you prefer to split.

- [ ] **Step 3: Run the disclosure guard**

Run: `pnpm check:disclosure`

Expected: `[check-disclosure] OK — DisclosureBanner is present and visible.`

- [ ] **Step 4: Run the disclosure guard unit tests**

Run: `pnpm vitest run scripts/check-disclosure.test.ts`

Expected: all tests pass. These tests audit synthetic layout sources, not the real file, so they should be unaffected.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix(layout): render FTC disclosure below footer, not above header"
```

---

## Task 2: Rewrite the disclosure banner copy (neutral, no sales language)

**Files:**
- Modify: `src/components/compliance/DisclosureBanner.tsx`
- Modify: `src/components/compliance/DisclosureBanner.test.tsx`

**Context:** The current copy embeds LGS sales language ("institutional standard is accountability: every cost, fee, and transaction parameter is documented in a binding written estimate before a client commits capital"). The FTC rule under 16 CFR Part 255 requires a **clear and conspicuous** disclosure of the material connection — it does not require (or permit) sales copy. Neutral copy is more compliant, not less.

- [ ] **Step 1: Update the DisclosureBanner test to assert the new copy**

Replace the file with:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DisclosureBanner } from './DisclosureBanner'

describe('DisclosureBanner', () => {
  it('renders with the landmark role="region" and accessible name', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region).toBeInTheDocument()
  })

  it('names Liberty Gold Silver as the owning entity', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByText(/owned by Liberty Gold Silver, a precious metals dealer/i),
    ).toBeInTheDocument()
  })

  it('states that no products are sold on this site', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByText(/No products are sold on this site/i),
    ).toBeInTheDocument()
  })

  it('links to the full disclosure and the privacy policy', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByRole('link', { name: /full disclosure/i }),
    ).toHaveAttribute('href', '/about/ftc-disclosure')
    expect(
      screen.getByRole('link', { name: /privacy policy/i }),
    ).toHaveAttribute('href', '/privacy')
  })

  it('does not repeat sales language about "written estimates" or "binding"', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region.textContent ?? '').not.toMatch(/binding written estimate/i)
    expect(region.textContent ?? '').not.toMatch(/institutional standard/i)
  })

  it('is not visually hidden', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region).toBeVisible()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails against the old component**

Run: `pnpm vitest run src/components/compliance/DisclosureBanner.test.tsx`

Expected: FAIL — most assertions fail because the old copy says "wholly owned and operated…", contains "binding written estimate", and has no links.

- [ ] **Step 3: Rewrite `DisclosureBanner.tsx` with neutral copy and links**

Replace the file with:

```tsx
import Link from 'next/link'

// DO NOT modify the disclosure copy without review from legal/compliance.
// This component satisfies FTC 16 CFR Part 255 by disclosing the material
// connection between The Gold IRA Guide and Liberty Gold Silver in plain
// English. The compliance-as-code guard in `scripts/check-disclosure.ts`
// verifies this component is present and visible in `src/app/layout.tsx`.
export function DisclosureBanner() {
  return (
    <aside
      role="region"
      aria-label="FTC disclosure"
      className="w-full border-t border-brand-slate/20 bg-brand-navy text-brand-platinum"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-4 text-sm leading-relaxed">
        <strong className="block font-semibold uppercase tracking-wide">
          FTC Disclosure
        </strong>
        <p className="mt-1">
          The Gold IRA Guide is an educational resource owned by Liberty Gold
          Silver, a precious metals dealer. No products are sold on this site.
          See our{' '}
          <Link
            href="/about/ftc-disclosure"
            className="underline underline-offset-2 hover:text-brand-gold"
          >
            full disclosure
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-brand-gold"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `pnpm vitest run src/components/compliance/DisclosureBanner.test.tsx`

Expected: PASS on all assertions.

- [ ] **Step 5: Re-run the disclosure guard (placement unchanged from Task 1)**

Run: `pnpm check:disclosure`

Expected: `[check-disclosure] OK`

- [ ] **Step 6: Commit**

```bash
git add src/components/compliance/DisclosureBanner.tsx src/components/compliance/DisclosureBanner.test.tsx
git commit -m "fix(compliance): rewrite FTC disclosure in neutral language, add links"
```

---

## Task 3: Create the OwnershipLockup component

**Files:**
- Create: `public/brand/lgs-lockup.svg`
- Create: `src/components/brand/OwnershipLockup.tsx`
- Create: `src/components/brand/OwnershipLockup.test.tsx`

**Context:** A reusable "An educational project by [logo] Liberty Gold Silver" line that reads like a publishing imprint (e.g., *The Athletic by NYT*). Used in the homepage hero and the footer. The SVG is a deliberately minimal placeholder — a text wordmark with a gold bar — so the site ships with a self-contained asset and the final brand SVG can be dropped in later without code changes.

- [ ] **Step 1: Create the placeholder SVG asset**

Create `public/brand/lgs-lockup.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 24" role="img" aria-label="Liberty Gold Silver">
  <rect x="0" y="10" width="4" height="4" fill="#C9A34E"/>
  <text x="10" y="17" font-family="Georgia, serif" font-size="14" fill="currentColor">Liberty Gold Silver</text>
</svg>
```

- [ ] **Step 2: Write the failing component test**

Create `src/components/brand/OwnershipLockup.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OwnershipLockup } from './OwnershipLockup'

describe('OwnershipLockup', () => {
  it('renders the "An educational project by" preamble', () => {
    render(<OwnershipLockup />)
    expect(
      screen.getByText(/an educational project by/i),
    ).toBeInTheDocument()
  })

  it('renders the Liberty Gold Silver wordmark with an accessible image', () => {
    render(<OwnershipLockup />)
    const img = screen.getByRole('img', { name: /liberty gold silver/i })
    expect(img).toBeInTheDocument()
  })

  it('links the lockup to the /about/liberty-gold-silver page', () => {
    render(<OwnershipLockup />)
    const link = screen.getByRole('link', {
      name: /liberty gold silver/i,
    })
    expect(link).toHaveAttribute('href', '/about/liberty-gold-silver')
  })

  it('accepts a `tone` prop to switch between light and dark surfaces', () => {
    const { rerender } = render(<OwnershipLockup tone="dark" />)
    const dark = screen.getByTestId('ownership-lockup')
    expect(dark.className).toMatch(/text-brand-platinum/)

    rerender(<OwnershipLockup tone="light" />)
    const light = screen.getByTestId('ownership-lockup')
    expect(light.className).toMatch(/text-brand-slate/)
  })
})
```

- [ ] **Step 3: Run the test to confirm it fails**

Run: `pnpm vitest run src/components/brand/OwnershipLockup.test.tsx`

Expected: FAIL — module not found.

- [ ] **Step 4: Implement the component**

Create `src/components/brand/OwnershipLockup.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'

interface OwnershipLockupProps {
  tone?: 'light' | 'dark'
}

export function OwnershipLockup({ tone = 'light' }: OwnershipLockupProps) {
  const toneClass =
    tone === 'dark' ? 'text-brand-platinum/80' : 'text-brand-slate'

  return (
    <p
      data-testid="ownership-lockup"
      className={`flex items-center gap-2 text-sm ${toneClass}`}
    >
      <span>An educational project by</span>
      <Link
        href="/about/liberty-gold-silver"
        className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
      >
        <Image
          src="/brand/lgs-lockup.svg"
          alt="Liberty Gold Silver"
          width={160}
          height={24}
          className="h-5 w-auto"
        />
      </Link>
    </p>
  )
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `pnpm vitest run src/components/brand/OwnershipLockup.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/brand/lgs-lockup.svg src/components/brand/OwnershipLockup.tsx src/components/brand/OwnershipLockup.test.tsx
git commit -m "feat(brand): add OwnershipLockup component and placeholder LGS wordmark"
```

---

## Task 4: Rewrite the homepage hero and drop the promotional subtitle

**Files:**
- Modify: `src/app/(marketing)/page.tsx`
- Create: `src/app/(marketing)/page.test.tsx`

**Context:** The current hero subtitle ("Objective education … Owned and operated by Liberty Gold Silver.") doubles as an ownership claim *and* a brand pitch. We replace it with a reader-focused description and move the ownership statement into the small `<OwnershipLockup />` under the hero. Pillar grid is preserved as-is — visual redesign is a separate plan.

- [ ] **Step 1: Write the failing page test**

Create `src/app/(marketing)/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the site title as the h1', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gold ira guide/i }),
    ).toBeInTheDocument()
  })

  it('uses a reader-focused subtitle (no "owned and operated by" phrasing)', () => {
    render(<HomePage />)
    expect(
      screen.getByText(
        /independent reference on self-directed precious metals IRAs/i,
      ),
    ).toBeInTheDocument()
    const subtitle = screen.getByTestId('home-subtitle')
    expect(subtitle.textContent ?? '').not.toMatch(/owned and operated by/i)
    expect(subtitle.textContent ?? '').not.toMatch(/binding written estimate/i)
  })

  it('renders the ownership lockup below the hero', () => {
    render(<HomePage />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `pnpm vitest run 'src/app/(marketing)/page.test.tsx'`

Expected: FAIL — subtitle text + `ownership-lockup` test ID missing.

- [ ] **Step 3: Rewrite the homepage**

Replace `src/app/(marketing)/page.tsx` with:

```tsx
import Link from 'next/link'
import { OwnershipLockup } from '@/components/brand/OwnershipLockup'
import { PILLARS, pillarHref } from '@/lib/site-map'

export default function HomePage() {
  return (
    <div className="px-6 py-12">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-5xl font-bold tracking-tight">
          The Gold IRA Guide
        </h1>
        <p
          data-testid="home-subtitle"
          className="mt-6 text-lg text-brand-slate"
        >
          An independent reference on self-directed precious metals IRAs —
          the rules, the costs, and the numbers that move them.
        </p>
        <div className="mt-8 flex justify-center">
          <OwnershipLockup tone="light" />
        </div>
      </section>
      <section className="mx-auto mt-16 grid max-w-screen-xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <Link
            key={p.slug}
            href={pillarHref(p.slug)}
            className="block rounded-lg border border-brand-slate/20 bg-white p-6 hover:border-brand-gold"
          >
            <h2 className="font-serif text-xl font-semibold">{p.label}</h2>
            <p className="mt-2 text-sm text-brand-slate">{p.summary}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `pnpm vitest run 'src/app/(marketing)/page.test.tsx'`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(marketing)/page.tsx' 'src/app/(marketing)/page.test.tsx'
git commit -m "fix(home): reader-focused subtitle, move ownership to imprint lockup"
```

---

## Task 5: Replace the footer ownership paragraph with the lockup

**Files:**
- Modify: `src/components/nav/Footer.tsx`
- Modify: `src/components/nav/Footer.test.tsx`

**Context:** The footer currently has: *"Owned and operated by Liberty Gold Silver. Educational content only; not financial advice."* We replace the first sentence with `<OwnershipLockup tone="dark" />` (the ownership is clearer as a visual imprint than buried in body copy) and keep the "not financial advice" disclaimer.

- [ ] **Step 1: Update the Footer test**

Edit `src/components/nav/Footer.test.tsx` — add this `it` block inside the `describe('Footer', …)`:

```tsx
  it('renders the OwnershipLockup in the footer (ownership as imprint, not as prose)', () => {
    render(<Footer />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
    expect(
      screen.queryByText(/Owned and operated by Liberty Gold Silver\./i),
    ).not.toBeInTheDocument()
  })

  it('keeps the "not financial advice" educational disclaimer', () => {
    render(<Footer />)
    expect(
      screen.getByText(/Educational content only; not financial advice\./i),
    ).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `pnpm vitest run src/components/nav/Footer.test.tsx`

Expected: FAIL — no `ownership-lockup` test ID, old copy still present.

- [ ] **Step 3: Update `Footer.tsx`**

In `src/components/nav/Footer.tsx`, add the import at the top:

```tsx
import { OwnershipLockup } from '@/components/brand/OwnershipLockup'
```

Then replace the first grid-column block:

```tsx
        <div>
          <p className="font-serif text-lg">The Gold IRA Guide</p>
          <p className="mt-2 text-sm text-brand-platinum/80">
            Owned and operated by Liberty Gold Silver. Educational content only;
            not financial advice.
          </p>
        </div>
```

with:

```tsx
        <div>
          <p className="font-serif text-lg">The Gold IRA Guide</p>
          <p className="mt-2 text-sm text-brand-platinum/80">
            Educational content only; not financial advice.
          </p>
          <div className="mt-4">
            <OwnershipLockup tone="dark" />
          </div>
        </div>
```

- [ ] **Step 4: Run the footer test to confirm it passes**

Run: `pnpm vitest run src/components/nav/Footer.test.tsx`

Expected: PASS on all `it` blocks including the two new ones.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/Footer.tsx src/components/nav/Footer.test.tsx
git commit -m "fix(footer): replace ownership paragraph with OwnershipLockup imprint"
```

---

## Task 6: Neutralize pillar summaries in site-map

**Files:**
- Modify: `src/lib/site-map.ts`
- Create: `src/lib/site-map.test.ts`

**Context:** Two pillar summaries currently read as LGS marketing copy:
- `accountability.summary`: *"Our institutional standard: every fee, spread, storage model, and transaction parameter documented in a binding written estimate before a client commits capital."* — "Our institutional standard" positions the site as a dealer.
- `about.summary`: *"Liberty Gold Silver ownership, editorial guidelines, FTC disclosure, and expert author biographies."* — acceptable but reorder so ownership is not first-position.

These strings surface in nav, footer, `<meta>` descriptions, and JSON-LD.

- [ ] **Step 1: Write the failing site-map test**

Create `src/lib/site-map.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { PILLARS, pillarBySlug } from './site-map'

const BANNED_IN_SUMMARIES = [
  /our institutional standard/i,
  /binding written estimate/i,
  /commits capital/i,
] as const

describe('PILLARS', () => {
  it('defines all five pillars', () => {
    expect(PILLARS.map((p) => p.slug).sort()).toEqual(
      ['about', 'accountability', 'economics', 'ira-rules', 'tools'].sort(),
    )
  })

  it('contains no LGS-promotional phrases in any pillar summary', () => {
    for (const pillar of PILLARS) {
      for (const phrase of BANNED_IN_SUMMARIES) {
        expect(pillar.summary).not.toMatch(phrase)
      }
    }
  })

  it('accountability pillar summary describes the topic, not LGS\'s practice', () => {
    const accountability = pillarBySlug('accountability')
    expect(accountability?.summary).toMatch(
      /written estimates, fee disclosures, and how to verify what a dealer promises/i,
    )
  })

  it('about pillar summary leads with editorial content, not ownership', () => {
    const about = pillarBySlug('about')
    expect(about?.summary).toMatch(
      /^editorial guidelines, expert author biographies/i,
    )
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `pnpm vitest run src/lib/site-map.test.ts`

Expected: FAIL — current summaries contain banned phrases and don't match the new copy.

- [ ] **Step 3: Rewrite the two pillar summaries in `src/lib/site-map.ts`**

Change the `accountability` pillar entry:

```ts
  {
    slug: 'accountability',
    label: 'Written Accountability',
    shortLabel: 'Accountability',
    summary:
      'Written estimates, fee disclosures, and how to verify what a dealer promises before you move money.',
    order: 2,
  },
```

Change the `about` pillar entry:

```ts
  {
    slug: 'about',
    label: 'About',
    shortLabel: 'About',
    summary:
      'Editorial guidelines, expert author biographies, FTC disclosure, and the ownership relationship with Liberty Gold Silver.',
    order: 5,
  },
```

(Also drop "Institutional Accountability" as the label on `about` — that's the LGS brand voice, not an editorial identifier.)

- [ ] **Step 4: Run the test to confirm it passes**

Run: `pnpm vitest run src/lib/site-map.test.ts`

Expected: PASS.

- [ ] **Step 5: Run the full vitest suite to catch downstream snapshots or fixtures**

Run: `pnpm test`

Expected: PASS. If any nav/pillar-index/footer test asserts the old copy verbatim, update the assertion to the new copy — do not revert the site-map.

- [ ] **Step 6: Commit**

```bash
git add src/lib/site-map.ts src/lib/site-map.test.ts
git commit -m "fix(nav): neutralize accountability and about pillar summaries"
```

---

## Task 7: Extend the brand-voice guard to catch LGS-promotional phrases

**Files:**
- Modify: `scripts/check-brand-voice.ts`
- Modify: `scripts/check-brand-voice.test.ts`

**Context:** The existing banned-phrases list catches hyperbole ("guaranteed returns", "safe haven"). It does not catch LGS-specific pitch phrases. We add them and scope the rule so `/about/` strategic content (which is *supposed* to discuss the ownership relationship) is exempt.

- [ ] **Step 1: Review the current exclusion logic**

Run: `cat scripts/check-brand-voice.ts`

Expected: You see `SCANNED_GLOBS`, `BANNED_PHRASES`, and `ALLOWED_PREFIXES` including `src/content/strategic/about/accountability-standard`. We'll broaden the allow-list to cover the full `/about/` strategic directory.

- [ ] **Step 2: Update the brand-voice test first**

Edit `scripts/check-brand-voice.test.ts` — add these cases inside the existing `describe` block (or create the file if it's missing; match the existing style):

```ts
  it('flags "binding written estimate" outside /about/ content', () => {
    const violations = findBrandVoiceViolations(
      'src/components/compliance/DisclosureBanner.tsx',
      'every cost is documented in a binding written estimate before a client commits capital.',
    )
    expect(violations.map((v) => v.phrase)).toContain(
      'binding written estimate',
    )
  })

  it('flags "institutional standard" outside /about/ content', () => {
    const violations = findBrandVoiceViolations(
      'src/app/(marketing)/page.tsx',
      'Our institutional standard is accountability.',
    )
    expect(violations.map((v) => v.phrase)).toContain('institutional standard')
  })

  it('allows LGS-ownership phrases inside src/content/strategic/about/ (any file)', () => {
    const violations = findBrandVoiceViolations(
      'src/content/strategic/about/ftc-disclosures.ts',
      'The Gold IRA Guide is owned and operated by Liberty Gold Silver; binding written estimate applies on the dealer desk.',
    )
    expect(violations).toEqual([])
  })

  it('still flags the existing hyperbole phrases (regression)', () => {
    const violations = findBrandVoiceViolations(
      'src/app/(marketing)/page.tsx',
      'Gold is a safe haven with guaranteed returns.',
    )
    expect(violations.map((v) => v.phrase)).toEqual(
      expect.arrayContaining(['safe haven', 'guaranteed returns']),
    )
  })
```

- [ ] **Step 3: Run the tests — they should fail**

Run: `pnpm vitest run scripts/check-brand-voice.test.ts`

Expected: FAIL — new phrases not in banned list, `/about/` files not fully allowed.

- [ ] **Step 4: Extend `BANNED_PHRASES` and broaden `ALLOWED_PREFIXES`**

In `scripts/check-brand-voice.ts`, replace:

```ts
const BANNED_PHRASES = [
  'objective, transparent',
  'act now',
  'guaranteed returns',
  'risk-free',
  'safe haven',
  'industry secrets',
  'unlike the competition',
  'predatory',
  'hidden fees',
  'scam',
] as const

const ALLOWED_PREFIXES = [
  'src/components/charts/',
  'src/content/strategic/about/accountability-standard',
] as const
```

with:

```ts
const BANNED_PHRASES = [
  'objective, transparent',
  'act now',
  'guaranteed returns',
  'risk-free',
  'safe haven',
  'industry secrets',
  'unlike the competition',
  'predatory',
  'hidden fees',
  'scam',
  // LGS-promotional phrases that must not appear outside /about/ content.
  'binding written estimate',
  'institutional standard',
  'commits capital',
  'owned and operated by liberty gold silver',
] as const

const ALLOWED_PREFIXES = [
  'src/components/charts/',
  'src/content/strategic/about/',
] as const
```

- [ ] **Step 5: Run the tests — they should pass**

Run: `pnpm vitest run scripts/check-brand-voice.test.ts`

Expected: PASS.

- [ ] **Step 6: Run the guard against the full codebase**

Run: `pnpm check:brand-voice`

Expected: `[brand-voice] OK`. If any violations surface outside `/about/`, the earlier tasks missed a spot — fix them by editing the offending file to use neutral copy, not by adding to the allow-list.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-brand-voice.ts scripts/check-brand-voice.test.ts
git commit -m "feat(lint): extend brand-voice guard with LGS-promotional phrases, scope to /about/"
```

---

## Task 8: Verify the updated root metadata description

**Files:**
- Verify: `src/app/layout.tsx` (already edited in Task 1)
- Create: `src/app/layout.test.ts`

**Context:** Task 1 already rewrote `metadata.description`. This task adds a regression test so the description can't silently revert to sales language.

- [ ] **Step 1: Write the failing metadata test**

Create `src/app/layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { metadata } from './layout'

describe('root metadata', () => {
  it('uses a reader-focused description', () => {
    expect(metadata.description).toMatch(
      /independent reference on self-directed precious metals IRAs/i,
    )
  })

  it('does not contain LGS-promotional phrases', () => {
    const desc = (metadata.description ?? '').toLowerCase()
    expect(desc).not.toContain('binding written estimate')
    expect(desc).not.toContain('institutional standard')
    expect(desc).not.toContain('owned and operated by')
  })

  it('still names Liberty Gold Silver as the owner (disclosure requirement)', () => {
    expect(metadata.description).toMatch(/Liberty Gold Silver/)
  })
})
```

- [ ] **Step 2: Run the test**

Run: `pnpm vitest run src/app/layout.test.ts`

Expected: PASS — Task 1 already wrote the matching description.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.test.ts
git commit -m "test(meta): lock in reader-focused root metadata description"
```

---

## Task 9: Full regression pass and E2E smoke

**Files:**
- Verify everything.

- [ ] **Step 1: Run the full check suite**

Run: `pnpm check:all`

Expected: PASS across lint, typecheck, unit tests, disclosure guard, no-hex, brand-voice, llms-corpus, env-example, and build.

- [ ] **Step 2: Run the existing E2E suite**

Run: `pnpm test:e2e`

Expected: PASS. If any Playwright test selected elements by the old footer text ("Owned and operated by Liberty Gold Silver") or old hero subtitle, update the selectors to match the new copy — these tests are asserting UX we are deliberately changing, so updating them is correct.

- [ ] **Step 3: Manual visual smoke**

Start the dev server and walk the pages:

```bash
pnpm dev
```

Visit in a browser:
- `/` — hero reads reader-first, small "An educational project by Liberty Gold Silver" line below, no FTC banner at top.
- Scroll to the bottom — footer contains the lockup (dark tone), then below the footer the neutral FTC disclosure band.
- `/about` — same layout; disclosure still below footer.
- `/tools/live-spot-prices` — same.
- `/about/ftc-disclosure` — detailed disclosure article is intact (we did not touch it).

Expected: every page has the disclosure below the footer, the hero is not promotional, and the LGS imprint is present as a small lockup — not as prose.

- [ ] **Step 4: Commit any test selector updates from Step 2 (if needed)**

If you had to update Playwright selectors:

```bash
git add tests/
git commit -m "test(e2e): update selectors for new hero subtitle and footer lockup"
```

- [ ] **Step 5: Update the plans index**

Add a row for this plan in `docs/superpowers/plans/README.md` under the existing table:

```md
| 11 | Ownership Disclosure & Editorial Tone | [`2026-04-22-ownership-disclosure-tone.md`](./2026-04-22-ownership-disclosure-tone.md) | `v1.2.0-ownership-tone` |
```

Commit:

```bash
git add docs/superpowers/plans/README.md
git commit -m "docs(plans): index ownership-disclosure-tone plan"
```

- [ ] **Step 6: Open a PR**

```bash
git push -u origin HEAD
gh pr create --title "Ownership disclosure placement and editorial tone" --body "$(cat <<'EOF'
## Summary
- Move FTC disclosure below the footer instead of above the header (still on every page, still visible — compliance guard passes)
- Rewrite disclosure copy to a neutral two-sentence statement with links to the full disclosure and privacy policy
- Add `OwnershipLockup` ("An educational project by [LGS wordmark] Liberty Gold Silver") and use it in the hero and footer
- Rewrite homepage hero subtitle to be reader-focused; move ownership into the lockup
- Neutralize `accountability` and `about` pillar summaries in site-map
- Extend `check:brand-voice` with LGS-promotional banned phrases, scoped outside `/about/`

## Test plan
- [ ] `pnpm check:all` green
- [ ] `pnpm test:e2e` green
- [ ] Manual: FTC band visible below footer on `/`, `/about`, `/tools/live-spot-prices`
- [ ] Manual: hero subtitle no longer contains "Owned and operated by Liberty Gold Silver"
- [ ] Manual: small LGS lockup visible below hero and in footer
EOF
)"
```

---

## Self-Review Notes

**Spec coverage:**
- Move FTC banner below footer → Task 1
- Keep ownership visible via logo "by:" in hero → Tasks 3, 4
- Make site less promotional → Tasks 2, 4, 5, 6
- Brand-voice regression guard → Task 7
- Visual appeal improvements → explicitly deferred to a separate plan (see "Out of scope"). This plan covers tone and placement; a follow-up plan will cover hero layout, bento grid, typography treatment, and imagery.

**Type consistency:** `OwnershipLockup`'s `tone` prop uses the string literal type `'light' | 'dark'` consistently across `OwnershipLockup.tsx`, the test, the homepage (`tone="light"`), and the footer (`tone="dark"`).

**Placeholders:** None — every step contains full code, full commands, and expected output.
