# Foundation & Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployable Next.js 15 + TypeScript skeleton on Vercel with strict security headers, a hard-coded global FTC DisclosureBanner, and a CI pipeline that blocks merges on lint, typecheck, unit tests, E2E, axe-core a11y, Semgrep SAST, and a compliance-as-code guard.

**Architecture:** Monolithic Next.js 15 App Router project at the repo root. Every compliance guarantee is enforced architecturally — security headers in `middleware.ts`, disclosure in `app/layout.tsx`, the disclosure guard in a CI-run static check. Every guarantee has a test.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v3.4, shadcn/ui scaffolding (components.json + `cn` util only — no components pulled in), Vitest + jsdom, Playwright + @axe-core/playwright, pnpm, ESLint (flat config), Prettier, Semgrep, GitHub Actions, Vercel.

**Out of scope (deferred to later plans):** Sanity CMS and content schemas (Plan 2), pillar routes and navigation (Plan 3), JSON-LD / llms.txt / `.md` mirrors (Plan 4), calculators (Plan 5), live spot price WebSockets (Plan 6), charts (Plan 7), final design tokens and visual polish (Plan 8). This plan's home page is an intentional placeholder.

---

## File Structure

- `package.json`, `pnpm-lock.yaml`, `.nvmrc`, `.gitignore`, `.env.example`, `README.md`
- `tsconfig.json`, `next.config.ts`, `next-env.d.ts`
- `tailwind.config.ts`, `postcss.config.mjs`, `components.json`
- `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`
- `vitest.config.ts`, `vitest.setup.ts`
- `playwright.config.ts`
- `semgrep.yml`, `.semgrepignore`
- `.github/workflows/ci.yml`
- `src/app/layout.tsx` — hard-codes `<DisclosureBanner />`
- `src/app/page.tsx` — placeholder home
- `src/app/globals.css` — Tailwind layers
- `src/app/not-found.tsx`
- `src/components/compliance/DisclosureBanner.tsx`
- `src/components/compliance/DisclosureBanner.test.tsx`
- `src/lib/cn.ts` + `src/lib/cn.test.ts`
- `src/middleware.ts`
- `tests/e2e/home.spec.ts`
- `tests/e2e/security-headers.spec.ts`
- `tests/e2e/disclosure.spec.ts`
- `tests/e2e/a11y.spec.ts`
- `scripts/check-disclosure.ts` + `scripts/check-disclosure.test.ts`

Design rule for this plan: **every file has one responsibility.** `middleware.ts` only sets headers, `DisclosureBanner.tsx` only renders the banner, `check-disclosure.ts` only validates one file.

---

## Task 1: Initialize Repo and Toolchain

**Files:**
- Create: `.nvmrc`, `.gitignore`, `package.json`, `README.md`, `.env.example`

- [ ] **Step 1.1: Initialize git**

```bash
cd /opt/projects/thegoldiraguide
git init -b main
```

Expected: `Initialized empty Git repository in /opt/projects/thegoldiraguide/.git/`.

- [ ] **Step 1.2: Pin Node via `.nvmrc`**

Create `/opt/projects/thegoldiraguide/.nvmrc`:

```
20.18.0
```

- [ ] **Step 1.3: Write `.gitignore`**

Create `/opt/projects/thegoldiraguide/.gitignore`:

```gitignore
node_modules
.next
out
dist
coverage
.playwright
test-results
playwright-report
.env
.env.local
.env.*.local
.DS_Store
*.log
.vercel
.turbo
.vscode/*
!.vscode/settings.json
.idea
```

- [ ] **Step 1.4: Write `.env.example`**

Create `/opt/projects/thegoldiraguide/.env.example`:

```env
# Public site URL used for canonical tags and absolute OG URLs.
NEXT_PUBLIC_SITE_URL=https://www.thegoldiraguide.com

# Reserved for later plans:
# SANITY_PROJECT_ID=
# SANITY_DATASET=
# SANITY_API_READ_TOKEN=
# METALS_API_KEY=
```

- [ ] **Step 1.5: Write a minimal `README.md`**

Create `/opt/projects/thegoldiraguide/README.md`:

```markdown
# thegoldiraguide

Branded educational hub for Liberty Gold Silver. Next.js 15 + TypeScript. YMYL-compliant.

## Local setup

```bash
nvm use
corepack enable
pnpm install
pnpm dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run dev server at http://localhost:3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm check:disclosure` | Static guard: FTC banner is hard-coded in root layout |
| `pnpm check:all` | Run every gate the CI pipeline runs |

