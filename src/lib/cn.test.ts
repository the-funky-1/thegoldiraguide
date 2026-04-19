import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind utilities, keeping the later one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
