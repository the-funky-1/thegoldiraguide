const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

const hits = new Map<string, number[]>()

export type LimitResult =
  | { ok: true; retryInMs: 0 }
  | { ok: false; retryInMs: number }

export function checkInProcessLimit(key: string): LimitResult {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const existing = hits.get(key) ?? []
  const fresh = existing.filter((t) => t > windowStart)
  if (fresh.length >= MAX_REQUESTS) {
    const retryInMs = fresh[0] + WINDOW_MS - now
    return { ok: false, retryInMs }
  }
  fresh.push(now)
  hits.set(key, fresh)
  return { ok: true, retryInMs: 0 }
}

export function _resetLimiterForTests(): void {
  hits.clear()
}

export async function checkUpstashLimit(
  key: string,
): Promise<LimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')
  const redis = new Redis({ url, token })
  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_MS / 1000} s`),
    prefix: 'spot',
  })
  const res = await rl.limit(key)
  return res.success
    ? { ok: true, retryInMs: 0 }
    : { ok: false, retryInMs: Math.max(0, res.reset - Date.now()) }
}
