// LlmsOnly: invisible to humans, included in the .md mirror.
// Requires the complementary portable-text block _type 'llmsOnly'.
export function LlmsOnly({ children }: { children: React.ReactNode }) {
  return (
    <div data-llms="only" className="sr-only" aria-hidden="true">
      {children}
    </div>
  )
}
