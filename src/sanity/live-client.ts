import { createClient } from 'next-sanity'
import { sanityEnv } from './env'

export function livePreviewClient() {
  if (!sanityEnv.readToken) {
    throw new Error(
      'SANITY_API_READ_TOKEN is required to use the preview client.',
    )
  }
  return createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
    perspective: 'drafts',
    token: sanityEnv.readToken,
    stega: { enabled: true, studioUrl: '/studio' },
  })
}
