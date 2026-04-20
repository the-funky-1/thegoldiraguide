'use client'

import { chartSeriesColor } from '@/charts/palette'
import type { Series } from '@/charts/types'
import { Chart } from './Chart'
import { ChartDataTable } from './ChartDataTable'
import { ReactECharts } from './dynamic'

type Props = {
  title: string
  description: string
  series: Series[]
  formatValue: (n: number) => string
}

export function TimeSeriesLineChart({ title, description, series, formatValue }: Props) {
  const xAxisCategories = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => String(p.x)))),
  ).sort()

  const option = {
    grid: { top: 40, bottom: 60, left: 60, right: 20 },
    tooltip: { trigger: 'axis' },
    legend: { data: series.map((s) => s.label), top: 0 },
    xAxis: {
      type: 'category',
      data: xAxisCategories,
      axisLabel: { interval: Math.floor(xAxisCategories.length / 8) },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => formatValue(v) },
    },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    series: series.map((s, i) => ({
      name: s.label,
      type: 'line',
      smooth: true,
      symbol: ['circle', 'triangle', 'rect', 'diamond'][i % 4],
      lineStyle: {
        color: chartSeriesColor(i),
        width: 2,
        type: i % 2 === 0 ? 'solid' : 'dashed',
      },
      itemStyle: { color: chartSeriesColor(i) },
      data: xAxisCategories.map(
        (x) => s.points.find((p) => String(p.x) === x)?.y ?? null,
      ),
    })),
  }

  const rows = xAxisCategories.map((x) => ({
    x,
    ...Object.fromEntries(
      series.map((s) => [
        s.id,
        (() => {
          const pt = s.points.find((p) => String(p.x) === x)
          return pt ? formatValue(pt.y) : '—'
        })(),
      ]),
    ),
  }))

  return (
    <Chart
      title={title}
      description={description}
      dataTable={
        <ChartDataTable
          caption={title}
          collapsible
          columns={[
            { key: 'x', label: 'Date' },
            ...series.map((s) => ({ key: s.id, label: s.label, align: 'right' as const })),
          ]}
          rows={rows}
        />
      }
    >
      <div aria-hidden className="h-80">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Chart>
  )
}