See `docs/superpowers/plans/` for the full implementation roadmap.
```

- [ ] **Step 1.6: Initialize `package.json` via pnpm**

```bash
corepack enable
corepack prepare pnpm@9.12.0 --activate
pnpm init
```

Expected: file `package.json` exists with default fields.

- [ ] **Step 1.7: Overwrite `package.json` with the canonical version**

Replace `/opt/projects/thegoldiraguide/package.json` with:

```json
{
  "name": "thegoldiraguide",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "engines": {
    "node": ">=20.18.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "check:disclosure": "tsx scripts/check-disclosure.ts",
    "check:all": "pnpm lint && pnpm typecheck && pnpm test && pnpm check:disclosure && pnpm build"
  }
}
```

- [ ] **Step 1.8: Commit**

```bash
git add .nvmrc .gitignore .env.example README.md package.json
git commit -m "chore: initialize repo, pin node, scaffold package scripts"
```

Expected: commit succeeds; `git log --oneline` shows one commit.

---

## Task 2: Next.js 15 App Skeleton

**Files:**
- Create: `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`

- [ ] **Step 2.1: Install Next.js 15 + React 19 + TypeScript**

```bash
pnpm add next@^15.0.0 react@^19.0.0 react-dom@^19.0.0
pnpm add -D typescript @types/node @types/react @types/react-dom tsx
```

Expected: install completes, `pnpm-lock.yaml` created.

- [ ] **Step 2.2: Write `tsconfig.json`**

Create `/opt/projects/thegoldiraguide/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules", ".next", "playwright-report", "test-results"]
}
```

- [ ] **Step 2.3: Write `next.config.ts`**

Create `/opt/projects/thegoldiraguide/next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
  },
  // Security headers are set in middleware so the CSP nonce is per-request.
  // Do not duplicate them here.
}

export default nextConfig
```

- [ ] **Step 2.4: Create `next-env.d.ts`**

Create `/opt/projects/thegoldiraguide/next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
```

- [ ] **Step 2.5: Create a minimal root layout (no banner yet — added in Task 7)**

Create `/opt/projects/thegoldiraguide/src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Gold IRA Guide',
  description:
    'Institutional education on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2.6: Create placeholder home page**

Create `/opt/projects/thegoldiraguide/src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>The Gold IRA Guide</h1>
      <p>Infrastructure online. Content pillars are being populated.</p>
    </main>
  )
}
```

- [ ] **Step 2.7: Create not-found route**

Create `/opt/projects/thegoldiraguide/src/app/not-found.tsx`:

```tsx
export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
    </main>
  )
}
```

- [ ] **Step 2.8: Create empty `globals.css` placeholder (filled in Task 3)**

Create `/opt/projects/thegoldiraguide/src/app/globals.css`:

```css
/* Tailwind layers are added in Task 3. */
```

- [ ] **Step 2.9: Run typecheck and build**

```bash
pnpm typecheck
pnpm build
```

Expected: `pnpm typecheck` exits 0; `pnpm build` exits 0 and reports a compiled `/` route.

- [ ] **Step 2.10: Commit**

```bash
git add tsconfig.json next.config.ts next-env.d.ts src/app package.json pnpm-lock.yaml
git commit -m "feat: scaffold Next.js 15 app router with strict typescript"
```

---

## Task 3: Tailwind CSS Setup

**Files:**
- Create: `tailwind.config.ts`, `postcss.config.mjs`
- Modify: `src/app/globals.css`

- [ ] **Step 3.1: Install Tailwind and peers**

```bash
pnpm add -D tailwindcss@^3.4.0 postcss autoprefixer
```

- [ ] **Step 3.2: Create `tailwind.config.ts`**

Create `/opt/projects/thegoldiraguide/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Placeholder fiduciary palette — finalized in Plan 8.
        'ledger-navy': '#0B1F3B',
        'slate-charcoal': '#4B5563',
        platinum: '#F8FAFC',
        'old-gold': '#D4AF37',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3.3: Create `postcss.config.mjs`**

Create `/opt/projects/thegoldiraguide/postcss.config.mjs`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3.4: Populate `globals.css` with Tailwind layers**

Replace `/opt/projects/thegoldiraguide/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Fiduciary base — placeholder until Plan 8. */
:root {
  color-scheme: light;
}

