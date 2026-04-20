import { NextResponse, type NextRequest } from 'next/server'
import { getCachedSpot, getStaleSpot, setCachedSpot } from '@/market/cache'
import { fetchSpotFromMetalprice } from '@/market/providers/metalprice'
import { checkInProcessLimit, checkUpstashLimit } from '@/market/rate-limit'
import { isMetalKey, type MetalKey } from '@/market/schema'

export const runtime = 'nodejs'

function clientKey(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous'
  )
}

async function fetchFresh(metal: MetalKey) {
  const apiKey = process.env.METALPRICE_API_KEY
  if (!apiKey) throw new Error('METALPRICE_API_KEY missing')
  const fresh = await fetchSpotFromMetalprice(metal, { apiKey })
  await setCachedSpot(metal, fresh)
  return fresh
}

export async function GET(req: NextRequest) {
  const metal = req.nextUrl.searchParams.get('metal') ?? ''
  if (!isMetalKey(metal)) {
    return NextResponse.json({ error: 'unsupported metal' }, { status: 400 })
  }

  const key = clientKey(req)
  const upstashLimit = await checkUpstashLimit(`${key}:${metal}`)
  const limit = upstashLimit ?? checkInProcessLimit(`${key}:${metal}`)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      {
        status: 429,
        headers: {
          'retry-after': Math.ceil(limit.retryInMs / 1000).toString(),
          'cache-control': 'no-store',
        },
      },
    )
  }

  const cached = await getCachedSpot(metal)
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        'cache-control':
          'public, max-age=5, s-maxage=5, stale-while-revalidate=60',
      },
    })
  }

  try {
    const fresh = await fetchFresh(metal)
    return NextResponse.json(fresh, {
      headers: {
        'cache-control':
          'public, max-age=5, s-maxage=5, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    const stale = await getStaleSpot(metal)
    if (stale) {
      return NextResponse.json(stale, {
        headers: {
          'cache-control': 'public, max-age=0, must-revalidate',
          'x-upstream-error': String(err),
        },
      })
    }
    return NextResponse.json({ error: 'upstream unavailable' }, { status: 502 })
  }
}
