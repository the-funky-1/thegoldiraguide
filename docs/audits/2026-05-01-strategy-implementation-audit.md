# Strategy Implementation Audit

Date: 2026-05-01

Scope:

- `Branded Gold IRA Education Site Strategy.md`
- `Brand Voice Skill Development_ Accountability Focus.md`
- `Designing a Financial Education Platform.md`
- `Gold IRA Content Strategy Development.md`
- `Technical Specification For Financial Platform.md`
- Current codebase in `/opt/projects/thegoldiraguide`

## Executive Summary

The core platform has been substantially implemented: Next.js 15 App Router, TypeScript, Sanity schemas/fetchers, five original strategic pillars, seeded content, global ownership disclosure, JSON-LD helpers, `llms.txt`, markdown mirrors, calculators, live spot price APIs, design tokens, security middleware, and CI gates all exist.

The codebase is not currently deployable. `pnpm typecheck`, `pnpm lint`, `pnpm test`, and the brand-voice guard fail. The most important regression is a recent expansion from the planned five-pillar IA to nine public pillars (`reviews`, `crypto`, `metals`, `plans`) without matching article routes, tests, type-safe seed construction, or brand-voice discipline.

The documents themselves also need cleanup. The older strategy/design specs push "transparency," competitor warnings, and red-flag/scam framing. The newer brand/content specs explicitly deprecate that approach in favor of accountability, written estimates, quiet luxury, and competitor silence. The codebase partially follows the newer direction, but the documents leave room for contradictory implementation.

## Done

- **Foundation stack:** Next.js 15, React 19, TypeScript, Tailwind, shadcn/Radix-adjacent primitives, Sanity, schema-dts, Recharts/ECharts dependencies, Playwright, Vitest, Semgrep, Lighthouse CI.
- **Original IA:** Five original pillars exist: `ira-rules`, `accountability`, `economics`, `tools`, `about`.
- **Content seeds:** The original 25 strategic article seeds exist, parse through Zod, and pass the reading-level validator.
- **GSEO surface:** `/llms.txt`, `/llms-full.txt`, `.md` middleware rewrites, and `/api/md/[...path]` exist. The `llms` corpus guard passes when run via `node --import tsx`.
- **Structured data:** Organization, WebSite, Article, FAQPage, BreadcrumbList, FinancialProduct, and Person schema builders exist with unit tests.
- **Disclosure:** `DisclosureBanner` exists and static disclosure guard passes. The copy states Liberty Gold Silver ownership and that no products are sold on the site.
- **Security:** Middleware sets CSP, HSTS, frame, MIME, referrer, and permissions headers.
- **Tools:** Fee drag, ROI, spread markup, RMD, correlation, written-estimate checklist, and live spot price pages/components exist.
- **Accessibility/design:** Tokenized palette, global focus ring, touch target minimums, chart data tables, and axe-style E2E coverage exist.
- **CI intent:** `.github/workflows/ci.yml` includes lint, typecheck, tests, content validation, disclosure, color, brand voice, LLM corpus, env, bundle, E2E, Semgrep, and Lighthouse gates.

## Not Done / Broken

1. **Build health is broken.**
   - `pnpm typecheck` fails with `TS2554` in:
     - `src/content/strategic/reviews/top-gold-ira-companies.ts`
     - `src/content/strategic/crypto/bitcoin-ira-guide.ts`
     - `src/content/strategic/metals/silver-ira-guide.ts`
     - `src/content/strategic/plans/roth-ira-gold.ts`
   - Cause: `block(key, b)` accepts two arguments, but those files pass multiple blocks/callouts. JavaScript ignores the extra runtime arguments, so content is both type-invalid and partially dropped.

2. **Unit tests are stale against the IA.**
   - Tests still assert exactly five pillars and 25 seeds.
   - Current code defines nine pillars and 29 seeds.
   - Failing suites:
     - `src/lib/site-map.test.ts`
     - `src/components/nav/PillarNavigationMenu.test.tsx`
     - `src/content/strategic/index.test.ts`

3. **Lint is broken.**
   - `.worktrees/debt-trap-calculator/next-env.d.ts` is being linted.
   - `scripts/fk-test.ts` has an unused `faq` import and appears to be scratch/test debris.

4. **Brand voice is broken in new content.**
   - `node --import tsx scripts/check-brand-voice.ts` fails on `hidden fees` in `top-gold-ira-companies.ts`.
   - The same file also uses competitor-bashing and promotional framing: "bad company," "traps," "massive spreads," "Top Picks," and "honest partner."
   - The `crypto`, `metals`, and `plans` seeds contain hyperbolic or compliance-risk language such as "Ultimate Guide," "protect your wealth," "safety and high growth potential," "great tax breaks," and "massive tax perks."

5. **New pillars are not fully routable.**
   - Index pages exist for `/reviews`, `/crypto`, `/metals`, and `/plans`.
   - There are no matching `[slug]` article routes for these pillars, so index cards will point to paths with no page implementation.
   - This expansion is also not in the five-pillar strategy documents.

6. **Disclosure placement does not match the spec.**
   - The specs repeatedly require disclosure in the global header or immediate hero area.
   - The implementation renders `DisclosureBanner` after `{children}` in `src/app/layout.tsx`, which means it appears after page content, not before the reader engages.
   - The static guard checks presence/visibility, not placement before content.

