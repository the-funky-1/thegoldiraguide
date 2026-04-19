import crypto from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { sanityEnv } from '@/sanity/env'

const payloadSchema = z.object({
  _type: z.string(),
  slug: z.object({ current: z.string() }).optional(),
})

function verify(
  signatureHeader: string | null,
  rawBody: string,
  secret: string,
): boolean {
  if (!signatureHeader) return false
  const match = signatureHeader.match(/v1=([a-f0-9]+)/)
  const provided = match?.[1]
  if (!provided) return false
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided, 'hex'),
      Buffer.from(expected, 'hex'),
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const secret = sanityEnv.revalidateSecret
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    )
  }

  const rawBody = await request.text()
  const signature = request.headers.get('sanity-webhook-signature')

  if (!verify(signature, rawBody, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let parsed: z.infer<typeof payloadSchema>
  try {
    parsed = payloadSchema.parse(JSON.parse(rawBody))
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const tags: string[] = [parsed._type]
  if (parsed.slug?.current) tags.push(`${parsed._type}:${parsed.slug.current}`)
  for (const tag of tags) revalidateTag(tag)

  return NextResponse.json({ revalidated: true, tags })
}
