'use client'

import { useState } from 'react'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
import {
  SAMPLE_RETURN_SETS,
  correlationMatrix,
  getReturnSet,
  type AssetId,
  type TimeframeId,
} from '@/finance/correlation/compute'

function formatCorrelation(value: number): string {
  return value.toFixed(2)
}

function describeCorrelation(value: number): string {
  const absolute = Math.abs(value)
  const direction = value < -0.05 ? 'negative' : value > 0.05 ? 'positive' : 'low'
  if (absolute < 0.2) return `Low ${direction} relationship`
  if (absolute < 0.5) return `Moderate ${direction} relationship`
  return `High ${direction} relationship`
}

function toneClass(value: number): string {
  const absolute = Math.abs(value)
  if (value < -0.2) return 'bg-brand-teal/10'
  if (absolute < 0.2) return 'bg-brand-platinum'
  if (value > 0.6) return 'bg-brand-gold/20'
  return 'bg-white'
}

export function CorrelationMatrixTool() {
  const [timeframe, setTimeframe] = useState<TimeframeId>('three-year')
  const set = getReturnSet(timeframe)
  const cells = correlationMatrix(set)
  const assets = set.series

  const cellFor = (rowId: AssetId, columnId: AssetId) =>
    cells.find((cell) => cell.rowId === rowId && cell.columnId === columnId)

  return (
    <div className="space-y-6">
      <label className="block max-w-sm text-sm">
        Sample window
        <select
          value={timeframe}
          onChange={(event) => {
            const next = event.target.value as TimeframeId
            setTimeframe(next)
            trackAnalyticsEvent(analyticsEvents.toolInputChanged, {
              field_key: 'timeframe',
              tool_id: analyticsToolIds.correlationMatrix,
              value_bucket: next,
            })
          }}
          className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
          aria-label="Sample window"
        >
          {SAMPLE_RETURN_SETS.map((sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.label}
            </option>
          ))}
        </select>
      </label>

      <p className="max-w-3xl text-sm text-brand-slate">{set.note}</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="text-left font-semibold">
            Asset class correlation matrix
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border-b p-2 text-left">
                Asset
              </th>
              {assets.map((asset) => (
                <th key={asset.id} scope="col" className="border-b p-2 text-right">
                  {asset.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((row) => (
              <tr key={row.id} className="border-b">
                <th scope="row" className="p-2 text-left font-semibold">
                  {row.label}
                </th>
                {assets.map((column) => {
                  const cell = cellFor(row.id, column.id)
                  const value = cell?.value ?? 0
                  return (
                    <td
                      key={column.id}
                      className={`p-2 text-right ${toneClass(value)}`}
                    >
                      <span className="font-mono">{formatCorrelation(value)}</span>
                      <span className="sr-only">
                        {' '}
                        {describeCorrelation(value)}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="grid gap-4 md:grid-cols-3">
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <dt className="font-semibold">Near +1.00</dt>
          <dd className="mt-1 text-sm text-brand-slate">
            Assets moved together in the sample.
          </dd>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <dt className="font-semibold">Near 0.00</dt>
          <dd className="mt-1 text-sm text-brand-slate">
            The measured relationship was weak.
          </dd>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <dt className="font-semibold">Below 0.00</dt>
          <dd className="mt-1 text-sm text-brand-slate">
            Assets tended to move in opposite directions.
          </dd>
        </div>
      </dl>
    </div>
  )
}
