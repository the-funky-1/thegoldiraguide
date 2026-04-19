# Plan 8: Design System & A11y Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** Plans 1–7 shipped.

**Goal:** Lock the brand. Ship a production design system — finalized fiduciary palette with WCAG 2.2 AAA contrast tokens, self-hosted typography via `next/font` (serif headline + sans body), a complete type/space/radius scale, consistent focus rings and touch targets across every interactive element, scroll-padding that accounts for the sticky header, and a public `/about/design-system` reference page. Raise the CSP from "nonce for scripts + `'unsafe-inline'` styles" to strict hash-based styles, and add a Lighthouse CI budget that fails the pipeline if LCP, INP, CLS, or bundle size regresses. Final axe audit across every route with zero serious/critical violations.

**Architecture:** A single `src/design/tokens.ts` exports every design token as a strictly typed object. `tailwind.config.ts` consumes those tokens so Tailwind utility classes (`bg-brand-navy`, `text-brand-platinum`, `text-heading-xl`) stay in sync with the TS source of truth. `next/font` registers the serif + sans pair in the root layout with `display: 'swap'` and preload. All previously ad-hoc colors (`ledger-navy`, `old-gold`, etc.) are replaced with namespaced brand tokens — a migration script at `scripts/migrate-color-tokens.ts` walks existing files and swaps class names with a codemod. A new `FocusRing` utility class is applied globally via a CSS `@layer components` rule. The CSP hardening uses SHA-256 hashes of the computed inline style payload that Tailwind + Next emit for each build; the hashes are generated at build time and injected into `middleware.ts`.

**Tech stack additions:** `next/font/google`, `@lhci/cli` (Lighthouse CI), `tailwind-variants` (cva alternative for variant-driven components), `postcss-import`.

**Out of scope:** Dark mode (can be added in a follow-up; spec called for light as primary), full Storybook (deferred to a later project).

---

## File Structure

- `src/design/tokens.ts` + `.test.ts` — all tokens
- `src/design/contrast.ts` + `.test.ts` — WCAG contrast utility
- `src/design/typography.ts` — font loader wrappers
- `src/app/globals.css` — rewrite with new tokens + `@layer components` rules
- `tailwind.config.ts` — consume `src/design/tokens.ts`
- `src/app/layout.tsx` — mount font variables
- `src/components/ui/focus-ring.tsx` — shared focus primitive
- `src/app/(marketing)/about/design-system/page.tsx` — public token reference
- `scripts/migrate-color-tokens.ts` + `.test.ts` — one-shot codemod
- `scripts/generate-style-hashes.ts` — builds SHA-256 hashes for strict CSP
- `lighthouserc.json` — LHCI config
- Modify `src/middleware.ts` — strict style-src
- Modify every component using `ledger-navy`/`old-gold`/`platinum`/`slate-charcoal` (automated via codemod)

Design rule: **No hard-coded hex in React components.** All colors, sizes, radii, and shadows must reference a Tailwind token that resolves to `src/design/tokens.ts`. A grep gate in CI prevents regressions.

---

## Task 1: Design Tokens Source of Truth (TDD)

**Files:**
- Create: `src/design/tokens.ts`, `src/design/tokens.test.ts`, `src/design/contrast.ts`, `src/design/contrast.test.ts`

- [ ] **Step 1.1: Install**

```bash
pnpm add tailwind-variants
pnpm add -D @lhci/cli postcss-import
```

- [ ] **Step 1.2: Contrast utility tests**

Create `/opt/projects/thegoldiraguide/src/design/contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { contrastRatio, passesAaa, passesAa, hexToRgb } from './contrast'

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#0B1F3B')).toEqual({ r: 11, g: 31, b: 59 })
  })
  it('parses 3-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
  })
})

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBe(21)
  })
  it('is commutative', () => {
    const a = contrastRatio('#0B1F3B', '#F8FAFC')
    const b = contrastRatio('#F8FAFC', '#0B1F3B')
    expect(a).toBe(b)
  })
})

describe('passesAa and passesAaa', () => {
  it('navy on platinum passes AAA for normal text', () => {
    const r = contrastRatio('#0B1F3B', '#F8FAFC')
    expect(passesAa(r, 'normal')).toBe(true)
    expect(passesAaa(r, 'normal')).toBe(true)
  })
  it('old-gold on platinum fails AA for normal text', () => {
    const r = contrastRatio('#D4AF37', '#F8FAFC')
    expect(passesAa(r, 'normal')).toBe(false)
  })
})
```

- [ ] **Step 1.3: Implement contrast**

Create `/opt/projects/thegoldiraguide/src/design/contrast.ts`:

