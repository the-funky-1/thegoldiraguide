export function bucketUsdAmount(value: number): string {
  if (!Number.isFinite(value)) return 'unknown'

  const absolute = Math.abs(value)
  if (absolute === 0) return '0'
  if (absolute < 1_000) return 'under_1k'
  if (absolute < 10_000) return '1k_9k'
  if (absolute < 50_000) return '10k_49k'
  if (absolute < 100_000) return '50k_99k'
  if (absolute < 250_000) return '100k_249k'
  if (absolute < 500_000) return '250k_499k'
  if (absolute < 1_000_000) return '500k_999k'
  return '1m_plus'
}

export function bucketYears(value: number): string {
  if (!Number.isFinite(value)) return 'unknown'

  if (value < 1) return 'under_1'
  if (value <= 5) return '1_5'
  if (value <= 10) return '6_10'
  if (value <= 20) return '11_20'
  if (value <= 30) return '21_30'
  return '31_plus'
}

export function bucketPercent(value: number): string {
  if (!Number.isFinite(value)) return 'unknown'

  const absolute = Math.abs(value)
  const sign = value < 0 ? 'negative_' : ''
  if (absolute === 0) return '0'
  if (absolute < 1) return `${sign}under_1pct`
  if (absolute < 5) return `${sign}1_4pct`
  if (absolute < 10) return `${sign}5_9pct`
  if (absolute < 20) return `${sign}10_19pct`
  return `${sign}20pct_plus`
}

export function bucketRatio(value: number): string {
  if (!Number.isFinite(value)) return 'unknown'

  if (value < 0.05) return 'under_5pct'
  if (value < 0.1) return '5_9pct'
  if (value < 0.2) return '10_19pct'
  if (value < 0.35) return '20_34pct'
  return '35pct_plus'
}

export function bucketToolInput(fieldKey: string, value: number): string {
  const lowerKey = fieldKey.toLowerCase()
  if (lowerKey.includes('year')) return bucketYears(value)
  if (lowerKey.includes('percent')) return bucketPercent(value)
  if (lowerKey.includes('spread')) return bucketPercent(value)
  if (lowerKey.includes('fee')) return bucketUsdAmount(value)
  if (lowerKey.includes('balance')) return bucketUsdAmount(value)
  if (lowerKey.includes('principal')) return bucketUsdAmount(value)
  return Number.isFinite(value) ? 'provided' : 'unknown'
}

export function domainFromUrl(url: string | undefined): string {
  if (!url) return 'unknown'

  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'unknown'
  }
}
