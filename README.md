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
| `pnpm check:env-example` | Static guard: `.env.example` documents all app/script env vars |
| `pnpm check:all` | Run every gate the CI pipeline runs |

## Environment

Copy `.env.example` to `.env.local` for local development and fill only the
values needed for the workflows you run. Public `NEXT_PUBLIC_*` analytics keys
are safe for the browser by design; Sanity, MetalpriceAPI, Upstash, and write
tokens must remain server-side secrets. `SANITY_WRITE_TOKEN` is only needed for
seeding scripts.

## Deployment

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for Vercel configuration and rollback procedure.

## Analytics

Public marketing routes initialize Google Analytics 4, Vercel Web Analytics,
and Amplitude when their public environment variables are configured. Custom
calculator and comparison events use buckets for financial values instead of
logging exact user-entered amounts.

## Roadmap

See [`docs/superpowers/plans/`](./docs/superpowers/plans/) for the full implementation roadmap. Plan 1 (this plan) ships the foundation. Plans 2–8 add CMS, content pillars, GSEO surface, calculators, live pricing, charts, and the finalized design system.