```ts
export type Rgb = { r: number; g: number; b: number }

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff }
}

function srgbToLuminanceChannel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * srgbToLuminanceChannel(r) +
    0.7152 * srgbToLuminanceChannel(g) +
    0.0722 * srgbToLuminanceChannel(b)
  )
}

export function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexToRgb(hexA))
  const lb = relativeLuminance(hexToRgb(hexB))
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
}

export function passesAa(ratio: number, size: 'normal' | 'large'): boolean {
  return ratio >= (size === 'large' ? 3 : 4.5)
}

export function passesAaa(ratio: number, size: 'normal' | 'large'): boolean {
  return ratio >= (size === 'large' ? 4.5 : 7)
}
```

- [ ] **Step 1.4: Token tests**

Create `/opt/projects/thegoldiraguide/src/design/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { BRAND_COLORS, TYPOGRAPHY, SPACING } from './tokens'
import { contrastRatio, passesAaa } from './contrast'

describe('BRAND_COLORS', () => {
  it('exposes the canonical semantic slots', () => {
    for (const key of ['brandNavy', 'brandSlate', 'brandPlatinum', 'brandGold', 'brandTeal']) {
      expect(BRAND_COLORS).toHaveProperty(key)
    }
  })

  it('navy text on platinum passes WCAG 2.2 AAA for body copy', () => {
    const r = contrastRatio(BRAND_COLORS.brandNavy, BRAND_COLORS.brandPlatinum)
    expect(passesAaa(r, 'normal')).toBe(true)
  })

  it('platinum text on navy passes AAA — used for dark footers/ticker', () => {
    const r = contrastRatio(BRAND_COLORS.brandPlatinum, BRAND_COLORS.brandNavy)
    expect(passesAaa(r, 'normal')).toBe(true)
  })
})

describe('TYPOGRAPHY', () => {
  it('body font-size >= 16px — WCAG 2.2 readable minimum', () => {
    expect(parseFloat(TYPOGRAPHY.body.fontSize)).toBeGreaterThanOrEqual(16)
  })
  it('every heading has an explicit line-height', () => {
    for (const slot of ['h1', 'h2', 'h3', 'body', 'caption']) {
      expect((TYPOGRAPHY as never)[slot]).toHaveProperty('lineHeight')
    }
  })
})

describe('SPACING', () => {
  it('minimum touch target = 44px (WCAG 2.5.8 recommended)', () => {
    expect(SPACING.touchTarget).toBe('44px')
  })
})
```

- [ ] **Step 1.5: Implement tokens**

Create `/opt/projects/thegoldiraguide/src/design/tokens.ts`:

```ts
export const BRAND_COLORS = {
  // Core
  brandNavy: '#0B1F3B',       // Ledger Navy — primary brand
  brandSlate: '#4B5563',      // Slate Charcoal — secondary text / borders
  brandPlatinum: '#F8FAFC',   // Off-White — primary canvas
  brandGold: '#B8860B',       // DarkGoldenrod — accent with AAA contrast on platinum
  brandTeal: '#1E5F74',       // Deep teal — interactive accent (AAA on platinum)

  // Semantic
  textPrimary: '#0B1F3B',
  textSecondary: '#3C4A5E',   // Slightly darker slate for AAA compliance
  canvas: '#F8FAFC',
  surfaceRaised: '#FFFFFF',
  border: '#D1D5DB',
  borderFocus: '#B8860B',

  // Feedback (AA/AAA-checked against canvas)
  success: '#046C4E',
  warning: '#854D0E',
  danger: '#9F1239',
} as const

export type BrandColorKey = keyof typeof BRAND_COLORS

export const TYPOGRAPHY = {
  // Display
  displayXl: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.75rem, 3vw + 2rem, 4.5rem)',
    lineHeight: '1.05',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  h1: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.25rem, 2vw + 1.5rem, 3.5rem)',
    lineHeight: '1.1',
    fontWeight: '700',
    letterSpacing: '-0.015em',
  },
  h2: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.75rem, 1.5vw + 1rem, 2.5rem)',
    lineHeight: '1.2',
    fontWeight: '600',
  },
  h3: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    lineHeight: '1.3',
    fontWeight: '600',
  },
  body: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.0625rem', // 17px — above the WCAG 16px floor
    lineHeight: '1.65',
    fontWeight: '400',
  },
  bodyLarge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.1875rem', // 19px
    lineHeight: '1.6',
    fontWeight: '400',
  },
  caption: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '400',
  },
  mono: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9375rem',
    lineHeight: '1.5',
    fontWeight: '500',
  },
} as const

export const SPACING = {
  touchTarget: '44px',         // WCAG 2.5.8 recommended
  touchTargetMin: '24px',      // WCAG 2.5.8 minimum
  headerHeight: '64px',
  scrollPaddingTop: '80px',    // Header + buffer for sticky focus visibility
} as const

export const RADIUS = {
  none: '0',
  sm: '2px',
  md: '6px',
  lg: '12px',
  full: '9999px',
} as const

export const SHADOW = {
  sm: '0 1px 2px 0 rgb(11 31 59 / 0.05)',
  md: '0 4px 6px -1px rgb(11 31 59 / 0.1), 0 2px 4px -2px rgb(11 31 59 / 0.06)',
  lg: '0 10px 15px -3px rgb(11 31 59 / 0.1), 0 4px 6px -4px rgb(11 31 59 / 0.08)',
  focus: '0 0 0 3px rgb(184 134 11 / 0.55)', // brandGold @ 55%
} as const
```

