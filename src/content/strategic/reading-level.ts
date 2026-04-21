const VOWEL_GROUPS = /[aeiouy]+/g

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  const stripped = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '')
  const matches = stripped.match(VOWEL_GROUPS)
  return Math.max(1, matches ? matches.length : 1)
}

export function fleschKincaidGrade(text: string): number {
  if (!text.trim()) throw new Error('reading-level: empty input')
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim().length > 0)
  const words = text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w))
  if (sentences.length === 0 || words.length === 0) {
    throw new Error('reading-level: no sentences or words detected')
  }
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  return (
    0.39 * (words.length / sentences.length) +
    11.8 * (syllables / words.length) -
    15.59
  )
}

type PortableBlock = {
  _type: string
  children?: Array<{ _type: string; text?: string }>
}

export function extractPlainText(blocks: unknown[]): string {
  const pieces: string[] = []
  for (const raw of blocks) {
    const b = raw as PortableBlock
    if (b._type === 'llmsOnly') continue
    if (b._type === 'block' && Array.isArray(b.children)) {
      const line = b.children
        .filter((c) => c._type === 'span' && typeof c.text === 'string')
        .map((c) => c.text as string)
        .join('')
      if (line.trim()) pieces.push(line.trim())
    }
  }
  return pieces.join(' ')
}
