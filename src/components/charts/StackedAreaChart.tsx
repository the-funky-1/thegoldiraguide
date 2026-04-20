'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartSeriesColor } from '@/charts/palette'
import type { Series } from '@/charts/types'
import { Chart } from './Chart'
import { ChartDataTable } from './ChartDataTable'

type Props = {
  title: string
  description: string
  xLabel: string
  yLabel: string
  series: Series[]
  formatValue: (n: number) => string
}

export function StackedAreaChart({
  title,
  description,
  xLabel,
  yLabel,
  series,
  formatValue,
}: Props) {
  const xValues = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => String(p.x)))),
  ).map((x) => (Number.isFinite(Number(x)) ? Number(x) : x))

  const rows = xValues.map((x) => {
    const row: Record<string, number | string> = { x }
    for (const s of series) {
      row[s.id] = s.points.find((p) => String(p.x) === String(x))?.y ?? 0
    }
    return row
  })

  return (
    <Chart
      title={title}
      description={description}
      dataTable={
        <ChartDataTable
          caption={title}
          collapsible
          columns={[
            { key: 'x', label: xLabel },
            ...series.map((s) => ({
              key: s.id,
              label: s.label,
              align: 'right' as const,
            })),
          ]}
          rows={rows.map((r) => ({
            x: String(r.x),
            ...Object.fromEntries(
              series.map((s) => [s.id, formatValue(Number(r[s.id]))]),
            ),
          }))}
        />
      }
    >
      <div aria-hidden className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              label={{ value: xLabel, position: 'insideBottom', offset: -4 }}
              tick={{ fill: '#0B1F3B' }}
            />
            <YAxis
              label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
              tickFormatter={formatValue}
              tick={{ fill: '#0B1F3B' }}
            />
            <Tooltip formatter={(v: number) => formatValue(v)} />
            <Legend />
            {series.map((s, i) => (
              <Area
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.label}
                stroke={chartSeriesColor(i)}
                fill={chartSeriesColor(i)}
                fillOpacity={0.4}
                strokeWidth={2}
                strokeDasharray={i % 2 === 0 ? '' : '6 4'}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Chart>
  )
}
