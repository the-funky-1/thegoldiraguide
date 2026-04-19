import { describe, expect, it } from 'vitest'
import { formatLongDate, formatIsoDateOnly, relativeFromNow } from './date'

describe('formatLongDate', () => {
  it('formats an ISO datetime as "Month D, YYYY"', () => {
    expect(formatLongDate('2026-04-19T10:30:00Z')).toBe('April 19, 2026')
  })

  it('returns empty string for invalid input', () => {
    expect(formatLongDate('not-a-date')).toBe('')
  })
})

describe('formatIsoDateOnly', () => {
  it('strips the time portion', () => {
    expect(formatIsoDateOnly('2026-04-19T10:30:00Z')).toBe('2026-04-19')
  })
})

describe('relativeFromNow', () => {
  it('returns "today" for a datetime within the current day', () => {
    const now = new Date('2026-04-19T12:00:00Z')
    expect(relativeFromNow('2026-04-19T06:00:00Z', now)).toBe('today')
  })

  it('returns "N days ago" for prior dates', () => {
    const now = new Date('2026-04-19T12:00:00Z')
    expect(relativeFromNow('2026-04-15T12:00:00Z', now)).toBe('4 days ago')
  })
})