html {
  scroll-padding-top: 4rem; /* WCAG 2.4.11 Focus Not Obscured */
}

body {
  @apply bg-platinum text-ledger-navy antialiased;
}
```

- [ ] **Step 3.5: Verify build**

```bash
pnpm build
```

Expected: build succeeds; `.next/` output contains compiled CSS.

- [ ] **Step 3.6: Commit**

```bash
git add tailwind.config.ts postcss.config.mjs src/app/globals.css package.json pnpm-lock.yaml
git commit -m "feat: wire tailwind v3 with placeholder fiduciary tokens"
```

---

## Task 4: shadcn/ui `cn` Utility (TDD)

**Files:**
- Create: `components.json`, `src/lib/cn.ts`, `src/lib/cn.test.ts`

- [ ] **Step 4.1: Install `clsx` + `tailwind-merge`**

```bash
pnpm add clsx tailwind-merge
```

- [ ] **Step 4.2: Add `components.json` so future `npx shadcn add` calls work**

Create `/opt/projects/thegoldiraguide/components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": false,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/cn",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 4.3: Write failing test for `cn`**

Create `/opt/projects/thegoldiraguide/src/lib/cn.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind utilities, keeping the later one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
```

(Vitest is not installed yet — this test is written now but only run in Task 5 after Vitest is set up. This is intentional: the test file is the spec.)

- [ ] **Step 4.4: Implement `cn`**

Create `/opt/projects/thegoldiraguide/src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4.5: Commit (tests still pending — Task 5 runs them)**

```bash
git add components.json src/lib/cn.ts src/lib/cn.test.ts package.json pnpm-lock.yaml
git commit -m "feat: add cn class-merge utility and shadcn components.json"
```

---

## Task 5: Vitest Setup and First Green Test

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`

- [ ] **Step 5.1: Install Vitest and jsdom**

```bash
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 5.2: Write `vitest.config.ts`**

Create `/opt/projects/thegoldiraguide/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    exclude: ['node_modules', '.next', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/app/**/layout.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5.3: Write `vitest.setup.ts`**

Create `/opt/projects/thegoldiraguide/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5.4: Run the `cn` tests — expect GREEN**

```bash
pnpm test
```

Expected: 3 tests pass in `src/lib/cn.test.ts`. Exit code 0.

- [ ] **Step 5.5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json pnpm-lock.yaml
git commit -m "test: wire vitest with jsdom and testing-library"
```

---

## Task 6: Playwright Setup and Home Smoke E2E

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/home.spec.ts`

- [ ] **Step 6.1: Install Playwright**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

- [ ] **Step 6.2: Write `playwright.config.ts`**

Create `/opt/projects/thegoldiraguide/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
```

- [ ] **Step 6.3: Write failing home smoke test**

Create `/opt/projects/thegoldiraguide/tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('home page renders the canonical H1', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('h1')).toHaveText('The Gold IRA Guide')
})
```

- [ ] **Step 6.4: Run E2E — expect GREEN**

```bash
pnpm test:e2e
```

Expected: 1 passed. The webServer config builds and starts the app automatically.

- [ ] **Step 6.5: Commit**

```bash
git add playwright.config.ts tests/e2e/home.spec.ts package.json pnpm-lock.yaml
git commit -m "test: add playwright e2e harness and home smoke test"
```

---

## Task 7: FTC DisclosureBanner (Strict TDD)

**Files:**
- Create: `src/components/compliance/DisclosureBanner.tsx`, `src/components/compliance/DisclosureBanner.test.tsx`, `tests/e2e/disclosure.spec.ts`
- Modify: `src/app/layout.tsx`

The disclosure text below is mandated by the brand/legal strategy in `Branded Gold IRA Education Site Strategy.md` §"Clear and Conspicuous Mandate". It must not be paraphrased by implementers.

- [ ] **Step 7.1: Write failing unit tests**

Create `/opt/projects/thegoldiraguide/src/components/compliance/DisclosureBanner.test.tsx`:

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
      screen.getByText(/wholly owned and operated by Liberty Gold Silver/i),
    ).toBeInTheDocument()
  })

  it('explicitly states no outbound sales calls and no on-site product sales', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByText(/do not sell products on this site/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/do not capture your data for outbound sales calls/i),
    ).toBeInTheDocument()
  })

  it('is not visually hidden', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    // CSS-based hiding (display:none, visibility:hidden, opacity:0) fails this assertion.
    expect(region).toBeVisible()
  })

  it('accepts no prop to suppress itself', () => {
    // Compile-time contract: component takes zero props. This runtime assertion
    // just guards against regressions where props sneak in.
    const result = render(<DisclosureBanner />)
    expect(result.container.firstChild).not.toBeNull()
  })
})
```

