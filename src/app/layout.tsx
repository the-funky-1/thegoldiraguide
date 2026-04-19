import type { Metadata } from 'next'
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com',
  ),
  title: { default: 'The Gold IRA Guide', template: '%s · The Gold IRA Guide' },
  description:
    'Objective, transparent education on self-directed precious metals IRAs. Owned and operated by Liberty Gold Silver.',
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
