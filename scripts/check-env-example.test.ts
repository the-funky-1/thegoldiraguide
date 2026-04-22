import { describe, expect, it } from 'vitest'
import { auditEnvExample, envNamesFromExample } from './check-env-example'

describe('envNamesFromExample', () => {
  it('extracts uppercase env names from assignment lines', () => {
    expect(envNamesFromExample('FOO=1\n# BAR=2\nBAZ=\n')).toEqual(
      new Set(['FOO', 'BAZ']),
    )
  })
})

describe('auditEnvExample', () => {
  it('flags process.env names missing from .env.example', () => {
    const result = auditEnvExample('FOO=\n', {
      'src/example.ts': 'process.env.FOO; process.env.BAR',
    })
    expect(result).toEqual([{ env: 'BAR', file: 'src/example.ts' }])
  })

  it('ignores runtime-provided variables', () => {
    const result = auditEnvExample('', {
      'src/example.ts': 'process.env.NODE_ENV; process.env.CI',
    })
    expect(result).toEqual([])
  })

  it('detects required helper calls', () => {
    const result = auditEnvExample('', {
      'src/env.ts': "required('NEXT_PUBLIC_SANITY_PROJECT_ID')",
    })
    expect(result).toEqual([
      {
        env: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
        file: 'src/env.ts',
      },
    ])
  })
})
