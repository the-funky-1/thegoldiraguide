type Span = { text?: string }
type Block =
  | { _type: 'block'; style?: string; children?: Span[] }
  | { _type: 'faq'; question: string; answer: string }
  | { _type: 'callout'; tone: 'info' | 'warning' | 'danger'; body: string }
  | { _type: 'llmsOnly'; children?: Block[] }
  | { _type: 'llmsIgnore'; children?: Block[] }
  | { _type: string; [key: string]: unknown }

function renderBlock(block: Block): string {
  switch (block._type) {
    case 'block': {
      const b = block as { style?: string; children?: Span[] }
      const text = (b.children ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim()
      if (!text) return ''
      switch (b.style) {
        case 'h2':
          return `## ${text}`
        case 'h3':
          return `### ${text}`
        case 'h4':
          return `#### ${text}`
        case 'blockquote':
          return `> ${text}`
        default:
          return text
      }
    }
    case 'faq': {
      const b = block as { question: string; answer: string }
      return `### ${b.question}\n\n${b.answer}`
    }
    case 'callout': {
      const b = block as { tone: 'info' | 'warning' | 'danger'; body: string }
      const label = { info: 'Info', warning: 'Warning', danger: 'Danger' }[
        b.tone
      ]
      return `> **${label}:** ${b.body}`
    }
    case 'llmsOnly': {
      const b = block as { children?: Block[] }
      return (b.children ?? []).map(renderBlock).filter(Boolean).join('\n\n')
    }
    case 'llmsIgnore':
      return ''
    default:
      return ''
  }
}

export function portableTextToMarkdown(blocks: Block[] | undefined): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map(renderBlock)
    .filter((s) => s.length > 0)
    .join('\n\n')
}
