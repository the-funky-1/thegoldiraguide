import Link from 'next/link'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/cn'

const linkButtonStyles = tv({
  base: 'inline-flex items-center justify-center min-h-touch px-5 py-2 text-body font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas',
  variants: {
    intent: {
      primary: 'bg-brand-navy text-brand-platinum hover:bg-brand-navy/90',
      secondary:
        'border border-border text-fg-primary hover:border-brand-gold',
      ghost:
        'text-fg-primary underline underline-offset-2 hover:text-brand-gold',
    },
    size: {
      md: '',
      lg: 'text-body-lg px-6 py-3',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
})

type Props = React.ComponentProps<typeof Link> &
  VariantProps<typeof linkButtonStyles>

export function LinkButton({ intent, size, className, ...rest }: Props) {
  return (
    <Link
      className={cn(linkButtonStyles({ intent, size }), className)}
      {...rest}
    />
  )
}
