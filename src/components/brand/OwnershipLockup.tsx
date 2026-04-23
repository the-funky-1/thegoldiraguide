import Link from 'next/link'

interface OwnershipLockupProps {
  tone?: 'light' | 'dark'
}

function LgsWordmark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="0" y="10" width="4" height="4" fill="#C9A34E" />
      <text
        x="10"
        y="17"
        fontFamily="Georgia, serif"
        fontSize="14"
        fill="currentColor"
      >
        Liberty Gold Silver
      </text>
    </svg>
  )
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
        aria-label="Liberty Gold Silver"
        className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
      >
        <LgsWordmark className="h-5 w-auto" />
      </Link>
    </p>
  )
}
