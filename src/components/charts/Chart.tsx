import { useId, type ReactNode } from 'react'

export function Chart({
  title,
  description,
  children,
  dataTable,
}: {
  title: string
  description: string
  children: ReactNode
  dataTable?: ReactNode
}) {
  const id = useId()
  const titleId = `${id}-title`
  const descId = `${id}-desc`
  return (
    <figure
      role="figure"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8"
    >
      <h3 id={titleId} className="font-serif text-lg font-semibold">
        {title}
      </h3>
      <p id={descId} className="mt-1 text-sm text-slate-charcoal">
        {description}
      </p>
      <div
        className="mt-4 rounded border border-slate-charcoal/20 bg-white p-4"
        role="presentation"
      >
        {children}
      </div>
      {dataTable && <div className="mt-4 overflow-x-auto">{dataTable}</div>}
    </figure>
  )
}
