# Deployment

## Vercel (production)

1. Create the Vercel project from the GitHub repo. Next.js 15 is auto-detected.
2. Set **Node.js Version** in Project Settings → General to `20.x`.
3. Add environment variables (copy from `.env.example`):
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_AMPLITUDE_API_KEY`
   - `NEXT_PUBLIC_AMPLITUDE_SERVER_ZONE`
   - `NEXT_PUBLIC_ANALYTICS_DEBUG`
   - `NEXT_PUBLIC_ANALYTICS_DISABLED`
   - `NEXT_PUBLIC_VERCEL_ANALYTICS_MODE`
4. Leave **Build Command**, **Output Directory**, and **Install Command** at Vercel defaults — do not override them.
5. In the Vercel dashboard, open the project **Analytics** tab and enable Web Analytics. The code includes the `@vercel/analytics` component, but Vercel still needs the project-level Analytics toggle enabled after deployment.

### Headers

Security headers are set in `src/middleware.ts` with a per-request CSP nonce. Do **not** duplicate them in `next.config.ts`, `vercel.json`, or the Vercel dashboard — duplicates produce conflicting CSPs and break nonce propagation.

### Preview deployments

Every PR gets a preview URL. The CI pipeline (`.github/workflows/ci.yml`) must pass before preview traffic can be trusted, because Vercel does not run our unit or E2E suite.

### Rollback

Use the Vercel dashboard's Deployments → Promote previous. Do not `git push --force` to main.