- [ ] **Step 1.6: Run — GREEN**

```bash
pnpm test src/design
```

- [ ] **Step 1.7: Commit**

```bash
git add src/design package.json pnpm-lock.yaml
git commit -m "feat(design): tokens source-of-truth with contrast utility"
```

---

## Task 2: Wire Tokens into Tailwind

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 2.1: Replace config**

Replace `/opt/projects/thegoldiraguide/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import { BRAND_COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from './src/design/tokens'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: BRAND_COLORS.brandNavy,
          slate: BRAND_COLORS.brandSlate,
          platinum: BRAND_COLORS.brandPlatinum,
          gold: BRAND_COLORS.brandGold,
          teal: BRAND_COLORS.brandTeal,
        },
        fg: {
          primary: BRAND_COLORS.textPrimary,
          secondary: BRAND_COLORS.textSecondary,
        },
        bg: {
          canvas: BRAND_COLORS.canvas,
          surface: BRAND_COLORS.surfaceRaised,
        },
        border: {
          DEFAULT: BRAND_COLORS.border,
          focus: BRAND_COLORS.borderFocus,
        },
        feedback: {
          success: BRAND_COLORS.success,
          warning: BRAND_COLORS.warning,
          danger: BRAND_COLORS.danger,
        },

        // Back-compat aliases so the codemod can be applied in stages.
        'ledger-navy': BRAND_COLORS.brandNavy,
        'slate-charcoal': BRAND_COLORS.brandSlate,
        platinum: BRAND_COLORS.brandPlatinum,
        'old-gold': BRAND_COLORS.brandGold,
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': [TYPOGRAPHY.displayXl.fontSize, { lineHeight: TYPOGRAPHY.displayXl.lineHeight, letterSpacing: TYPOGRAPHY.displayXl.letterSpacing }],
        'heading-xl': [TYPOGRAPHY.h1.fontSize, { lineHeight: TYPOGRAPHY.h1.lineHeight }],
        'heading-lg': [TYPOGRAPHY.h2.fontSize, { lineHeight: TYPOGRAPHY.h2.lineHeight }],
        'heading-md': [TYPOGRAPHY.h3.fontSize, { lineHeight: TYPOGRAPHY.h3.lineHeight }],
        'body-lg': [TYPOGRAPHY.bodyLarge.fontSize, { lineHeight: TYPOGRAPHY.bodyLarge.lineHeight }],
        body: [TYPOGRAPHY.body.fontSize, { lineHeight: TYPOGRAPHY.body.lineHeight }],
        caption: [TYPOGRAPHY.caption.fontSize, { lineHeight: TYPOGRAPHY.caption.lineHeight }],
        mono: [TYPOGRAPHY.mono.fontSize, { lineHeight: TYPOGRAPHY.mono.lineHeight }],
      },
      spacing: {
        touch: SPACING.touchTarget,
        'touch-min': SPACING.touchTargetMin,
        header: SPACING.headerHeight,
      },
      borderRadius: {
        none: RADIUS.none,
        sm: RADIUS.sm,
        md: RADIUS.md,
        lg: RADIUS.lg,
        full: RADIUS.full,
      },
      boxShadow: {
        sm: SHADOW.sm,
        md: SHADOW.md,
        lg: SHADOW.lg,
        focus: SHADOW.focus,
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2.2: Build smoke**

```bash
pnpm build
```

- [ ] **Step 2.3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(design): tailwind consumes tokens; back-compat aliases retained"
```

---

## Task 3: Typography — `next/font`

**Files:**
- Create: `src/design/typography.ts`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] **Step 3.1: Font loader**

Create `/opt/projects/thegoldiraguide/src/design/typography.ts`:

```ts
import { IBM_Plex_Mono, IBM_Plex_Serif, Inter } from 'next/font/google'

export const fontSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
})

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})
```

- [ ] **Step 3.2: Mount in root layout**

Replace `/opt/projects/thegoldiraguide/src/app/layout.tsx`:

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
    'Objective, transparent education on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
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

