import { headers } from 'next/headers'
import { AnalyticsProviders } from '@/analytics/providers'
import { Footer } from '@/components/nav/Footer'
import { Header } from '@/components/nav/Header'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-screen-xl">
        {children}
      </main>
      <Footer />
      <AnalyticsProviders nonce={nonce} />
    </>
  )
}
