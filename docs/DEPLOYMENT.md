# Deployment

## Vercel (production)

1. Create the Vercel project from the GitHub repo. Next.js 15 is auto-detected.
2. Set **Node.js Version** in Project Settings → General to `22.x`.
3. Add production environment variables (copy from `.env.example`):
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_REVALIDATE_SECRET`
   - `METALPRICE_API_KEY`
   - `UPSTASH_REDIS_REST_URL` (optional, but recommended for durable rate limiting)
   - `UPSTASH_REDIS_REST_TOKEN` (required when `UPSTASH_REDIS_REST_URL` is set)
   - `NEXT_PUBLIC_HEADER_TICKER`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` (legacy alias; prefer `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
   - `NEXT_PUBLIC_AMPLITUDE_API_KEY`
   - `NEXT_PUBLIC_AMPLITUDE_SERVER_ZONE`
   - `NEXT_PUBLIC_ANALYTICS_DEBUG`
   - `NEXT_PUBLIC_ANALYTICS_DISABLED`
   - `NEXT_PUBLIC_VERCEL_ANALYTICS_MODE`
4. Do not add `SANITY_WRITE_TOKEN` to Vercel unless you intentionally run seeding or migrations from that environment. It is only needed for `pnpm seed:strategic:prerequisites` and `pnpm seed:strategic`.
5. Leave **Build Command**, **Output Directory**, and **Install Command** at Vercel defaults — do not override them.
6. In the Vercel dashboard, open the project **Analytics** tab and enable Web Analytics. The code includes the `@vercel/analytics` component, but Vercel still needs the project-level Analytics toggle enabled after deployment.

### Local-only variables

These are documented in `.env.example` for completeness but should not be added to Vercel production unless a specific task needs them:

- `SANITY_WRITE_TOKEN` — local/admin content seeding.
- `BASE_URL` — JSON-LD validation script target; defaults to `http://localhost:3000`.
- `PORT` — Playwright webServer port; defaults to `3123`.

### Headers

Security headers are set in `src/middleware.ts` with a per-request CSP nonce. Do **not** duplicate them in `next.config.ts`, `vercel.json`, or the Vercel dashboard — duplicates produce conflicting CSPs and break nonce propagation.

### Preview deployments

Every PR gets a preview URL. The CI pipeline (`.github/workflows/ci.yml`) must pass before preview traffic can be trusted, because Vercel does not run our unit or E2E suite.

### Rollback

Use the Vercel dashboard's Deployments → Promote previous. Do not `git push --force` to main.