- [ ] **Step 3.3: Update `globals.css`**

Replace `/opt/projects/thegoldiraguide/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }
  html {
    scroll-padding-top: 80px;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  body {
    @apply bg-bg-canvas text-fg-primary antialiased;
    font-family: var(--font-sans), system-ui, sans-serif;
    font-size: 1.0625rem;
    line-height: 1.65;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-serif), Georgia, serif;
  }
  ::selection {
    @apply bg-brand-gold/30 text-brand-navy;
  }
}

@layer components {
  /* Global focus ring — applied to every focusable element. */
  :where(a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])):focus-visible {
    outline: 3px solid theme('colors.brand.gold');
    outline-offset: 2px;
    border-radius: theme('borderRadius.sm');
  }

  /* Enforce minimum touch targets everywhere an interactive element exists. */
  :where(a, button, input[type="button"], input[type="submit"]) {
    min-height: theme('spacing.touch-min');
  }
}

@layer utilities {
  .prose {
    max-width: 65ch;
  }
  .prose p + p { margin-top: 1em; }
  .prose h2 { @apply mt-12 text-heading-lg; }
  .prose h3 { @apply mt-8 text-heading-md; }
}
```

- [ ] **Step 3.4: Build**

```bash
pnpm build
```

- [ ] **Step 3.5: Commit**

```bash
git add src/design/typography.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat(design): self-hosted serif + sans + mono via next/font"
```

---

## Task 4: Color-Token Codemod (TDD)

**Files:**
- Create: `scripts/migrate-color-tokens.ts`, `scripts/migrate-color-tokens.test.ts`

The back-compat aliases in Task 2 allow gradual migration. This script rewrites every TSX file to use the new token names, then we delete the aliases.

- [ ] **Step 4.1: Failing tests**

Create `/opt/projects/thegoldiraguide/scripts/migrate-color-tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { migrate } from './migrate-color-tokens'

describe('migrate', () => {
  it('replaces `ledger-navy` with `brand-navy` in className strings', () => {
    expect(migrate('<div className="bg-ledger-navy text-platinum">')).toBe(
      '<div className="bg-brand-navy text-brand-platinum">',
    )
  })
  it('replaces `slate-charcoal` and `old-gold`', () => {
    expect(migrate('text-slate-charcoal hover:text-old-gold')).toBe(
      'text-brand-slate hover:text-brand-gold',
    )
  })
  it('replaces semantic text aliases with fg-*', () => {
    expect(migrate('text-slate-charcoal/80')).toBe('text-brand-slate/80')
  })
  it('leaves unrelated strings untouched', () => {
    expect(migrate('ledger-navy-2 not-a-real-class')).toBe('ledger-navy-2 not-a-real-class')
  })
})
```

- [ ] **Step 4.2: Implement**

Create `/opt/projects/thegoldiraguide/scripts/migrate-color-tokens.ts`:

```ts
import { readFileSync, writeFileSync } from 'node:fs'
import { globSync } from 'node:fs'

const MAP: [RegExp, string][] = [
  [/\bledger-navy\b/g, 'brand-navy'],
  [/\bslate-charcoal\b/g, 'brand-slate'],
  [/\bplatinum\b(?!-)/g, 'brand-platinum'],
  [/\bold-gold\b/g, 'brand-gold'],
]

export function migrate(source: string): string {
  return MAP.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), source)
}

function main(): void {
  const files = globSync('src/**/*.{ts,tsx}', {})
  let touched = 0
  for (const file of files) {
    const before = readFileSync(file, 'utf8')
    const after = migrate(before)
    if (before !== after) {
      writeFileSync(file, after, 'utf8')
      console.log(`migrated: ${file}`)
      touched++
    }
  }
  console.log(`Migrated ${touched} file(s).`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
```

- [ ] **Step 4.3: Run tests, then the codemod**

```bash
pnpm test scripts/migrate-color-tokens.test.ts
tsx scripts/migrate-color-tokens.ts
```

Expected: migrated files printed. Build still passes because aliases remain.

- [ ] **Step 4.4: Remove the back-compat aliases from `tailwind.config.ts`**

Delete the `// Back-compat aliases so the codemod can be applied in stages.` block (the four entries `ledger-navy`, `slate-charcoal`, `platinum`, `old-gold`).

- [ ] **Step 4.5: Build**

```bash
pnpm build
```

Expected: no failures. If any references were missed (e.g., inside Sanity config or markdown), fix them individually.

- [ ] **Step 4.6: Commit**

```bash
git add -A
git commit -m "chore(design): migrate all color tokens to namespaced brand-*"
```

---

## Task 5: Shared Focus + Button Variants (TDD)

