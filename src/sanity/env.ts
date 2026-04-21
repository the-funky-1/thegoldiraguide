function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export const sanityEnv = {
  projectId: required('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-04-01',
  // Read token. Required in practice — this project has the `privateDataset`
  // feature enabled, so anonymous queries return zero rows even against datasets
  // marked aclMode="public". Kept nullable so Studio boot + Sanity CLI tooling
  // (schema extract, typegen) still load in environments that never read.
  readToken: process.env.SANITY_API_READ_TOKEN ?? null,
  revalidateSecret: process.env.SANITY_REVALIDATE_SECRET ?? null,
} as const
