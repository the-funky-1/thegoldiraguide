import type { Thing, WithContext } from 'schema-dts'

type JsonLdInput = WithContext<Thing> | Record<string, unknown> | null

function stringifySafe(data: Exclude<JsonLdInput, null>): string {
  return JSON.stringify(data).replace(/<\/script/gi, '\\u003c/script')
}

export function JsonLd({ data }: { data: JsonLdInput }) {
  if (data === null) return null
  return (
    <script
      type="application/ld+json"
      // The only place dangerouslySetInnerHTML is allowed. Input is
      // type-constrained, stringified with </script> escaped, and always
      // derived from server-side data.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: stringifySafe(data) }}
    />
  )
}
