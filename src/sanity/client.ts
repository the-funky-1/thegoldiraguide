import { createClient } from 'next-sanity'
import { sanityEnv } from './env'

// Required: this project uses the `privateDataset` feature, so anonymous
// queries return zero results even though the dataset reports aclMode="public".
// The read token is scoped to published-content reads.
const baseConfig = {
  projectId: sanityEnv.projectId,
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: true,
  perspective: 'published' as const,
  stega: { enabled: false, studioUrl: '/studio' },
}

export const sanityClient = createClient(
  sanityEnv.readToken
    ? { ...baseConfig, token: sanityEnv.readToken }
    : baseConfig,
)
