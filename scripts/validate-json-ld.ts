import { validateJsonLd } from '@/seo/schemas/validate'

export function extractJsonLdBlocks(html: string): unknown[] {
  const regex =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const out: unknown[] = []
  for (const match of html.matchAll(regex)) {
    const payload = match[1] ?? ''
    try {
      out.push(JSON.parse(payload))
    } catch {
      // Fall through — invalid JSON is surfaced by the validator.
      out.push({ __invalid: true, raw: payload.slice(0, 200) })
    }
  }
  return out
}

const ROUTES = [
  '/',
  '/ira-rules',
  '/accountability',
  '/economics',
  '/tools',
  '/about',
  '/about/expert-authors',
]

async function main() {
  const base = process.env.BASE_URL ?? 'http://localhost:3000'
  let totalFailures = 0

  for (const route of ROUTES) {
    const res = await fetch(`${base}${route}`)
    if (!res.ok) {
      console.error(`[jsonld] HTTP ${res.status} at ${route}`)
      totalFailures++
      continue
    }
    const html = await res.text()
    const blocks = extractJsonLdBlocks(html)
    if (blocks.length === 0) {
      console.error(`[jsonld] FAIL: no JSON-LD found at ${route}`)
      totalFailures++
      continue
    }
    for (let i = 0; i < blocks.length; i++) {
      const result = validateJsonLd(blocks[i])
      if (!result.ok) {
        console.error(`[jsonld] FAIL at ${route} (block ${i}):`)
        for (const e of result.errors) console.error(`  - ${e}`)
        totalFailures++
      } else {
        console.log(`[jsonld] OK  ${route} (block ${i})`)
      }
    }
  }

  if (totalFailures > 0) {
    console.error(`[jsonld] Total failures: ${totalFailures}`)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main()
}
