import { readFileSync } from 'node:fs'
import { PUBLIC_TOOL_PAGES } from '../src/content/tools/public-tools'

export type LlmsCorpusViolation = {
  file: string
  message: string
}

export function auditLlmsCorpus(files: Record<string, string>): LlmsCorpusViolation[] {
  const violations: LlmsCorpusViolation[] = []

  const requiredRegistryUsers = [
    'src/app/llms.txt/route.ts',
    'src/app/llms-full.txt/route.ts',
    'src/app/api/md/[...path]/route.ts',
    'src/app/sitemap.xml/route.ts',
  ]

  for (const file of requiredRegistryUsers) {
    if (!files[file]?.includes('PUBLIC_TOOL_PAGES') && !files[file]?.includes('getPublicToolPage')) {
      violations.push({
        file,
        message: 'public tool registry is not referenced',
      })
    }
  }

  const toolsLanding = files['src/app/(marketing)/tools/page.tsx'] ?? ''
  for (const tool of PUBLIC_TOOL_PAGES) {
    if (!toolsLanding.includes(`slug: '${tool.slug}'`)) {
      violations.push({
        file: 'src/app/(marketing)/tools/page.tsx',
        message: `missing public tool link for ${tool.slug}`,
      })
    }
  }

  return violations
}

function main(): void {
  const paths = [
    'src/app/llms.txt/route.ts',
    'src/app/llms-full.txt/route.ts',
    'src/app/api/md/[...path]/route.ts',
    'src/app/sitemap.xml/route.ts',
    'src/app/(marketing)/tools/page.tsx',
  ]
  const files = Object.fromEntries(
    paths.map((path) => [path, readFileSync(path, 'utf8')]),
  )
  const violations = auditLlmsCorpus(files)

  if (violations.length === 0) {
    console.log('[llms-corpus] OK')
    return
  }

  console.error('[llms-corpus] Found corpus coverage issues:')
  for (const violation of violations) {
    console.error(`  ${violation.file}: ${violation.message}`)
  }
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