- [ ] **Step 7.2: Run test — expect RED**

```bash
pnpm test src/components/compliance/DisclosureBanner.test.tsx
```

Expected: FAIL with "Cannot find module './DisclosureBanner'".

- [ ] **Step 7.3: Implement `DisclosureBanner`**

Create `/opt/projects/thegoldiraguide/src/components/compliance/DisclosureBanner.tsx`:

```tsx
// DO NOT modify the disclosure copy without review from legal/compliance.
// This component satisfies FTC 16 CFR Part 255 and the brand's defensive
// marketing mandate. The compliance-as-code guard in
// `scripts/check-disclosure.ts` verifies this component is present in
// `src/app/layout.tsx`.
export function DisclosureBanner() {
  return (
    <aside
      role="region"
      aria-label="FTC disclosure"
      className="w-full bg-ledger-navy text-platinum"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-4 text-sm leading-relaxed">
        <strong className="block font-semibold uppercase tracking-wide">
          FTC Disclosure
        </strong>
        <p className="mt-1">
          The Gold IRA Guide is a branded educational resource wholly owned
          and operated by Liberty Gold Silver. We do not sell products on
          this site, and we do not capture your data for outbound sales
          calls. Our institutional standard is accountability: every cost,
          fee, and transaction parameter is documented in a binding written
          estimate before a client commits capital.
        </p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 7.4: Run test — expect GREEN**

```bash
pnpm test src/components/compliance/DisclosureBanner.test.tsx
```

Expected: all 5 tests pass.

- [ ] **Step 7.5: Mount in root layout**

Replace `/opt/projects/thegoldiraguide/src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Gold IRA Guide',
  description:
    'Institutional education on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DisclosureBanner />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7.6: Write failing E2E: banner present on every route**

Create `/opt/projects/thegoldiraguide/tests/e2e/disclosure.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/definitely-not-a-real-page']

for (const route of ROUTES) {
  test(`disclosure banner is visible on ${route}`, async ({ page }) => {
    await page.goto(route)
    const region = page.getByRole('region', { name: /ftc disclosure/i })
    await expect(region).toBeVisible()
    await expect(region).toContainText('Liberty Gold Silver')
    await expect(region).toContainText('do not sell products on this site')
  })
}
```

- [ ] **Step 7.7: Run E2E — expect GREEN**

```bash
pnpm test:e2e tests/e2e/disclosure.spec.ts
```

Expected: 2 passed (home + 404 route both show the banner).

- [ ] **Step 7.8: Commit**

```bash
git add src/components/compliance src/app/layout.tsx tests/e2e/disclosure.spec.ts
git commit -m "feat(compliance): hard-code ftc disclosure banner in root layout"
```

---

## Task 8: Security Headers Middleware (TDD via E2E)

**Files:**
- Create: `src/middleware.ts`, `tests/e2e/security-headers.spec.ts`

The CSP uses `'nonce-<random>' 'strict-dynamic'` for scripts (the critical XSS vector). For styles we accept `'self' 'unsafe-inline'` as a conscious compromise — Next.js 15 injects inline styles at runtime and Tailwind's build output is safe; strict style nonces are deferred to Plan 8 once the design system is frozen.

- [ ] **Step 8.1: Write failing E2E for headers**

