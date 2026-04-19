import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkipToContentLink } from './SkipToContentLink'

describe('SkipToContentLink', () => {
  it('anchors to #main-content', () => {
    render(<SkipToContentLink />)
    expect(
      screen.getByRole('link', { name: /skip to main content/i }),
    ).toHaveAttribute('href', '#main-content')
  })

  it('is visually hidden until focused (carries sr-only + focus:not-sr-only classes)', () => {
    render(<SkipToContentLink />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    expect(link.className).toContain('sr-only')
    expect(link.className).toContain('focus:not-sr-only')
  })
})
