import { Footer } from '@/components/nav/Footer'
import { Header } from '@/components/nav/Header'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-screen-xl">
        {children}
      </main>
      <Footer />
    </>
  )
}
