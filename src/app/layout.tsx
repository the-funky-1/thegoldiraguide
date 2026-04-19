import type { Metadata } from 'next'
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Gold IRA Guide',
  description:
    'Institutional education on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DisclosureBanner />
        {children}
      </body>
    </html>
  )
}
