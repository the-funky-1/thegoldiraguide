import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JsonLd } from './json-ld'

describe('JsonLd', () => {
  it('emits a <script type="application/ld+json"> with the serialized payload', () => {
    const { container } = render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Thing',
          name: 'Gold',
        }}
      />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const parsed = JSON.parse(script!.textContent ?? '{}')
    expect(parsed).toMatchObject({ '@type': 'Thing', name: 'Gold' })
  })

  it('escapes embedded </script> tags so the payload cannot break out', () => {
    const { container } = render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Thing',
          description: 'abc</script><script>alert(1)</script>',
        }}
      />,
    )
    const raw = container.querySelector('script')!.innerHTML
    expect(raw).not.toContain('</script>')
    expect(raw).toContain('\\u003c/script')
  })

  it('renders nothing when given null (quiet no-op)', () => {
    const { container } = render(<JsonLd data={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
