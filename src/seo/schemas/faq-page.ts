import type { FAQPage, Question, WithContext } from 'schema-dts'

type Input = { url: string; qas: { question: string; answer: string }[] }

type ConcreteFaqPage = Exclude<FAQPage, string>
type ConcreteQuestion = Exclude<Question, string>

export function buildFaqPage({
  url,
  qas,
}: Input): WithContext<ConcreteFaqPage> | null {
  if (qas.length === 0) return null
  const mainEntity: ConcreteQuestion[] = qas.map((qa) => ({
    '@type': 'Question',
    name: qa.question,
    acceptedAnswer: { '@type': 'Answer', text: qa.answer },
  }))
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity,
  }
}
