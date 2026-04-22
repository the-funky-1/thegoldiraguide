import { globSync, readFileSync } from 'node:fs'

const SOURCE_GLOBS = [
  'src/**/*.{ts,tsx}',
  'scripts/**/*.ts',
  'playwright.config.ts',
  'sanity.cli.ts',
] as const

const RUNTIME_PROVIDED = new Set(['CI', 'NODE_ENV'])

export type EnvExampleViolation = {
  env: string
  file?: string
}

function extractEnvNames(source: string): string[] {
  const names = new Set<string>()

  for (const match of source.matchAll(/\bprocess\.env\.([A-Z][A-Z0-9_]*)\b/g)) {
    names.add(match[1]!)
  }

  for (const match of source.matchAll(
    /\bprocess\.env\[['"]([A-Z][A-Z0-9_]*)['"]\]/g,
  )) {
    names.add(match[1]!)
  }

  for (const match of source.matchAll(/\brequired\(['"]([A-Z][A-Z0-9_]*)['"]\)/g)) {
    names.add(match[1]!)
  }

  return [...names].filter((name) => !RUNTIME_PROVIDED.has(name))
}

export function envNamesFromExample(source: string): Set<string> {
  const names = new Set<string>()
  for (const line of source.split('\n')) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=/)
    if (match?.[1]) names.add(match[1])
  }
  return names
}

export function auditEnvExample(
  exampleSource: string,
  files: Record<string, string>,
): EnvExampleViolation[] {
  const documented = envNamesFromExample(exampleSource)
  const violations: EnvExampleViolation[] = []

  for (const [file, source] of Object.entries(files)) {
    for (const env of extractEnvNames(source)) {
      if (!documented.has(env)) violations.push({ env, file })
    }
  }

  return violations.sort((a, b) =>
    a.env === b.env
      ? (a.file ?? '').localeCompare(b.file ?? '')
      : a.env.localeCompare(b.env),
  )
}

function main(): void {
  const files = Object.fromEntries(
    SOURCE_GLOBS.flatMap((pattern) => globSync(pattern))
      .filter((file) => !file.endsWith('.test.ts') && !file.endsWith('.test.tsx'))
      .map((file) => [file, readFileSync(file, 'utf8')]),
  )
  const violations = auditEnvExample(readFileSync('.env.example', 'utf8'), files)

  if (violations.length === 0) {
    console.log('[env-example] OK')
    return
  }

  console.error('[env-example] Missing variables in .env.example:')
  for (const violation of violations) {
    console.error(`  ${violation.env} (${violation.file})`)
  }
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
