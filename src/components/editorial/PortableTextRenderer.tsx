import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  types: {
    callout: ({ value }: { value: { tone: string; body: string } }) => (
      <aside
        role="note"
        className={`my-6 rounded-l-4 border-l-4 p-4 ${
          value.tone === 'danger'
            ? 'border-red-600 bg-red-50'
            : value.tone === 'warning'
              ? 'border-old-gold bg-yellow-50'
              : 'border-ledger-navy bg-platinum'
        }`}
      >
        {value.body}
      </aside>
    ),
    faq: ({ value }: { value: { question: string; answer: string } }) => (
      <div className="my-4">
        <p className="font-semibold">{value.question}</p>
        <p>{value.answer}</p>
      </div>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-semibold">{children}</h3>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  },
}

export function PortableTextRenderer({
  value,
}: {
  value: Parameters<typeof PortableText>[0]['value']
}) {
  return <PortableText value={value} components={components} />
}
