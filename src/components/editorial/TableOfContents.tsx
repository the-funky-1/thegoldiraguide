import GithubSlugger from 'github-slugger'

type Block = {
  _type: string
  style?: string
  children?: { text?: string }[]
}

export type Heading = { level: 2 | 3; text: string; slug: string }

export function extractHeadings(blocks: Block[]): Heading[] {
  const slugger = new GithubSlugger()
  const out: Heading[] = []
  for (const b of blocks) {
    if (b._type !== 'block') continue
    if (b.style !== 'h2' && b.style !== 'h3') continue
    const text = (b.children ?? [])
      .map((c) => c.text ?? '')
      .join('')
      .trim()
    if (!text) continue
    out.push({
      level: b.style === 'h2' ? 2 : 3,
      text,
      slug: slugger.slug(text),
    })
  }
  return out
}

export function TableOfContents({ blocks }: { blocks: Block[] }) {
  const headings = extractHeadings(blocks)
  if (headings.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="rounded border border-slate-charcoal/20 p-4 text-sm"
    >
      <h2 className="mb-2 font-semibold">On this page</h2>
      <ol className="space-y-1">
        {headings.map((h) => (
          <li key={h.slug} className={h.level === 3 ? 'pl-4' : ''}>
            <a href={`#${h.slug}`} className="underline underline-offset-2">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
