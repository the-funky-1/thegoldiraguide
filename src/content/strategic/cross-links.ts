// Populated by index.ts after all seeds are loaded. During module init this is
// empty; buildCrossLinks reads it lazily so circular loads resolve.
const KNOWN: Set<string> = new Set()

export function registerArticle(ref: string): void {
  KNOWN.add(ref)
}

export function buildCrossLinks(self: string, targets: string[]): string[] {
  for (const t of targets) {
    if (t === self) throw new Error(`cross-links: self-reference "${self}"`)
    if (!KNOWN.has(t)) {
      throw new Error(`cross-links: unknown target "${t}" (from "${self}")`)
    }
  }
  return targets
}

export function resetForTests(): void {
  KNOWN.clear()
}
