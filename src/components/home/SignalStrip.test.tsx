import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SignalStrip } from './SignalStrip'

describe('SignalStrip', () => {
  it('renders the strategic article count', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/29 articles/i)).toBeInTheDocument()
  })

  it('renders the interactive tool count', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/7 calculators/i)).toBeInTheDocument()
  })

  it('renders the last-updated date in long form', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/April 20, 2026/)).toBeInTheDocument()
  })

  it('uses a monospace class on each numeric count', () => {
    const { container } = render(
      <SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />,
    )
    const monoCounts = container.querySelectorAll('[data-signal-count]')
    expect(monoCounts.length).toBe(2)
    monoCounts.forEach((n) => expect(n.className).toMatch(/font-mono/))
  })
})
