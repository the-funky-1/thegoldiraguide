import Link from 'next/link'
import Image from 'next/image'
import { LiveSpotPriceTicker } from '@/components/market/LiveSpotPriceTicker'
import { PillarNavigationMenu } from './PillarNavigationMenu'
import { SkipToContentLink } from './SkipToContentLink'

export function Header() {
  const showTicker = process.env.NEXT_PUBLIC_HEADER_TICKER === 'true'
  return (
    <>
      <SkipToContentLink />
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-brand-slate/20 bg-brand-platinum/95 backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-brand-navy"
          >
            <Image src="/logo.png" alt="The Gold IRA Guide Logo" width={40} height={40} className="object-contain" />
            The Gold IRA Guide
          </Link>
          <PillarNavigationMenu />
        </div>
        {showTicker && (
          <div className="border-t border-brand-slate/10 bg-brand-navy text-brand-platinum">
            <div className="mx-auto max-w-screen-xl px-6 py-2">
              <LiveSpotPriceTicker
                metals={['gold', 'silver', 'platinum', 'palladium']}
              />
            </div>
          </div>
        )}
      </header>
    </>
  )
}
