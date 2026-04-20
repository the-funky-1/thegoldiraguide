import type { ReactNode } from 'react'

export type Column = { key: string; label: string; align?: 'left' | 'right' }

type Row = Record<string, ReactNode>

export function ChartDataTable({
  caption,
  columns,
  rows,
  collapsible = false,
}: {
  caption: string
  columns: Column[]
  rows: Row[]
  collapsible?: boolean
}) {
  const table = (
    <table className="w-full text-sm">
      <caption className="text-left font-semibold">{caption}</caption>
      <thead>
        <tr className="border-b">
          {columns.map((c) => (
            <th
              key={c.key}
              scope="col"
              className={`p-2 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b">
            {columns.map((c) => (
              <td
                key={c.key}
                className={`p-2 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {row[c.key] ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  if (!collapsible) return table
  return (
    <details open role="group">
      <summary className="cursor-pointer text-sm font-semibold underline-offset-2 hover:underline">
        Show the data
      </summary>
      <div className="mt-4 overflow-x-auto">{table}</div>
    </details>
  )
}
