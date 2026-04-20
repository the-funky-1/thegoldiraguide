import { describe, expect, it } from 'vitest'
import { migrate } from './migrate-color-tokens'

describe('migrate', () => {
  it('replaces `ledger-navy` with `brand-navy` in className strings', () => {
    expect(migrate('<div className="bg-ledger-navy text-platinum">')).toBe(
      '<div className="bg-brand-navy text-brand-platinum">',
    )
  })
  it('replaces `slate-charcoal` and `old-gold`', () => {
    expect(migrate('text-slate-charcoal hover:text-old-gold')).toBe(
      'text-brand-slate hover:text-brand-gold',
    )
  })
  it('replaces semantic text aliases with fg-*', () => {
    expect(migrate('text-slate-charcoal/80')).toBe('text-brand-slate/80')
  })
  it('leaves unrelated strings untouched', () => {
    expect(migrate('ledger-navy-2 not-a-real-class')).toBe(
      'ledger-navy-2 not-a-real-class',
    )
  })
  it('leaves bare `platinum` as a metal-name string literal alone', () => {
    expect(migrate("const metals = ['gold', 'silver', 'platinum']")).toBe(
      "const metals = ['gold', 'silver', 'platinum']",
    )
  })
  it('rewrites `platinum` only when prefixed by a Tailwind color utility', () => {
    expect(migrate('bg-platinum/95 text-platinum/80 border-platinum')).toBe(
      'bg-brand-platinum/95 text-brand-platinum/80 border-brand-platinum',
    )
  })
  it('does not double-rewrite already-migrated `brand-platinum`', () => {
    expect(migrate('bg-brand-platinum text-brand-platinum/70')).toBe(
      'bg-brand-platinum text-brand-platinum/70',
    )
  })
})
