import Image from 'next/image'
import Link from 'next/link'

interface OwnershipLockupProps {
  tone?: 'light' | 'dark'
}

export function OwnershipLockup({ tone = 'light' }: OwnershipLockupProps) {
  const toneClass =
    tone === 'dark' ? 'text-brand-platinum/80' : 'text-brand-slate'

  return (
    <p
      data-testid="ownership-lockup"
      className={`flex items-center gap-2 text-sm ${toneClass}`}
    >
      <span>An educational project by</span>
      <Link
        href="/about/liberty-gold-silver"
        className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
      >
        <Image
          src="/brand/lgs-lockup.svg"
          alt="Liberty Gold Silver"
          width={160}
          height={24}
          className="h-5 w-auto"
        />
      </Link>
    </p>
  )
}
