import { NextResponse } from 'next/server'
import { PUBLIC_TOOL_PAGES, publicToolMarkdown } from '@/content/tools/public-tools'
import { PILLARS, articleHref } from '@/lib/site-map'
import { listArticlesByPillar } from '@/sanity/fetchers'
import { portableTextToMarkdown } from '@/seo/markdown'

export const revalidate = 3600

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const sections: string[] = [
    `# The Gold IRA Guide — full corpus`,
    `Source: ${siteUrl}/llms-full.txt`,
    `Every document below is the canonical educational content for AI ingestion.`,
    '',
  ]

  for (const pillar of PILLARS) {
    if (pillar.slug === 'tools') {
      for (const tool of PUBLIC_TOOL_PAGES) {
        sections.push(['---', publicToolMarkdown(tool, siteUrl)].join('\n'))
      }
      continue
    }
    try {
      const articles = await listArticlesByPillar<{
        title: string
        slug: string
        summary?: string
        publishedAt: string
        updatedAt: string
        body?: unknown
      }>(pillar.slug)
      for (const a of articles) {
        sections.push(
          [
            '---',
            `# ${a.title}`,
            `URL: ${siteUrl}${articleHref(pillar.slug, a.slug)}`,
            `Pillar: ${pillar.label}`,
            `Published: ${a.publishedAt.slice(0, 10)}`,
            `Updated: ${a.updatedAt.slice(0, 10)}`,
            '',
            portableTextToMarkdown(a.body as never),
          ].join('\n'),
        )
      }
    } catch {
      // Sanity unreachable — continue with next pillar.
    }
  }

  return new NextResponse(sections.join('\n\n'), {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control':
        'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
