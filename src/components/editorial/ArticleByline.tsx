import { LastUpdatedLabel } from './LastUpdatedLabel'

type Props = {
  author: { name: string; slug: string; jobTitle?: string }
  publishedAt: string
  updatedAt: string
}

export function ArticleByline({ author, publishedAt, updatedAt }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span>
        By{' '}
        <a
          href={`/about/expert-authors/${author.slug}`}
          className="font-semibold underline"
        >
          {author.name}
        </a>
      </span>
      {author.jobTitle && (
        <span className="text-slate-charcoal">· {author.jobTitle}</span>
      )}
      <span aria-hidden>·</span>
      <time dateTime={publishedAt} className="text-slate-charcoal">
        Published {publishedAt.slice(0, 10)}
      </time>
      <span aria-hidden>·</span>
      <LastUpdatedLabel updatedAt={updatedAt} />
    </div>
  )
}
