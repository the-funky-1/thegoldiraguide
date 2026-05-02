import { formatLongDate } from '@/lib/date'

interface SignalStripProps {
  articleCount: number
  toolCount: number
  lastUpdatedIso: string
}

export function SignalStrip({
  articleCount,
  toolCount,
  lastUpdatedIso,
}: SignalStripProps) {
  return (
    <section
      aria-label="Site signals"
      className="border-y border-brand-slate/20 bg-bg-surface"
    >
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-baseline justify-center gap-x-10 gap-y-3 px-6 py-4 text-sm text-brand-slate">
        <span className="inline-flex items-baseline gap-2">
          <span
            data-signal-count
            className="font-mono text-base text-brand-navy"
          >
            {articleCount}
          </span>{' '}
          articles
        </span>
        <span className="inline-flex items-baseline gap-2">
          <span
            data-signal-count
            className="font-mono text-base text-brand-navy"
          >
            {toolCount}
          </span>{' '}
          calculators
        </span>
        <span className="inline-flex items-baseline gap-2">
          Updated{' '}
          <time
            dateTime={lastUpdatedIso}
            className="font-mono text-sm text-brand-navy"
          >
            {formatLongDate(lastUpdatedIso)}
          </time>
        </span>
      </div>
    </section>
  )
}
