import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TimeSeriesLineChart } from './TimeSeriesLineChart'

vi.mock('./dynamic', () => ({
  ReactECharts: ({ option }: { option: unknown }) => (
    <div data-testid="echarts" data-option={JSON.stringify(option)} />
  ),
}))

const series = [
  {
    id: 'gold',
    label: 'Gold',
    points: [
      { x: '2026-03-20', y: 2480 },
      { x: '2026-03-21', y: 2495 },
      { x: '2026-03-22', y: 2503 },
    ],
  },
]

describe('TimeSeriesLineChart', () => {
  it('renders the figure + companion data table', () => {
    render(
      <TimeSeriesLineChart
        title="30-day gold"
        description="USD per troy ounce."
        series={series}
        formatValue={(n) => `$${n.toFixed(2)}`}
      />,
    )
    expect(screen.getByRole('figure', { name: /30-day gold/i })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /30-day gold/i })).toBeInTheDocument()
    expect(screen.getByText('$2495.00')).toBeInTheDocument()
  })
})
