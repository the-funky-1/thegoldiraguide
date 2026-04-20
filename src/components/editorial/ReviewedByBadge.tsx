import { formatLongDate } from '@/lib/date'

type Credential = {
  name: string
  credentialCategory: 'degree' | 'license' | 'certification'
  recognizedBy?: string
}

type Reviewer = {
  name: string
  slug: string
  credentials?: Credential[]
}

type Props = {
  reviewer: Reviewer | null
  reviewedAt: string | null
}

export function ReviewedByBadge({ reviewer, reviewedAt }: Props) {
  if (!reviewer || !reviewedAt) return null

  return (
    <div
      className="rounded border border-brand-slate/20 bg-white p-4 text-sm"
      role="note"
      aria-label="Editorial review"
    >
      <div className="font-semibold">
        Reviewed by{' '}
        <a
          href={`/about/expert-authors/${reviewer.slug}`}
          className="underline"
        >
          {reviewer.name}
        </a>{' '}
        on <time dateTime={reviewedAt}>{formatLongDate(reviewedAt)}</time>
      </div>
      {reviewer.credentials && reviewer.credentials.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {reviewer.credentials.map((c) => (
            <li
              key={c.name}
              className="rounded bg-brand-platinum px-2 py-1 text-xs text-brand-navy"
            >
              {c.name}
              {c.recognizedBy ? ` · ${c.recognizedBy}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
