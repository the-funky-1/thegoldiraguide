import { formatLongDate } from '@/lib/date'

export function LastUpdatedLabel({ updatedAt }: { updatedAt: string }) {
  return (
    <span className="text-sm text-brand-slate">
      Last updated:{' '}
      <time dateTime={updatedAt}>{formatLongDate(updatedAt)}</time>
    </span>
  )
}