Create `/opt/projects/thegoldiraguide/tests/e2e/security-headers.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('home response carries required security headers', async ({ request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)

  const headers = response.headers()

  expect(headers['strict-transport-security']).toBe(
    'max-age=31536000; includeSubDomains; preload',
  )
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['permissions-policy']).toBe(
    'camera=(), microphone=(), geolocation=()',
  )

  const csp = headers['content-security-policy']
  expect(csp).toBeDefined()
  expect(csp).toMatch(/default-src 'self'/)
  expect(csp).toMatch(/script-src [^;]*'nonce-[A-Za-z0-9+/=]+'/)
  expect(csp).toMatch(/'strict-dynamic'/)
  expect(csp).toMatch(/frame-ancestors 'none'/)
  expect(csp).toMatch(/object-src 'none'/)
  expect(csp).toMatch(/base-uri 'self'/)
  expect(csp).toMatch(/upgrade-insecure-requests/)
})

test('nonce differs across two requests', async ({ request }) => {
  const a = await request.get('/')
  const b = await request.get('/')
  const extract = (h: Record<string, string>): string | null => {
    const match = h['content-security-policy']?.match(/'nonce-([^']+)'/)
    return match ? match[1] : null
  }
  const nonceA = extract(a.headers())
  const nonceB = extract(b.headers())
  expect(nonceA).not.toBeNull()
  expect(nonceB).not.toBeNull()
  expect(nonceA).not.toBe(nonceB)
})

test('x-powered-by header is absent', async ({ request }) => {
  const response = await request.get('/')
  expect(response.headers()['x-powered-by']).toBeUndefined()
})
```

- [ ] **Step 8.2: Run E2E — expect RED**

```bash
pnpm test:e2e tests/e2e/security-headers.spec.ts
```

Expected: FAIL — no CSP header present.

- [ ] **Step 8.3: Implement middleware**

Create `/opt/projects/thegoldiraguide/src/middleware.ts`:

```ts
import { type NextRequest, NextResponse } from 'next/server'

function buildCsp(nonce: string): string {
  // `'strict-dynamic'` lets nonce-approved scripts load their own dependencies
  // without needing to whitelist each origin. See Google CSP evaluator guidance.
  // Styles accept 'self' + 'unsafe-inline' as a documented compromise; tightened
  // in Plan 8 once the design system is frozen.
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [`'self'`, `'nonce-${nonce}'`, `'strict-dynamic'`],
    'style-src': [`'self'`, `'unsafe-inline'`],
    'img-src': [`'self'`, 'blob:', 'data:'],
    'font-src': [`'self'`],
    'connect-src': [`'self'`],
    'object-src': [`'none'`],
    'base-uri': [`'self'`],
    'form-action': [`'self'`],
    'frame-ancestors': [`'none'`],
    'upgrade-insecure-requests': [],
  }

  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
    .join('; ')
}

export function middleware(request: NextRequest): NextResponse {
  const nonce = btoa(crypto.randomUUID())
  const csp = buildCsp(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('content-security-policy', csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  )

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

- [ ] **Step 8.4: Run E2E — expect GREEN**

```bash
pnpm test:e2e tests/e2e/security-headers.spec.ts
```

Expected: 3 passed.

- [ ] **Step 8.5: Verify home smoke + disclosure E2E still pass**

```bash
pnpm test:e2e
```

Expected: all 6 E2E tests pass.

- [ ] **Step 8.6: Commit**

```bash
git add src/middleware.ts tests/e2e/security-headers.spec.ts
git commit -m "feat(security): per-request nonce csp and hardened response headers"
```

---

## Task 9: Compliance-as-Code Guard (TDD)

**Files:**
- Create: `scripts/check-disclosure.ts`, `scripts/check-disclosure.test.ts`

The guard is a static check that runs in CI and fails the build if `src/app/layout.tsx` stops importing or rendering `DisclosureBanner`. It does not replace the E2E test in Task 7 — both must pass.

- [ ] **Step 9.1: Write failing unit tests**

Create `/opt/projects/thegoldiraguide/scripts/check-disclosure.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { auditLayoutSource, type AuditResult } from './check-disclosure'

const passingLayout = `
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
export default function RootLayout({ children }) {
  return (<html><body><DisclosureBanner /><main>{children}</main></body></html>)
}
`

const missingImport = `
export default function RootLayout({ children }) {
  return (<html><body><DisclosureBanner /><main>{children}</main></body></html>)
}
`

const missingRender = `
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
export default function RootLayout({ children }) {
  return (<html><body><main>{children}</main></body></html>)
}
`

const hiddenViaClass = `
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
export default function RootLayout({ children }) {
  return (<html><body><div className="hidden"><DisclosureBanner /></div><main>{children}</main></body></html>)
}
`

