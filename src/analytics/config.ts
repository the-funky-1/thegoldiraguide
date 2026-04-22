const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])

export type AmplitudeServerZone = 'US' | 'EU'
export type VercelAnalyticsMode = 'auto' | 'development' | 'production'

function readBoolean(value: string | undefined): boolean {
  return TRUE_VALUES.has((value ?? '').toLowerCase())
}

function readAmplitudeServerZone(
  value: string | undefined,
): AmplitudeServerZone {
  return value?.toUpperCase() === 'EU' ? 'EU' : 'US'
}

function readVercelMode(
  value: string | undefined,
): VercelAnalyticsMode | undefined {
  if (
    value === 'auto' ||
    value === 'development' ||
    value === 'production'
  ) {
    return value
  }
  return undefined
}

export const analyticsConfig = {
  disabled:
    process.env.NODE_ENV === 'test' ||
    readBoolean(process.env.NEXT_PUBLIC_ANALYTICS_DISABLED),
  debug: readBoolean(process.env.NEXT_PUBLIC_ANALYTICS_DEBUG),
  googleAnalyticsId:
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ??
    '',
  amplitudeApiKey: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '',
  amplitudeServerZone: readAmplitudeServerZone(
    process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_ZONE,
  ),
  vercelMode: readVercelMode(process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_MODE),
}
