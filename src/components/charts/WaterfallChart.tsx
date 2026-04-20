'use client'

import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WaterfallStep } from '@/charts/types'
import { Chart } from './Chart'
import { ChartDataTable } from './ChartDataTable'

type Props = {
  title: string
  description: string
  steps: WaterfallStep[]
  formatValue: (n: number) => string
}

type WaterfallBar = {
  label: string
  base: number
  delta: number
  total: number
  tone: 'positive' | 'negative' | 'neutral'
}

function toBars(steps: WaterfallStep[]): WaterfallBar[] {
  const bars: WaterfallBar[] = []
  let running = 0
  for (const step of steps) {
    const base = step.delta >= 0 ? running : running + step.delta
    running += step.delta
    bars.push({
      label: step.label,
      base,
      delta: Math.abs(step.delta),
      total: running,
      tone: step.tone ?? (step.delta >= 0 ? 'positive' : 'negative'),
    })
  }
  return bars
}

const TONE_FILL: Record<WaterfallBar['tone'], string> = {
  positive: '#117733',
  negative: '#CC6677',
  neutral: '#4B5563',
}

export function WaterfallChart({
  title,
  description,
  steps,
  formatValue,
}: Props) {
  const bars = toBars(steps)
  return (
    <Chart
      title={title}
      description={description}
      dataTable={
        <ChartDataTable
          caption={title}
          collapsible
          columns={[
            { key: 'label', label: 'Step' },
            { key: 'delta', label: 'Delta', align: 'right' },
            { key: 'total', label: 'Running total', align: 'right' },
          ]}
          rows={bars.map((b) => ({
            label: b.label,
            delta: formatValue(b.tone === 'negative' ? -b.delta : b.delta),
            total: formatValue(b.total),
          }))}
        />
      }
    >
      <div aria-hidden className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              interval={0}
              angle={-12}
              textAnchor="end"
              height={60}
              tick={{ fill: '#0B1F3B' }}
            />
            <YAxis tickFormatter={formatValue} tick={{ fill: '#0B1F3B' }} />
            <Tooltip
              formatter={(_v, _k, entry) =>
                formatValue((entry as { payload: WaterfallBar }).payload.total)
              }
            />
            <Bar dataKey="base" stackId="w" fill="transparent" />
            <Bar dataKey="delta" stackId="w">
              {bars.map((b, i) => (
                <Cell key={i} fill={TONE_FILL[b.tone]} />
              ))}
              <LabelList
                dataKey="total"
                position="top"
                formatter={(v: number) => formatValue(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Chart>
  )
}
