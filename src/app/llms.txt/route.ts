import { NextResponse } from 'next/server'
import { PUBLIC_TOOL_PAGES } from '@/content/tools/public-tools'
import { PILLARS, articleHref, pillarHref } from '@/lib/site-map'
import { listArticlesByPillar } from '@/sanity/fetchers'

export const revalidate = 3600

function textResponse(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control':
        'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const lines: string[] = [
    '# The Gold IRA Guide',
    '',
    '> Educational content on self-directed precious metals IRAs. Owned by Liberty Gold Silver. No products are sold on this site. See /about/ftc-disclosure for the full material-connection disclosure and /about/editorial-guidelines for how articles are written and reviewed.',
    '',
  ]

  for (const pillar of PILLARS) {
    lines.push(`## ${pillar.shortLabel}`)
    lines.push('')
    lines.push(
      `- [${pillar.label}](${siteUrl}${pillarHref(pillar.slug)}.md): ${pillar.summary}`,
    )

    if (pillar.slug === 'tools') {
      for (const tool of PUBLIC_TOOL_PAGES) {
        lines.push(
          `- [${tool.title}](${siteUrl}${articleHref('tools', tool.slug)}.md): ${tool.summary}`,
        )
      }
      lines.push('')
      continue
    }
    try {
      const articles = await listArticlesByPillar<{
        title: string
        slug: string
        summary?: string
      }>(pillar.slug)
      for (const a of articles) {
        const summary = a.summary ? `: ${a.summary}` : ''
        lines.push(
          `- [${a.title}](${siteUrl}${articleHref(pillar.slug, a.slug)}.md)${summary}`,
        )
      }
    } catch {
      // Sanity unreachable — skip article listings for this pillar.
    }
    lines.push('')
  }

  return textResponse(lines.join('\n'))
}
