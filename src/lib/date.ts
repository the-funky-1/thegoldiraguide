import { format, parseISO } from 'date-fns'

function safeParse(iso: string): Date | null {
  try {
    const d = parseISO(iso)
    return Number.isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

function utcMidnight(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

export function formatLongDate(iso: string): string {
  const d = safeParse(iso)
  if (!d) return ''
  // Render in UTC so server and client agree regardless of timezone.
  return format(
    new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    'MMMM d, yyyy',
  )
}

export function formatIsoDateOnly(iso: string): string {
  const d = safeParse(iso)
  if (!d) return ''
  return format(
    new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    'yyyy-MM-dd',
  )
}

export function relativeFromNow(iso: string, now: Date = new Date()): string {
  const d = safeParse(iso)
  if (!d) return ''
  const days = Math.floor((utcMidnight(now) - utcMidnight(d)) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