describe('auditLayoutSource', () => {
  it('passes when the banner is imported and rendered', () => {
    const result: AuditResult = auditLayoutSource(passingLayout)
    expect(result.ok).toBe(true)
    expect(result.violations).toEqual([])
  })

  it('fails when the import is missing', () => {
    const result = auditLayoutSource(missingImport)
    expect(result.ok).toBe(false)
    expect(result.violations).toContain('missing-import')
  })

  it('fails when the JSX render is missing', () => {
    const result = auditLayoutSource(missingRender)
    expect(result.ok).toBe(false)
    expect(result.violations).toContain('missing-jsx')
  })

  it('fails when the banner is wrapped in a class containing "hidden"', () => {
    const result = auditLayoutSource(hiddenViaClass)
    expect(result.ok).toBe(false)
    expect(result.violations).toContain('hidden-wrapper')
  })
})
```

- [ ] **Step 9.2: Run test — expect RED**

```bash
pnpm test scripts/check-disclosure.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 9.3: Implement the guard**

Create `/opt/projects/thegoldiraguide/scripts/check-disclosure.ts`:

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type Violation = 'missing-import' | 'missing-jsx' | 'hidden-wrapper'

export interface AuditResult {
  ok: boolean
  violations: Violation[]
}

export function auditLayoutSource(source: string): AuditResult {
  const violations: Violation[] = []

  const importRegex =
    /import\s+\{\s*DisclosureBanner\s*\}\s+from\s+['"]@\/components\/compliance\/DisclosureBanner['"]/
  if (!importRegex.test(source)) violations.push('missing-import')

  const jsxRegex = /<DisclosureBanner\b/
  if (!jsxRegex.test(source)) violations.push('missing-jsx')

  // Crude but effective: any ancestor element carrying `hidden` or
  // `display-none` style tokens within 200 chars preceding the banner fails.
  const wrapperRegex =
    /className=["'][^"']*(?:hidden|display-none|invisible|sr-only)[^"']*["'][^<]{0,400}<DisclosureBanner\b/
  if (wrapperRegex.test(source)) violations.push('hidden-wrapper')

  return { ok: violations.length === 0, violations }
}

function main(): void {
  const layoutPath = resolve(process.cwd(), 'src/app/layout.tsx')
  const source = readFileSync(layoutPath, 'utf8')
  const result = auditLayoutSource(source)

  if (!result.ok) {
    console.error(
      `[check-disclosure] FAIL — ${layoutPath}\n  violations: ${result.violations.join(', ')}`,
    )
    process.exit(1)
  }

  console.log('[check-disclosure] OK — DisclosureBanner is present and visible.')
}

// Only run main() when invoked as a script, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
```

- [ ] **Step 9.4: Run test — expect GREEN**

```bash
pnpm test scripts/check-disclosure.test.ts
```

Expected: 4 passed.

- [ ] **Step 9.5: Run the guard against the real layout — expect OK**

```bash
pnpm check:disclosure
```

Expected: `[check-disclosure] OK — DisclosureBanner is present and visible.`, exit 0.

- [ ] **Step 9.6: Commit**

```bash
git add scripts/check-disclosure.ts scripts/check-disclosure.test.ts
git commit -m "feat(compliance): static guard enforces disclosure banner in root layout"
```

---

## Task 10: axe-core Accessibility E2E

**Files:**
- Create: `tests/e2e/a11y.spec.ts`

- [ ] **Step 10.1: Install axe-core/playwright**

```bash
pnpm add -D @axe-core/playwright
```

- [ ] **Step 10.2: Write failing a11y test**

Create `/opt/projects/thegoldiraguide/tests/e2e/a11y.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('home page has zero serious or critical axe violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
})

test('404 page has zero serious or critical axe violations', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
})
```

- [ ] **Step 10.3: Run — investigate failures if any**

```bash
pnpm test:e2e tests/e2e/a11y.spec.ts
```

Expected: either both pass, or the error output names the exact violation. If a real violation is reported (e.g., missing `lang`, contrast on placeholder text), fix the root layout or `DisclosureBanner` rather than the test. Re-run until green.

- [ ] **Step 10.4: Commit**

```bash
git add tests/e2e/a11y.spec.ts package.json pnpm-lock.yaml
git commit -m "test(a11y): enforce zero serious/critical axe violations on home and 404"
```

---

## Task 11: ESLint + Prettier (Flat Config)

**Files:**
- Create: `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`

- [ ] **Step 11.1: Install lint/format toolchain**

```bash
pnpm add -D eslint eslint-config-next@^15.0.0 @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

