import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SignalStrip } from './SignalStrip'

function findByExactText(container: HTMLElement, expected: string): Element | null {
  const spans = container.querySelectorAll('span')
  for (const span of spans) {
    if (span.textContent?.replace(/\s+/g, ' ').trim() === expected) return span
  }
  return null
}

describe('SignalStrip', () => {
  it('renders the strategic article count and label as a single line', () => {
    const { container } = render(
      <SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />,
    )
    expect(findByExactText(container, '29 articles')).not.toBeNull()
  })

  it('renders the interactive tool count and label as a single line', () => {
    const { container } = render(
      <SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />,
    )
    expect(findByExactText(container, '7 calculators')).not.toBeNull()
  })

  it('renders the last-updated date in long form', () => {
    render(<SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />)
    expect(screen.getByText(/April 20, 2026/)).toBeInTheDocument()
  })

  it('marks only the numeric value mono (not the label text)', () => {
    const { container } = render(
      <SignalStrip articleCount={29} toolCount={7} lastUpdatedIso="2026-04-20" />,
    )
    const monoCounts = container.querySelectorAll('[data-signal-count]')
    expect(monoCounts.length).toBe(2)
    monoCounts.forEach((n) => {
      expect(n.className).toMatch(/font-mono/)
      // Node text should be ONLY the number — no label leaked into the mono span.
      expect(n.textContent?.trim()).toMatch(/^\d+$/)
    })
  })
})
