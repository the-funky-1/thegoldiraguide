import type { Metadata } from 'next'
import { DisclosureBanner } from '@/components/compliance/DisclosureBanner'
import { fontMono, fontSans, fontSerif } from '@/design/typography'
import { JsonLd } from '@/seo/json-ld'
import { buildOrganization } from '@/seo/schemas/organization'
import { buildWebSite } from '@/seo/schemas/website'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'The Gold IRA Guide', template: '%s · The Gold IRA Guide' },
  description:
    'Independent reference on self-directed precious metals IRAs — rules, costs, and the numbers behind them. An educational project by Liberty Gold Silver.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body>
        <JsonLd data={buildOrganization({ siteUrl })} />
        <JsonLd data={buildWebSite({ siteUrl })} />
        {children}
        <DisclosureBanner />
      </body>
    </html>
  )
}