7. **Schema implementation is present but incomplete against the ambition.**
   - FinancialProduct helpers exist, but article pages currently emit Article/Breadcrumb/FAQ. They do not switch schema emission based on `schemaJsonLdType`.
   - The docs ask for FinancialProduct/InvestmentOrSavingsProduct on IRA mechanics and fees. That is not consistently wired into article route rendering.

8. **Real-time market-data implementation is REST polling, not WebSockets.**
   - The technical spec calls for low-latency WebSocket providers for live tickers.
   - Current implementation fetches MetalpriceAPI over REST and refreshes client-side. That is acceptable for an educational reference, but it does not meet the stated WebSocket architecture.

9. **Markdown mirrors depend on Sanity availability and seeded deployment state.**
   - The mirror route fetches articles from Sanity only.
   - Local seed files exist, but public article routes and markdown mirrors do not fall back to them if Sanity is empty/unavailable.
   - `/llms.txt` catches Sanity errors and skips article listings, which can silently produce a thin AI corpus.

10. **No project-local brand voice skill exists.**
    - The brand-voice document says to save the skill under `.agents/skills/brand-voice/`.
    - No `.agents/skills/brand-voice/SKILL.md` exists in the repo.
    - There is a static brand-voice scanner, but it is narrower than the proposed SKILL.md artifact and does not catch many risky phrases present in the new seeds.

## What Was Missed

- A clear decision log for the strategy pivot from "transparency and red flags" to "accountability and competitor silence."
- A route factory or generic pillar article route that would make future pillar expansion safe.
- A content contract that prevents multi-block `block(...)` misuse at compile time and catches dropped content in seed validation.
- Placement-specific FTC disclosure tests.
- Schema tests that assert the route emits the schema selected by `schemaJsonLdType`.
- A Sanity-empty deployment smoke test. Several index pages degrade to "No articles published yet," which may pass technically but fail launch readiness.
- A production content QA pass for financial/compliance phrasing beyond the simple banned-word list.
- Dependency hygiene around scratch worktrees and experimental scripts.

## What Was Done Poorly In The Documents

- **The strategy conflicts with itself.** Older docs prescribe `/transparency/*`, "red flags," "scams," and exposing competitors. Newer docs prohibit competitor acknowledgement and deprecate "transparency." The implementation cannot satisfy both.
- **The documents overstate llms.txt.** `llms.txt` is useful as a low-cost machine-readable surface, but the docs treat it as a non-negotiable citation lever. Current public evidence remains mixed; it should be framed as experimental support, not a guaranteed AI visibility mechanism.
- **The legal/compliance language is too absolute.** Phrases like "automatically insulates itself from regulatory scrutiny" are not defensible. A written estimate and conspicuous disclosure reduce risk; they do not remove it.
- **The technical spec asks for more than the product likely needs.** WebSockets, sub-50ms pricing, massive chart datasets, and broad AI-crawler claims add complexity without proving they serve the educational use case.
- **The five-pillar IA should have been explicitly protected.** The docs and original tests assume five pillars. The later addition of reviews/crypto/metals/plans indicates there was no clear rule for whether these are pillars, sub-pillars, or future expansions.
- **The source quality is uneven.** Some cited claims rely on SEO/vendor blog posts, speculative 2026 trend pieces, and future-dated assertions. For YMYL content, primary sources should dominate wherever legal, tax, or regulatory claims are made.

## Validation Run

- `pnpm typecheck`: fail.
- `pnpm lint`: fail.
- `pnpm test`: fail, 4 failed tests across 3 suites.
- `node --import tsx scripts/check-disclosure.ts`: pass.
- `node --import tsx scripts/check-brand-voice.ts`: fail.
- `node --import tsx scripts/check-llms-corpus.ts`: pass.
- `node --import tsx scripts/check-no-hex-in-components.ts`: pass.
- `node --import tsx scripts/validate-strategic-content.ts`: pass, 29 seeds OK.

The `pnpm check:*` commands that use `tsx` directly hit sandbox IPC restrictions locally, so the equivalent `node --import tsx` commands were used for the audit.

## Recommended Next Work

1. Restore deployability first: fix the four new seed files, remove/scope scratch files, then rerun lint/typecheck/tests.
2. Decide whether the canonical IA is five pillars or nine. If nine, add article routes, tests, schema, sitemap, and content QA for the new pillars. If five, move reviews/crypto/metals/plans out of primary pillar navigation.
3. Move disclosure to the header or top-of-page position and strengthen the guard to assert it appears before `main`.
4. Create `.agents/skills/brand-voice/SKILL.md` from the accountability document and expand the brand-voice guard to catch hyperbole, competitor framing, "best/top picks," "protect your wealth," and tax/safety claims.
5. Wire `schemaJsonLdType` into article route rendering and add tests proving FinancialProduct/HowTo/FAQPage are emitted where selected.
6. Amend the source strategy docs with an explicit "current canonical strategy" section: accountability over transparency, competitor silence, five-pillar scope unless changed by decision record, and llms.txt as experimental support.

## External Reference Check

- FTC guidance supports the need for clear/conspicuous disclosure of unexpected material connections and warns that hyperlink-only disclosures can be insufficient.
- IRS guidance confirms IRC Section 408(m) treatment of collectibles and exceptions for certain coins/metals held by a bank or approved non-bank trustee.
- Public llms.txt status remains mixed; it is not equivalent to an official search-engine standard with guaranteed citation behavior.
