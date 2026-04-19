import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type Violation = 'missing-import' | 'missing-jsx' | 'hidden-wrapper'

export interface AuditResult {
  ok: boolean
  violations: Violation[]
}

export function auditLayoutSource(source: string): AuditResult {
  const violations: Violation[] = []

  const importRegex =
    /import\s+\{\s*DisclosureBanner\s*\}\s+from\s+['"]@\/components\/compliance\/DisclosureBanner['"]/
  if (!importRegex.test(source)) violations.push('missing-import')

  const jsxRegex = /<DisclosureBanner\b/
  if (!jsxRegex.test(source)) violations.push('missing-jsx')

  // Crude but effective: any ancestor element carrying `hidden` or
  // `display-none` style tokens within 400 chars preceding the banner fails.
  const wrapperRegex =
    /className=["'][^"']*(?:hidden|display-none|invisible|sr-only)[^"']*["'][^<]{0,400}<DisclosureBanner\b/
  if (wrapperRegex.test(source)) violations.push('hidden-wrapper')

  return { ok: violations.length === 0, violations }
}

function main(): void {
  const layoutPath = resolve(process.cwd(), 'src/app/layout.tsx')
  const source = readFileSync(layoutPath, 'utf8')
  const result = auditLayoutSource(source)

  if (!result.ok) {
    console.error(
      `[check-disclosure] FAIL — ${layoutPath}\n  violations: ${result.violations.join(', ')}`,
    )
    process.exit(1)
  }

  console.log(
    '[check-disclosure] OK — DisclosureBanner is present and visible.',
  )
}

// Only run main() when invoked as a script, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
