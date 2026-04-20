import { NextResponse, type NextRequest } from 'next/server'
import { fetchHistory } from '@/market/providers/metalprice-history'
import { isMetalKey } from '@/market/schema'

export const runtime = 'nodejs'
export const revalidate = 3600

export async function GET(req: NextRequest) {
  const metal = req.nextUrl.searchParams.get('metal') ?? ''
  const days = Math.min(
    90,
    Math.max(1, Number(req.nextUrl.searchParams.get('days') ?? '30')),
  )

  if (!isMetalKey(metal)) {
    return NextResponse.json({ error: 'unsupported metal' }, { status: 400 })
  }
  const apiKey = process.env.METALPRICE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'api key missing' }, { status: 500 })
  }

  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  try {
    const history = await fetchHistory(metal, fmt(start), fmt(end), { apiKey })
    return NextResponse.json(history, {
      headers: {
        'cache-control':
          'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'upstream unavailable', detail: String(err) },
      { status: 502 },
    )
  }
}
