import Link from 'next/link'

export type Crumb = { href?: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 text-brand-slate">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li
              key={`${item.label}-${i}`}
              className="flex items-center gap-x-2"
            >
              {i > 0 && <span aria-hidden>/</span>}
              {isLast || !item.href ? (
                <span
                  aria-current="page"
                  className="font-medium text-brand-navy"
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="underline underline-offset-2">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
