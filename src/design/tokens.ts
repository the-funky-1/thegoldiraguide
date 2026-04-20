export const BRAND_COLORS = {
  brandNavy: '#0B1F3B',
  brandSlate: '#4B5563',
  brandPlatinum: '#F8FAFC',
  brandGold: '#B8860B',
  brandTeal: '#1E5F74',

  textPrimary: '#0B1F3B',
  textSecondary: '#3C4A5E',
  canvas: '#F8FAFC',
  surfaceRaised: '#FFFFFF',
  border: '#D1D5DB',
  borderFocus: '#B8860B',

  success: '#046C4E',
  warning: '#854D0E',
  danger: '#9F1239',
} as const

export type BrandColorKey = keyof typeof BRAND_COLORS

export const TYPOGRAPHY = {
  displayXl: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.75rem, 3vw + 2rem, 4.5rem)',
    lineHeight: '1.05',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  h1: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.25rem, 2vw + 1.5rem, 3.5rem)',
    lineHeight: '1.1',
    fontWeight: '700',
    letterSpacing: '-0.015em',
  },
  h2: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.75rem, 1.5vw + 1rem, 2.5rem)',
    lineHeight: '1.2',
    fontWeight: '600',
  },
  h3: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    lineHeight: '1.3',
    fontWeight: '600',
  },
  body: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.0625rem',
    lineHeight: '1.65',
    fontWeight: '400',
  },
  bodyLarge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.1875rem',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  caption: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '400',
  },
  mono: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9375rem',
    lineHeight: '1.5',
    fontWeight: '500',
  },
} as const

export const SPACING = {
  touchTarget: '44px',
  touchTargetMin: '24px',
  headerHeight: '64px',
  scrollPaddingTop: '80px',
} as const

export const RADIUS = {
  none: '0',
  sm: '2px',
  md: '6px',
  lg: '12px',
  full: '9999px',
} as const

export const SHADOW = {
  sm: '0 1px 2px 0 rgb(11 31 59 / 0.05)',
  md: '0 4px 6px -1px rgb(11 31 59 / 0.1), 0 2px 4px -2px rgb(11 31 59 / 0.06)',
  lg: '0 10px 15px -3px rgb(11 31 59 / 0.1), 0 4px 6px -4px rgb(11 31 59 / 0.08)',
  focus: '0 0 0 3px rgb(184 134 11 / 0.55)',
} as const
