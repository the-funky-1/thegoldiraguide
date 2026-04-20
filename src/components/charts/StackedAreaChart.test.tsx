import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StackedAreaChart } from './StackedAreaChart'

const series = [
  { id: 'flat', label: 'Flat-rate', points: [{ x: 0, y: 100 }, { x: 1, y: 95 }] },
  { id: 'scaling', label: 'Scaling %', points: [{ x: 0, y: 100 }, { x: 1, y: 90 }] },
]

describe('StackedAreaChart', () => {
  it('renders the title, description, and a data table', () => {
    render(
      <StackedAreaChart
        title="Balance over time"
        description="Balance trajectory for each scenario."
        xLabel="Year"
        yLabel="Balance ($)"
        series={series}
        formatValue={(n) => `$${n.toFixed(0)}`}
      />,
    )
    expect(screen.getByRole('figure', { name: /balance over time/i })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /balance over time/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Flat-rate' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Scaling %' })).toBeInTheDocument()
    expect(screen.getByText('$95')).toBeInTheDocument()
  })
})