**Files:**
- Create: `src/components/ui/focus-ring.tsx`, `src/components/ui/link-button.tsx`, `.test.tsx`

- [ ] **Step 5.1: `FocusRing` utility**

Create `/opt/projects/thegoldiraguide/src/components/ui/focus-ring.tsx`:

```tsx
import { tv } from 'tailwind-variants'

export const focusRing = tv({
  base: 'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas rounded-sm',
})
```

- [ ] **Step 5.2: `LinkButton`**

Create `/opt/projects/thegoldiraguide/src/components/ui/link-button.tsx`:

```tsx
import Link from 'next/link'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/cn'

const linkButtonStyles = tv({
  base: 'inline-flex items-center justify-center min-h-touch px-5 py-2 text-body font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas',
  variants: {
    intent: {
      primary: 'bg-brand-navy text-brand-platinum hover:bg-brand-navy/90',
      secondary: 'border border-border text-fg-primary hover:border-brand-gold',
      ghost: 'text-fg-primary underline underline-offset-2 hover:text-brand-gold',
    },
    size: {
      md: '',
      lg: 'text-body-lg px-6 py-3',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
})

type Props = React.ComponentProps<typeof Link> &
  VariantProps<typeof linkButtonStyles>

export function LinkButton({ intent, size, className, ...rest }: Props) {
  return (
    <Link
      className={cn(linkButtonStyles({ intent, size }), className)}
      {...rest}
    />
  )
}
```

- [ ] **Step 5.3: Failing test**

Create `/opt/projects/thegoldiraguide/src/components/ui/link-button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinkButton } from './link-button'

describe('LinkButton', () => {
  it('renders as an anchor with the correct href', () => {
    render(<LinkButton href="/tools">Tools</LinkButton>)
    expect(screen.getByRole('link', { name: 'Tools' })).toHaveAttribute('href', '/tools')
  })

  it('applies intent=primary classes by default', () => {
    render(<LinkButton href="/x">x</LinkButton>)
    const link = screen.getByRole('link', { name: 'x' })
    expect(link.className).toContain('bg-brand-navy')
  })

  it('respects min-touch class for WCAG 2.5.8', () => {
    render(<LinkButton href="/x">x</LinkButton>)
    expect(screen.getByRole('link', { name: 'x' }).className).toContain('min-h-touch')
  })
})
```

- [ ] **Step 5.4: Run — GREEN**

```bash
pnpm test src/components/ui/link-button.test.tsx
```

- [ ] **Step 5.5: Commit**

```bash
git add src/components/ui/focus-ring.tsx src/components/ui/link-button.tsx src/components/ui/link-button.test.tsx
git commit -m "feat(design): shared focus ring and link-button variants"
```

---

## Task 6: Touch Target + Focus Audit Sweep

**Files:**
- Modify: any component with `min-h-[44px]` hard-coded (Plan 3, 5, 6 created these) — replace with `min-h-touch`
- Modify: `Header`, `Footer`, `Breadcrumbs`, `PillarNavigationMenu` to use the new `focusRing` utility or rely on global focus-visible rules

- [ ] **Step 6.1: Grep for ad-hoc touch heights**

```bash
grep -rn "min-h-\[44px\]" src/ | wc -l
```

Replace each occurrence with `min-h-touch`. Use `sed -i 's/min-h-\[44px\]/min-h-touch/g'` on matched files, then review the diff.

- [ ] **Step 6.2: Remove per-component focus outline classes**

The global `@layer components` rule in `globals.css` now applies focus rings universally. Remove explicit `focus-visible:outline-*` classes from components where the same effect is now provided globally.

Grep:

```bash
grep -rn "focus-visible:outline" src/components src/app
```

Remove only when the class list reduces to the global treatment; keep custom ones where the visual intent differs.

- [ ] **Step 6.3: Build + E2E a11y sweep**

```bash
pnpm build
pnpm test:e2e tests/e2e/a11y.spec.ts
```

Fix any new serious/critical violations.

- [ ] **Step 6.4: Commit**

```bash
git add -A
git commit -m "chore(a11y): consolidate focus rings and touch-target minimums"
```

---

## Task 7: Hard-Coded Hex Grep Gate (CI)

**Files:**
- Create: `scripts/check-no-hex-in-components.ts`, `scripts/check-no-hex-in-components.test.ts`
- Modify: `.github/workflows/ci.yml`

Catch regressions where a new component introduces a hard-coded hex.

- [ ] **Step 7.1: Failing tests**

