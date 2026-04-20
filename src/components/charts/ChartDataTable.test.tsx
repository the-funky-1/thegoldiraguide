import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChartDataTable } from './ChartDataTable'

describe('ChartDataTable', () => {
  it('renders a table with the given caption and headers', () => {
    render(
      <ChartDataTable
        caption="Year-by-year balance"
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'flat', label: 'Flat' },
        ]}
        rows={[
          { year: 1, flat: '$100,000' },
          { year: 2, flat: '$99,875' },
        ]}
      />,
    )
    const table = screen.getByRole('table', { name: /year-by-year balance/i })
    expect(table).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Flat' })).toBeInTheDocument()
    expect(screen.getByText('$100,000')).toBeInTheDocument()
  })

  it('supports a collapsible wrapper that starts open', () => {
    render(
      <ChartDataTable
        caption="x"
        columns={[{ key: 'a', label: 'A' }]}
        rows={[{ a: '1' }]}
        collapsible
      />,
    )
    const details = screen.getByRole('group')
    expect(details).toHaveAttribute('open')
  })
})
