import { PortableText, type PortableTextComponents } from '@portabletext/react'
import GithubSlugger from 'github-slugger'
import { LlmsIgnore } from '@/components/seo/LlmsIgnore'
import { LlmsOnly } from '@/components/seo/LlmsOnly'
import { FeeTableBlock } from './FeeTableBlock'

type FeeTableRow = React.ComponentProps<typeof FeeTableBlock>['rows'][number]

function slugFromValue(value: unknown): string {
  const children =
    (value as { children?: { text?: string }[] } | undefined)?.children ?? []
  const text = children
    .map((c) => c.text ?? '')
    .join('')
    .trim()
  return new GithubSlugger().slug(text)
}

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
    llmsOnly: ({ value }: { value: { children: unknown } }) => (
      <LlmsOnly>
        <PortableText
          value={value.children as Parameters<typeof PortableText>[0]['value']}
          components={components}
        />
      </LlmsOnly>
    ),
    llmsIgnore: ({ value }: { value: { children: unknown } }) => (
      <LlmsIgnore>
        <PortableText
          value={value.children as Parameters<typeof PortableText>[0]['value']}
          components={components}
        />
      </LlmsIgnore>
    ),
    feeTable: ({ value }: { value: { rows?: unknown[] } }) => (
      <FeeTableBlock rows={(value.rows ?? []) as FeeTableRow[]} />
    ),
  },
  block: {
    h2: ({ children, value }) => (
      <h2
        id={slugFromValue(value)}
        className="mt-10 scroll-mt-24 text-2xl font-semibold"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugFromValue(value)}
        className="mt-6 scroll-mt-24 text-xl font-semibold"
      >
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-relaxed">{children}</p>
    ),
  },
}

export function PortableTextRenderer({
  value,
}: {
  value: Parameters<typeof PortableText>[0]['value']
}) {
  return <PortableText value={value} components={components} />
}