Create `/opt/projects/thegoldiraguide/scripts/check-no-hex-in-components.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { findHexViolations } from './check-no-hex-in-components'

describe('findHexViolations', () => {
  it('flags a hardcoded hex in a component source', () => {
    const r = findHexViolations('x.tsx', 'const c = "#123456"')
    expect(r).toEqual([{ file: 'x.tsx', line: 1, hex: '#123456' }])
  })
  it('ignores hex inside code-comment blocks preceded by allow-hex', () => {
    const r = findHexViolations('x.tsx', '// allow-hex below\nconst c = "#123456"')
    expect(r).toEqual([])
  })
  it('ignores files under src/design/ and src/charts/', () => {
    const r = findHexViolations('src/design/tokens.ts', 'const c = "#123456"')
    expect(r).toEqual([])
  })
})
```

- [ ] **Step 7.2: Implement**

Create `/opt/projects/thegoldiraguide/scripts/check-no-hex-in-components.ts`:

```ts
import { readFileSync, globSync } from 'node:fs'

export type Violation = { file: string; line: number; hex: string }

const ALLOWED_PREFIXES = ['src/design/', 'src/charts/', 'src/seo/schemas/']

export function findHexViolations(path: string, source: string): Violation[] {
  if (ALLOWED_PREFIXES.some((p) => path.startsWith(p))) return []
  const violations: Violation[] = []
  const lines = source.split('\n')
  let allowNext = false
  for (let i = 0; i < lines.length; i++) {
    if (/allow-hex/i.test(lines[i])) {
      allowNext = true
      continue
    }
    const match = lines[i].match(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i)
    if (match && !allowNext) {
      violations.push({ file: path, line: i + 1, hex: match[0] })
    }
    allowNext = false
  }
  return violations
}

function main(): void {
  const files = globSync('src/**/*.{ts,tsx}', {})
  const all: Violation[] = []
  for (const f of files) {
    all.push(...findHexViolations(f, readFileSync(f, 'utf8')))
  }
  if (all.length === 0) {
    console.log('[no-hex] OK')
    return
  }
  console.error('[no-hex] Found hard-coded hex colors:')
  for (const v of all) console.error(`  ${v.file}:${v.line}: ${v.hex}`)
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
```

- [ ] **Step 7.3: Package script**

In `package.json`:

```jsonc
    "check:no-hex": "tsx scripts/check-no-hex-in-components.ts",
```

And append to `check:all`:

```jsonc
    "check:all": "pnpm lint && pnpm typecheck && pnpm test && pnpm check:disclosure && pnpm check:no-hex && pnpm build"
```

- [ ] **Step 7.4: Run**

```bash
pnpm check:no-hex
```

Expected: `[no-hex] OK`. Fix any violations by replacing with tokens or marking `// allow-hex` if the hex is intentional (e.g., cryptographic hashes that happen to look like hex).

- [ ] **Step 7.5: Add to CI**

In `.github/workflows/ci.yml` Verify job, before Build:

```yaml
      - name: No hard-coded hex colors outside design tokens
        run: pnpm check:no-hex
```

- [ ] **Step 7.6: Commit**

```bash
git add scripts/check-no-hex-in-components.ts scripts/check-no-hex-in-components.test.ts package.json .github/workflows/ci.yml
git commit -m "ci(design): forbid hard-coded hex outside design tokens"
```

---

## Task 8: Strict CSP Style-Src (Hashes)

**Files:**
- Create: `scripts/generate-style-hashes.ts`
- Modify: `src/middleware.ts`

Next.js injects a handful of deterministic inline style blocks at build time. Compute SHA-256 of each and whitelist them in `style-src` instead of `'unsafe-inline'`.

- [ ] **Step 8.1: Hash extractor**

Create `/opt/projects/thegoldiraguide/scripts/generate-style-hashes.ts`:

```ts
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, globSync } from 'node:fs'

// After `next build`, Next writes HTML for statically generated routes under
// `.next/server/app/`. We extract every inline <style> block, hash its content
// with SHA-256, and emit a TS file consumed by middleware.ts.
const files = globSync('.next/server/app/**/*.html', {})
const hashes = new Set<string>()
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi

for (const file of files) {
  const html = readFileSync(file, 'utf8')
  for (const match of html.matchAll(styleRegex)) {
    const digest = createHash('sha256').update(match[1]).digest('base64')
    hashes.add(`'sha256-${digest}'`)
  }
}

const body = `// Auto-generated by scripts/generate-style-hashes.ts
// Rebuild by running: pnpm generate:style-hashes
export const STYLE_SRC_HASHES: readonly string[] = ${JSON.stringify(
  [...hashes],
  null,
  2,
)} as const
`
writeFileSync('src/design/style-hashes.generated.ts', body, 'utf8')
console.log(`Wrote ${hashes.size} style hash(es).`)
```

- [ ] **Step 8.2: Add script**

In `package.json`:

