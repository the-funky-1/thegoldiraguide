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
