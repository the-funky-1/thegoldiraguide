type Block = { _type: string; question?: string; answer?: string }

export function extractFaqs(
  blocks: Block[] | undefined,
): { question: string; answer: string }[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter(
      (b): b is Required<Block> =>
        b._type === 'faq' && !!b.question && !!b.answer,
    )
    .map((b) => ({ question: b.question, answer: b.answer }))
}
