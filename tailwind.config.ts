import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: ['./src/**/*.{ts,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			'ledger-navy': '#0B1F3B',
  			'slate-charcoal': '#4B5563',
  			platinum: '#F8FAFC',
  			'old-gold': '#D4AF37'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
}

export default config
