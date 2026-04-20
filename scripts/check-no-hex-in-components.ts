import { globSync, readFileSync } from 'node:fs'

export type Violation = { file: string; line: number; hex: string }

const ALLOWED_PREFIXES = [
  'src/design/',
  'src/charts/',
  'src/components/charts/',
  'src/seo/schemas/',
] as const

export function findHexViolations(path: string, source: string): Violation[] {
  if (ALLOWED_PREFIXES.some((p) => path.startsWith(p))) return []
  const violations: Violation[] = []
  const lines = source.split('\n')
  let allowNext = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (/allow-hex/i.test(line)) {
      allowNext = true
      continue
    }
    const match = line.match(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i)
    if (match && !allowNext) {
      violations.push({ file: path, line: i + 1, hex: match[0] })
    }
    allowNext = false
  }
  return violations
}

function main(): void {
  const files = globSync('src/**/*.{ts,tsx}')
  const all: Violation[] = []
  for (const f of files) {
    all.push(...findHexViolations(f, readFileSync(f, 'utf8')))
  }
  if (all.length === 0) {
    console.log('[no-hex] OK')
    return
  }
  console.error('[no-hex] Found hard-coded hex colors:')
  for (const v of all) console.error(`  ${v.file}:${v.line}: ${v.hex}`)
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
