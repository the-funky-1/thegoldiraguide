import { type NextRequest, NextResponse } from 'next/server'
import { STYLE_SRC_HASHES } from './design/style-hashes.generated'

function buildCsp(nonce: string): string {
  // `'strict-dynamic'` lets nonce-approved scripts load their own dependencies
  // without needing to whitelist each origin. See Google CSP evaluator guidance.
  // Production styles use SHA-256 hashes generated at build time so we can drop
  // `'unsafe-inline'`. Dev keeps `'unsafe-inline'` because hot-reload injects
  // unhashed inline styles.
  const styleSrc =
    process.env.NODE_ENV === 'production'
      ? [`'self'`, ...STYLE_SRC_HASHES]
      : [`'self'`, `'unsafe-inline'`]
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      `'self'`,
      `'nonce-${nonce}'`,
      `'strict-dynamic'`,
      'https://www.googletagmanager.com',
      'https://va.vercel-scripts.com',
    ],
    'style-src': styleSrc,
    'img-src': [
      `'self'`,
      'blob:',
      'data:',
      'https://www.google-analytics.com',
      'https://stats.g.doubleclick.net',
    ],
    'font-src': [`'self'`],
    'connect-src': [
      `'self'`,
      'https://api2.amplitude.com',
      'https://api.eu.amplitude.com',
      'https://sr-client-cfg.amplitude.com',
      'https://sr-client-cfg.eu.amplitude.com',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://region1.google-analytics.com',
      'https://region1.analytics.google.com',
      'https://stats.g.doubleclick.net',
    ],
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

// Rewrites `.md` suffixed URLs or `Accept: text/markdown` requests to the
// dedicated markdown route handler. The route `[slug]/page.tsx` otherwise
// consumes the `.md` as part of the slug, so this redirection must happen
// before Next.js resolves the route.
function resolveMarkdownRewrite(request: NextRequest): URL | null {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/')) return null

  const endsWithMd = pathname.endsWith('.md')
  const wantsMd = (request.headers.get('accept') ?? '').includes(
    'text/markdown',
  )
  if (!endsWithMd && !wantsMd) return null

  const withoutMd = endsWithMd ? pathname.slice(0, -3) : pathname
  const rewritten = new URL(`/api/md${withoutMd}`, request.url)
  return rewritten
}

function resolveTransparencyRedirect(request: NextRequest): URL | null {
  const { pathname, search } = request.nextUrl
  if (pathname !== '/transparency' && !pathname.startsWith('/transparency/')) {
    return null
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname.replace(/^\/transparency/, '/accountability')
  url.search = search
  return url
}

export function middleware(request: NextRequest): NextResponse {
  const markdownRewrite = resolveMarkdownRewrite(request)
  if (markdownRewrite) {
    return NextResponse.rewrite(markdownRewrite)
  }

  const transparencyRedirect = resolveTransparencyRedirect(request)
  if (transparencyRedirect) {
    return NextResponse.redirect(transparencyRedirect, 308)
  }

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
      source: '/((?!api|_next/static|_next/image|favicon.ico|studio).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
