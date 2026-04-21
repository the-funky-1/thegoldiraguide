type Span = { _type: 'span'; text: string; marks?: string[] }

export type Block = {
  _type: 'block'
  _key?: string
  style: 'normal' | 'h2' | 'h3' | 'blockquote'
  children: Span[]
  markDefs?: unknown[]
}

type Callout = {
  _type: 'callout'
  tone: 'info' | 'warning' | 'danger'
  body: string
}

type Faq = { _type: 'faq'; question: string; answer: string }

type LlmsOnly = { _type: 'llmsOnly'; children: Block[] }

export function p(text: string): Block {
  return {
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text }],
  }
}

export function h2(text: string): Block {
  return { _type: 'block', style: 'h2', children: [{ _type: 'span', text }] }
}

export function h3(text: string): Block {
  return { _type: 'block', style: 'h3', children: [{ _type: 'span', text }] }
}

export function faq(question: string, answer: string): Faq {
  return { _type: 'faq', question, answer }
}

export function callout(tone: Callout['tone'], body: string): Callout {
  return { _type: 'callout', tone, body }
}

export function llmsOnly(children: Block[]): LlmsOnly {
  return { _type: 'llmsOnly', children }
}

// Stamps or replaces the _key on the wrapped value. If `b` already has a _key, it is overwritten.
export function block<T extends Record<string, unknown>>(
  key: string,
  b: T,
): T & { _key: string } {
  return { ...b, _key: key }
}
