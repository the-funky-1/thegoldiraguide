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

## Deployment

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for Vercel configuration and rollback procedure.

## Roadmap

See [`docs/superpowers/plans/`](./docs/superpowers/plans/) for the full implementation roadmap. Plan 1 (this plan) ships the foundation. Plans 2–8 add CMS, content pillars, GSEO surface, calculators, live pricing, charts, and the finalized design system.
