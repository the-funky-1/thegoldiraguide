import type { Config } from 'tailwindcss'
import {
  BRAND_COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from './src/design/tokens'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: BRAND_COLORS.brandNavy,
          slate: BRAND_COLORS.brandSlate,
          platinum: BRAND_COLORS.brandPlatinum,
          gold: BRAND_COLORS.brandGold,
          teal: BRAND_COLORS.brandTeal,
        },
        fg: {
          primary: BRAND_COLORS.textPrimary,
          secondary: BRAND_COLORS.textSecondary,
        },
        bg: {
          canvas: BRAND_COLORS.canvas,
          surface: BRAND_COLORS.surfaceRaised,
        },
        border: {
          DEFAULT: BRAND_COLORS.border,
          focus: BRAND_COLORS.borderFocus,
        },
        feedback: {
          success: BRAND_COLORS.success,
          warning: BRAND_COLORS.warning,
          danger: BRAND_COLORS.danger,
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': [
          TYPOGRAPHY.displayXl.fontSize,
          {
            lineHeight: TYPOGRAPHY.displayXl.lineHeight,
            letterSpacing: TYPOGRAPHY.displayXl.letterSpacing,
          },
        ],
        'heading-xl': [
          TYPOGRAPHY.h1.fontSize,
          { lineHeight: TYPOGRAPHY.h1.lineHeight },
        ],
        'heading-lg': [
          TYPOGRAPHY.h2.fontSize,
          { lineHeight: TYPOGRAPHY.h2.lineHeight },
        ],
        'heading-md': [
          TYPOGRAPHY.h3.fontSize,
          { lineHeight: TYPOGRAPHY.h3.lineHeight },
        ],
        'body-lg': [
          TYPOGRAPHY.bodyLarge.fontSize,
          { lineHeight: TYPOGRAPHY.bodyLarge.lineHeight },
        ],
        body: [
          TYPOGRAPHY.body.fontSize,
          { lineHeight: TYPOGRAPHY.body.lineHeight },
        ],
        caption: [
          TYPOGRAPHY.caption.fontSize,
          { lineHeight: TYPOGRAPHY.caption.lineHeight },
        ],
        mono: [
          TYPOGRAPHY.mono.fontSize,
          { lineHeight: TYPOGRAPHY.mono.lineHeight },
        ],
      },
      spacing: {
        touch: SPACING.touchTarget,
        'touch-min': SPACING.touchTargetMin,
        header: SPACING.headerHeight,
      },
      borderRadius: {
        none: RADIUS.none,
        sm: RADIUS.sm,
        md: RADIUS.md,
        lg: RADIUS.lg,
        full: RADIUS.full,
      },
      boxShadow: {
        sm: SHADOW.sm,
        md: SHADOW.md,
        lg: SHADOW.lg,
        focus: SHADOW.focus,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
