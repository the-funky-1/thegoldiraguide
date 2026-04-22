import { globSync, readFileSync } from 'node:fs'

export type BrandVoiceViolation = {
  file: string
  line: number
  phrase: string
}

const SCANNED_GLOBS = [
  'src/app/**/*.{ts,tsx}',
  'src/components/**/*.{ts,tsx}',
  'src/content/strategic/**/*.{ts,tsx}',
] as const

const BANNED_PHRASES = [
  'objective, transparent',
  'act now',
  'guaranteed returns',
  'risk-free',
  'safe haven',
  'industry secrets',
  'unlike the competition',
  'predatory',
  'hidden fees',
  'scam',
] as const

const ALLOWED_PREFIXES = [
  'src/components/charts/',
  'src/content/strategic/about/accountability-standard',
] as const

export function findBrandVoiceViolations(
  file: string,
  source: string,
): BrandVoiceViolation[] {
  if (ALLOWED_PREFIXES.some((prefix) => file.startsWith(prefix))) return []

  const violations: BrandVoiceViolation[] = []
  const lines = source.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const lower = line.toLowerCase()
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) {
        violations.push({ file, line: i + 1, phrase })
      }
    }
  }

  return violations
}

function main(): void {
  const files = SCANNED_GLOBS.flatMap((pattern) => globSync(pattern))
  const violations = files.flatMap((file) =>
    findBrandVoiceViolations(file, readFileSync(file, 'utf8')),
  )

  if (violations.length === 0) {
    console.log('[brand-voice] OK')
    return
  }

  console.error('[brand-voice] Found banned public-copy phrases:')
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line}: ${violation.phrase}`,
    )
  }
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
