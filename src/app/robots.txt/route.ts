import { NextResponse } from 'next/server'

export function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /studio',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `# AI agent guidance:`,
    `# ${siteUrl}/llms.txt`,
    '',
  ].join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
