import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Placeholder fiduciary palette — finalized in Plan 8.
        'ledger-navy': '#0B1F3B',
        'slate-charcoal': '#4B5563',
        platinum: '#F8FAFC',
        'old-gold': '#D4AF37',
      },
    },
  },
  plugins: [],
}

export default config