```jsonc
    "generate:style-hashes": "pnpm build && tsx scripts/generate-style-hashes.ts"
```

- [ ] **Step 8.3: Run once**

```bash
pnpm generate:style-hashes
```

- [ ] **Step 8.4: Consume hashes in middleware**

Modify `/opt/projects/thegoldiraguide/src/middleware.ts` — change the `style-src` directive to use hashes when available, falling back to `'unsafe-inline'` in dev:

```ts
import { STYLE_SRC_HASHES } from './design/style-hashes.generated'

// Inside buildCsp:
    'style-src': process.env.NODE_ENV === 'production'
      ? [`'self'`, ...STYLE_SRC_HASHES]
      : [`'self'`, `'unsafe-inline'`],
```

- [ ] **Step 8.5: CI integration**

In `.github/workflows/ci.yml` Verify job, add before the JSON-LD validation step:

```yaml
      - name: Regenerate style hashes
        run: tsx scripts/generate-style-hashes.ts
      - name: Ensure style hashes are committed
        run: |
          if ! git diff --quiet src/design/style-hashes.generated.ts; then
            echo "Style hashes changed. Run 'pnpm generate:style-hashes' and commit."
            git diff src/design/style-hashes.generated.ts
            exit 1
          fi
```

- [ ] **Step 8.6: E2E — CSP still valid**

```bash
pnpm test:e2e tests/e2e/security-headers.spec.ts
```

Expected: still green; the CSP header now contains `style-src 'self' 'sha256-...'` hashes in production.

- [ ] **Step 8.7: Commit**

```bash
git add src/middleware.ts scripts/generate-style-hashes.ts src/design/style-hashes.generated.ts package.json .github/workflows/ci.yml
git commit -m "feat(security): strict style-src csp via build-time sha256 hashes"
```

---

## Task 9: Lighthouse CI with CWV Budgets

**Files:**
- Create: `lighthouserc.json`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 9.1: LHCI config**

Create `/opt/projects/thegoldiraguide/lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start -p 3000",
      "startServerReadyPattern": "Ready",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/ira-rules",
        "http://localhost:3000/tools/fee-drag-analyzer",
        "http://localhost:3000/tools/live-spot-prices"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.98 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "uses-responsive-images": "warn",
        "uses-optimized-images": "warn"
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

- [ ] **Step 9.2: CI step**

In `.github/workflows/ci.yml`, add a new job after `verify`:

```yaml
  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: verify
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9.12.0
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm dlx @lhci/cli@latest autorun
```

- [ ] **Step 9.3: Commit**

```bash
git add lighthouserc.json .github/workflows/ci.yml
git commit -m "ci(perf): lighthouse ci with cwv thresholds"
```

---

## Task 10: Design System Reference Page

**Files:**
- Create: `src/app/(marketing)/about/design-system/page.tsx`

Public-facing page that renders every token + type ramp + sample components. Doubles as documentation for editors and contractors.

- [ ] **Step 10.1: Implement**

Create `/opt/projects/thegoldiraguide/src/app/(marketing)/about/design-system/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { LinkButton } from '@/components/ui/link-button'
import { BRAND_COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from '@/design/tokens'
import { contrastRatio, passesAaa } from '@/design/contrast'

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Public reference for The Gold IRA Guide’s design tokens, typography, and components.',
  alternates: { canonical: '/about/design-system' },
}

