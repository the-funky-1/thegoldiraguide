import { execSync } from 'node:child_process'

const BUDGET_KB_BY_PATH: Record<string, number> = {
  '/': 180,
  '/ira-rules': 180,
  '/accountability': 180,
  '/economics': 180,
  '/about': 180,
  '/tools': 200,
  '/tools/fee-drag-analyzer': 260,
  '/tools/roi-calculator': 240,
  '/tools/written-estimate-checklist': 240,
  '/tools/live-spot-prices': 300,
}

const output = execSync('pnpm build', { encoding: 'utf8' })
const lines = output.split('\n')
const violations: string[] = []

for (const line of lines) {
  // Next.js prints rows like:
  // ┌ ○ /                                      165 B         107 kB
  // ├ ƒ /tools/fee-drag-analyzer             99.2 kB         253 kB
  const match = line.match(
    /^\s*[┌├└].\s+(?:○|●|λ|ƒ)?\s+(\/\S*)\s+.*?(\d+(?:\.\d+)?)\s*kB\s+(\d+(?:\.\d+)?)\s*kB/,
  )
  if (!match) continue
  const [, path, , firstLoadStr] = match
  if (!path || !firstLoadStr) continue
  const firstLoad = Number(firstLoadStr)
  const budget = BUDGET_KB_BY_PATH[path]
  if (budget && firstLoad > budget) {
    violations.push(`${path}: ${firstLoad}kB > budget ${budget}kB`)
  }
}

if (violations.length > 0) {
  console.error('[bundle-budget] FAIL')
  for (const v of violations) console.error('  ' + v)
  process.exit(1)
}
console.log('[bundle-budget] OK')
