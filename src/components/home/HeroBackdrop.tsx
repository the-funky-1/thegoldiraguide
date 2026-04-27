import { BRAND_COLORS } from '@/design/tokens'

export function HeroBackdrop() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="hero-highlight" cx="25%" cy="35%" r="60%">
          <stop
            offset="0%"
            stopColor={BRAND_COLORS.brandGold}
            stopOpacity="0.08"
          />
          <stop
            offset="60%"
            stopColor={BRAND_COLORS.brandPlatinum}
            stopOpacity="0"
          />
        </radialGradient>
        <pattern
          id="hero-guilloche"
          x="0"
          y="0"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 70 Q 35 30 70 70 T 140 70"
            fill="none"
            stroke={BRAND_COLORS.brandNavy}
            strokeOpacity="0.04"
            strokeWidth="1"
          />
          <path
            d="M0 100 Q 35 60 70 100 T 140 100"
            fill="none"
            stroke={BRAND_COLORS.brandNavy}
            strokeOpacity="0.03"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="1200" height="600" fill="url(#hero-guilloche)" />
      <rect width="1200" height="600" fill="url(#hero-highlight)" />
    </svg>
  )
}