- [ ] **Step 11.2: Write `eslint.config.mjs`**

Create `/opt/projects/thegoldiraguide/eslint.config.mjs`:

```js
import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  { ignores: ['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'coverage/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'lodash', message: 'Use native ES methods or specific lodash/* imports.' },
          ],
        },
      ],
    },
  },
]
```

- [ ] **Step 11.3: Install `@eslint/eslintrc` for the flat-config compat layer**

```bash
pnpm add -D @eslint/eslintrc
```

- [ ] **Step 11.4: Write Prettier config and ignore**

Create `/opt/projects/thegoldiraguide/.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "always"
}
```

Create `/opt/projects/thegoldiraguide/.prettierignore`:

```
.next
node_modules
coverage
playwright-report
test-results
pnpm-lock.yaml
```

- [ ] **Step 11.5: Run lint — fix any violations in our code**

```bash
pnpm lint
```

Expected: exit 0. If anything fails, fix the source file (not the config).

- [ ] **Step 11.6: Commit**

```bash
git add eslint.config.mjs .prettierrc.json .prettierignore package.json pnpm-lock.yaml
git commit -m "chore: wire eslint flat config and prettier"
```

---

## Task 12: Semgrep SAST Config

**Files:**
- Create: `semgrep.yml`, `.semgrepignore`

Semgrep runs in CI only (no local install required). We use curated rulesets plus a custom rule that blocks hardcoded API keys.

- [ ] **Step 12.1: Write `semgrep.yml`**

Create `/opt/projects/thegoldiraguide/semgrep.yml`:

```yaml
rules:
  - id: no-hardcoded-secret-like-strings
    message: >-
      Possible hardcoded secret. Use environment variables or a vault.
    severity: ERROR
    languages: [typescript, javascript]
    pattern-either:
      - pattern-regex: '(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*["''][A-Za-z0-9_\-]{20,}["'']'
    paths:
      exclude:
        - '**/*.test.ts'
        - '**/*.test.tsx'
        - '**/*.spec.ts'

  - id: no-dangerously-set-inner-html
    message: dangerouslySetInnerHTML is forbidden on a YMYL platform.
    severity: ERROR
    languages: [typescript]
    pattern: dangerouslySetInnerHTML={...}

  - id: no-eval
    message: eval() is forbidden.
    severity: ERROR
    languages: [typescript, javascript]
    pattern: eval(...)
```

- [ ] **Step 12.2: Write `.semgrepignore`**

Create `/opt/projects/thegoldiraguide/.semgrepignore`:

```
.next/
node_modules/
coverage/
playwright-report/
test-results/
pnpm-lock.yaml
```

- [ ] **Step 12.3: Commit**

```bash
git add semgrep.yml .semgrepignore
git commit -m "chore(security): add semgrep sast ruleset"
```

---

## Task 13: GitHub Actions CI Pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

Every check that blocks merges runs here. The pipeline is linear-fast: each stage runs on the same ubuntu runner to share the pnpm cache, but each is a separate step so the failure surface is precise.

- [ ] **Step 13.1: Write the workflow**

Create `/opt/projects/thegoldiraguide/.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: Verify
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9.12.0

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Unit tests
        run: pnpm test

      - name: Compliance-as-code (FTC disclosure guard)
        run: pnpm check:disclosure

      - name: Build
        run: pnpm build

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: E2E (home, disclosure, security headers, a11y)
        run: pnpm test:e2e

      - name: Upload Playwright report on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7

  sast:
    name: Semgrep SAST
    runs-on: ubuntu-latest
    timeout-minutes: 10
    container:
      image: returntocorp/semgrep:latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep
        run: semgrep --config=semgrep.yml --config=p/typescript --config=p/react --config=p/owasp-top-ten --error
```

- [ ] **Step 13.2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: block merges on lint, typecheck, unit, e2e, a11y, disclosure, semgrep"
```

---

## Task 14: Vercel Deployment Notes + Final README Pass

**Files:**
- Modify: `README.md`
- Create: `docs/DEPLOYMENT.md`

No Vercel-specific config file is needed — Next.js is detected natively. Runtime concerns live in docs.

- [ ] **Step 14.1: Write `docs/DEPLOYMENT.md`**

Create `/opt/projects/thegoldiraguide/docs/DEPLOYMENT.md`:

```markdown
# Deployment

