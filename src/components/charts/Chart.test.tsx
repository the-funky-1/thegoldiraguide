import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Chart } from './Chart'

describe('Chart', () => {
  it('wraps children in a <figure> with aria-labelledby and aria-describedby', () => {
    render(
      <Chart title="30-year fee drag" description="Flat vs scaling storage.">
        <svg data-testid="canvas" />
      </Chart>,
    )
    const figure = screen.getByRole('figure', { name: /30-year fee drag/i })
    const titleId = figure.getAttribute('aria-labelledby')
    const descId = figure.getAttribute('aria-describedby')
    expect(titleId).toBeTruthy()
    expect(descId).toBeTruthy()
    expect(document.getElementById(titleId!)).toHaveTextContent('30-year fee drag')
    expect(document.getElementById(descId!)).toHaveTextContent('Flat vs scaling storage.')
  })
})
