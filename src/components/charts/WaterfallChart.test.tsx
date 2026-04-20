import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WaterfallChart } from './WaterfallChart'

const steps = [
  { label: 'Principal', delta: 100_000 },
  { label: 'Purchase spread', delta: -4000, tone: 'negative' as const },
  { label: 'Annual fees', delta: -1250, tone: 'negative' as const },
  { label: 'Appreciation', delta: 15_000, tone: 'positive' as const },
  { label: 'Liquidation spread', delta: -1097, tone: 'negative' as const },
]

describe('WaterfallChart', () => {
  it('renders step labels and running totals in the data table', () => {
    render(
      <WaterfallChart
        title="30-yr cost attribution"
        description="Each bar is a signed delta."
        steps={steps}
        formatValue={(n) => `$${n.toLocaleString()}`}
      />,
    )
    const figure = screen.getByRole('figure', {
      name: /30-yr cost attribution/i,
    })
    expect(figure).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Purchase spread')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Running total' }),
    ).toBeInTheDocument()
  })
})
