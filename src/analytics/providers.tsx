import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { AmplitudeProvider } from './amplitude'
import { analyticsConfig } from './config'

export function AnalyticsProviders({ nonce }: { nonce?: string | undefined }) {
  if (analyticsConfig.disabled) return null

  return (
    <>
      {analyticsConfig.googleAnalyticsId ? (
        <GoogleAnalytics
          gaId={analyticsConfig.googleAnalyticsId}
          debugMode={analyticsConfig.debug}
          {...(nonce ? { nonce } : {})}
        />
      ) : null}
      <AmplitudeProvider />
      <VercelAnalytics
        debug={analyticsConfig.debug}
        mode={analyticsConfig.vercelMode ?? 'auto'}
      />
    </>
  )
}
