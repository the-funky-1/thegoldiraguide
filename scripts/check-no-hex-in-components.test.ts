import { describe, expect, it } from 'vitest'
import { findHexViolations } from './check-no-hex-in-components'

describe('findHexViolations', () => {
  it('flags a hardcoded hex in a component source', () => {
    const r = findHexViolations('x.tsx', 'const c = "#123456"')
    expect(r).toEqual([{ file: 'x.tsx', line: 1, hex: '#123456' }])
  })
  it('ignores hex inside code-comment blocks preceded by allow-hex', () => {
    const r = findHexViolations(
      'x.tsx',
      '// allow-hex below\nconst c = "#123456"',
    )
    expect(r).toEqual([])
  })
  it('ignores files under src/design/ and src/charts/', () => {
    const r = findHexViolations('src/design/tokens.ts', 'const c = "#123456"')
    expect(r).toEqual([])
  })
})
