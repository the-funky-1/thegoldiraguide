import { type NextRequest, NextResponse } from 'next/server'

function buildCsp(nonce: string): string {
  // `'strict-dynamic'` lets nonce-approved scripts load their own dependencies
  // without needing to whitelist each origin. See Google CSP evaluator guidance.
  // Styles accept 'self' + 'unsafe-inline' as a documented compromise; tightened
  // in Plan 8 once the design system is frozen.
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [`'self'`, `'nonce-${nonce}'`, `'strict-dynamic'`],
    'style-src': [`'self'`, `'unsafe-inline'`],
    'img-src': [`'self'`, 'blob:', 'data:'],
    'font-src': [`'self'`],
    'connect-src': [`'self'`],
    'object-src': [`'none'`],
    'base-uri': [`'self'`],
    'form-action': [`'self'`],
    'frame-ancestors': [`'none'`],
    'upgrade-insecure-requests': [],
  }

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length ? `${key} ${values.join(' ')}` : key,
    )
    .join('; ')
}

export function middleware(request: NextRequest): NextResponse {
  const nonce = btoa(crypto.randomUUID())
  const csp = buildCsp(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('content-security-policy', csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  )

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
