import { globSync, readFileSync, writeFileSync } from 'node:fs'

const TAILWIND_COLOR_PREFIXES =
  'bg|text|border|from|via|to|ring|outline|divide|placeholder|caret|accent|decoration|fill|stroke|shadow'

const MAP: [RegExp, string][] = [
  [/\bledger-navy(?![-\w])/g, 'brand-navy'],
  [/\bslate-charcoal(?![-\w])/g, 'brand-slate'],
  [/\bold-gold(?![-\w])/g, 'brand-gold'],
  // `platinum` doubles as a metal-name string literal in market code, so we
  // require a Tailwind color utility prefix before rewriting.
  [
    new RegExp(`\\b(${TAILWIND_COLOR_PREFIXES})-platinum(?![-\\w])`, 'g'),
    '$1-brand-platinum',
  ],
]

export function migrate(source: string): string {
  return MAP.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    source,
  )
}

function main(): void {
  const files = globSync('src/**/*.{ts,tsx}')
  let touched = 0
  for (const file of files) {
    const before = readFileSync(file, 'utf8')
    const after = migrate(before)
    if (before !== after) {
      writeFileSync(file, after, 'utf8')
      console.log(`migrated: ${file}`)
      touched++
    }
  }
  console.log(`Migrated ${touched} file(s).`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