export default function DesignSystemPage() {
  const canvas = BRAND_COLORS.canvas
  return (
    <div className="px-6 py-10">
      <Breadcrumbs items={[
        { href: '/', label: 'Home' },
        { href: '/about', label: 'Institutional Accountability' },
        { label: 'Design system' },
      ]} />
      <h1 className="mt-6 font-serif text-heading-xl">Design system</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-fg-secondary">
        Every token below is the canonical source of truth for brand colors, type, spacing, and
        elevation. Components throughout the platform consume these tokens via Tailwind and the
        <code className="font-mono"> src/design/tokens.ts</code> module.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-heading-lg">Colors</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(BRAND_COLORS).map(([key, hex]) => {
            const ratio = contrastRatio(hex, canvas)
            const ok = passesAaa(ratio, 'normal')
            return (
              <li key={key} className="rounded-md border border-border bg-bg-surface p-4">
                <div className="h-16 rounded-sm" style={{ backgroundColor: hex }} />
                <dl className="mt-3 text-caption">
                  <dt className="font-semibold">{key}</dt>
                  <dd className="font-mono">{hex}</dd>
                  <dd>
                    Contrast vs canvas: {ratio}:1{' '}
                    <span className={ok ? 'text-feedback-success' : 'text-feedback-warning'}>
                      {ok ? 'AAA' : 'sub-AAA'}
                    </span>
                  </dd>
                </dl>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Typography</h2>
        <ul className="mt-6 space-y-4">
          {Object.entries(TYPOGRAPHY).map(([key, t]) => (
            <li key={key} className="border-b border-border pb-4">
              <p
                style={{
                  fontFamily: t.fontFamily,
                  fontSize: t.fontSize,
                  lineHeight: t.lineHeight,
                  fontWeight: t.fontWeight,
                }}
              >
                {key} — The quick brown fox jumps over the lazy dog
              </p>
              <p className="mt-1 font-mono text-caption text-fg-secondary">
                {t.fontSize} / {t.lineHeight} / {t.fontWeight}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Spacing</h2>
        <ul className="mt-6 space-y-2 font-mono text-caption">
          {Object.entries(SPACING).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Radius + shadow</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {Object.entries(RADIUS).map(([key, value]) => (
            <li key={key} className="p-4">
              <div className="h-12 w-full bg-brand-navy" style={{ borderRadius: value }} />
              <p className="mt-2 text-caption font-mono">radius-{key}: {value}</p>
            </li>
          ))}
          {Object.entries(SHADOW).map(([key, value]) => (
            <li key={key} className="p-4">
              <div className="h-12 w-full rounded-md bg-bg-surface" style={{ boxShadow: value }} />
              <p className="mt-2 text-caption font-mono">shadow-{key}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <LinkButton href="#">Primary</LinkButton>
          <LinkButton href="#" intent="secondary">Secondary</LinkButton>
          <LinkButton href="#" intent="ghost">Ghost</LinkButton>
          <LinkButton href="#" size="lg">Large primary</LinkButton>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 10.2: Commit**

```bash
git add 'src/app/(marketing)/about/design-system'
git commit -m "feat(design): public design-system reference page"
```

---

## Task 11: Final A11y Sweep — WCAG 2.2 AAA

**Files:**
- Modify: `tests/e2e/a11y.spec.ts`

Upgrade the axe sweep to `wcag22aaa` where practical.

- [ ] **Step 11.1: Update**

Replace the `.withTags` line in `tests/e2e/a11y.spec.ts`:

```ts
.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'wcag22aaa', 'best-practice'])
```

Add the design-system page to `ROUTES`:

```ts
const ROUTES = [
  '/', '/ira-rules', '/accountability', '/economics', '/tools', '/about',
  '/about/expert-authors', '/about/design-system',
  '/tools/fee-drag-analyzer', '/tools/roi-calculator',
  '/tools/written-estimate-checklist', '/tools/live-spot-prices',
  '/this-route-does-not-exist',
]
```

- [ ] **Step 11.2: Run + fix**

```bash
pnpm test:e2e tests/e2e/a11y.spec.ts
```

Fix anything that's serious/critical. AAA violations surfaced from the `wcag22aaa` tag that are merely `moderate` are acceptable — the test only blocks on `serious`/`critical`.

- [ ] **Step 11.3: Commit**

```bash
git add tests/e2e/a11y.spec.ts
git commit -m "test(a11y): upgrade axe tags to wcag22aaa for full-site sweep"
```

---

## Task 12: Final Verification

- [ ] **Step 12.1: Local all-gates**

```bash
pnpm check:all && pnpm test:e2e
```

- [ ] **Step 12.2: Deploy preview + run Lighthouse locally**

```bash
pnpm build
pnpm dlx @lhci/cli@latest autorun
```

Expected: every assertion in `lighthouserc.json` passes.

- [ ] **Step 12.3: Push + CI green**

```bash
git push
```

Confirm both `verify` and `lighthouse` jobs pass.

- [ ] **Step 12.4: Tag the 1.0 release**

```bash
git tag -a v1.0.0 -m "Production-ready launch: all eight plans shipped"
git push origin v1.0.0
```

---

## Done Means

1. Every color in a component comes from `src/design/tokens.ts` via a Tailwind utility. CI enforces the rule via `check:no-hex`.
2. IBM Plex Serif (display) + Inter (body) + IBM Plex Mono (code) are self-hosted via `next/font` with `display: 'swap'` and no external CSS requests.
3. Every interactive element meets WCAG 2.5.8 touch target minimums and renders the global brand-gold focus ring on keyboard focus.
4. `style-src` in the production CSP uses SHA-256 hashes — no `'unsafe-inline'`.
5. Lighthouse CI enforces LCP < 2.5s, CLS < 0.1, TBT < 300ms, accessibility ≥ 0.98, performance ≥ 0.9 on four representative routes.
6. `/about/design-system` publicly documents every token and component.
7. axe @ wcag22aaa reports zero serious/critical violations on all twelve routes tested.
8. The project is feature-complete per the three source specifications and ready for launch.
