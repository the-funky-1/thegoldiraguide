import { describe, expect, it } from 'vitest'
import { auditLayoutSource, type AuditResult } from './check-disclosure'

const passingLayout = `
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
export default function RootLayout({ children }) {
  return (<html><body><DisclosureBanner /><main>{children}</main></body></html>)
}
`

const missingImport = `
export default function RootLayout({ children }) {
  return (<html><body><DisclosureBanner /><main>{children}</main></body></html>)
}
`

const missingRender = `
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
export default function RootLayout({ children }) {
  return (<html><body><main>{children}</main></body></html>)
}
`

const hiddenViaClass = `
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
export default function RootLayout({ children }) {
  return (<html><body><div className="hidden"><DisclosureBanner /></div><main>{children}</main></body></html>)
}
`

describe('auditLayoutSource', () => {
  it('passes when the banner is imported and rendered', () => {
    const result: AuditResult = auditLayoutSource(passingLayout)
    expect(result.ok).toBe(true)
    expect(result.violations).toEqual([])
  })

  it('fails when the import is missing', () => {
    const result = auditLayoutSource(missingImport)
    expect(result.ok).toBe(false)
    expect(result.violations).toContain('missing-import')
  })

  it('fails when the JSX render is missing', () => {
    const result = auditLayoutSource(missingRender)
    expect(result.ok).toBe(false)
    expect(result.violations).toContain('missing-jsx')
  })

  it('fails when the banner is wrapped in a class containing "hidden"', () => {
    const result = auditLayoutSource(hiddenViaClass)
    expect(result.ok).toBe(false)
    expect(result.violations).toContain('hidden-wrapper')
  })
})