## Vercel (production)

1. Create the Vercel project from the GitHub repo. Next.js 15 is auto-detected.
2. Set **Node.js Version** in Project Settings → General to `20.x`.
3. Add environment variables (copy from `.env.example`):
   - `NEXT_PUBLIC_SITE_URL`
4. Leave **Build Command**, **Output Directory**, and **Install Command** at Vercel defaults — do not override them.

### Headers

Security headers are set in `src/middleware.ts` with a per-request CSP nonce. Do **not** duplicate them in `next.config.ts`, `vercel.json`, or the Vercel dashboard — duplicates produce conflicting CSPs and break nonce propagation.

### Preview deployments

Every PR gets a preview URL. The CI pipeline (`.github/workflows/ci.yml`) must pass before preview traffic can be trusted, because Vercel does not run our unit or E2E suite.

### Rollback

Use the Vercel dashboard's Deployments → Promote previous. Do not `git push --force` to main.
```

- [ ] **Step 14.2: Update README with a link**

Replace the last paragraph of `/opt/projects/thegoldiraguide/README.md` (the "See `docs/superpowers/plans/` ..." line) with:

```markdown
## Deployment

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for Vercel configuration and rollback procedure.

## Roadmap

See [`docs/superpowers/plans/`](./docs/superpowers/plans/) for the full implementation roadmap. Plan 1 (this plan) ships the foundation. Plans 2–8 add CMS, content pillars, GSEO surface, calculators, live pricing, charts, and the finalized design system.
```

- [ ] **Step 14.3: Commit**

```bash
git add docs/DEPLOYMENT.md README.md
git commit -m "docs: vercel deployment notes and roadmap link"
```

---

## Task 15: Final Gate Verification

No new files. This task runs every CI gate locally to confirm the foundation is green end-to-end before handing off to Plan 2.

- [ ] **Step 15.1: Clean install**

```bash
rm -rf node_modules .next
pnpm install --frozen-lockfile
```

Expected: install completes without peer-dependency errors.

- [ ] **Step 15.2: Run every gate**

```bash
pnpm check:all
pnpm test:e2e
```

Expected:
- `pnpm check:all` runs lint → typecheck → unit → disclosure → build, all exit 0.
- `pnpm test:e2e` reports all passing: `home.spec.ts` (1), `disclosure.spec.ts` (2), `security-headers.spec.ts` (3), `a11y.spec.ts` (2) = 8 passed.

- [ ] **Step 15.3: Manual smoke via dev server**

```bash
pnpm dev
```

In another terminal:

```bash
curl -sI http://localhost:3000/ | grep -iE 'content-security-policy|strict-transport|x-frame-options|x-content-type-options|referrer-policy|permissions-policy'
```

Expected: all six headers printed; CSP value contains `nonce-<random>` and `strict-dynamic`.

Open `http://localhost:3000/` in a browser: the dark FTC DisclosureBanner is visible at the top of the page with the exact approved copy. Stop the dev server with Ctrl+C.

- [ ] **Step 15.4: Push and confirm CI green**

```bash
git push -u origin main
```

Watch the `CI` workflow in GitHub Actions. Both `Verify` and `Semgrep SAST` jobs must finish green. If anything fails, fix it and re-push; do not merge foundation work that fails the gates it introduces.

- [ ] **Step 15.5: Tag the milestone**

```bash
git tag -a v0.1.0-foundation -m "Plan 1: foundation & infrastructure complete"
git push origin v0.1.0-foundation
```

---

## Done Means

At the end of Plan 1 the following are simultaneously true:

1. `pnpm check:all && pnpm test:e2e` exits 0 on a clean clone.
2. `curl -sI https://<vercel-preview>/` returns all six hardened headers and a per-request CSP nonce.
3. The FTC DisclosureBanner renders on every route; the compliance-as-code guard and the E2E test both verify it.
4. CI blocks any PR that fails lint, typecheck, unit tests, E2E, accessibility, the disclosure guard, or Semgrep.
5. Home page is a deliberate placeholder — content, CMS, navigation, calculators, charts, JSON-LD, and llms.txt are all owned by later plans and are absent here.

Plan 2 (Sanity CMS & Authorship) may begin immediately after Step 15.5.
