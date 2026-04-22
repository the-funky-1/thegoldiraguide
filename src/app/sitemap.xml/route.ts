import { NextResponse } from 'next/server'
import { PUBLIC_TOOL_PAGES } from '@/content/tools/public-tools'
import { PILLARS, articleHref, pillarHref } from '@/lib/site-map'
import { listArticlesByPillar, listAuthors } from '@/sanity/fetchers'

export const revalidate = 3600

const ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}

function xmlEscape(v: string): string {
  return v.replace(/[<>&'"]/g, (c) => ESCAPES[c] ?? c)
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
  const urls: { loc: string; lastmod?: string }[] = [{ loc: siteUrl }]

  for (const pillar of PILLARS) {
    urls.push({ loc: `${siteUrl}${pillarHref(pillar.slug)}` })
    if (pillar.slug === 'tools') {
      for (const tool of PUBLIC_TOOL_PAGES) {
        urls.push({
          loc: `${siteUrl}${articleHref('tools', tool.slug)}`,
          lastmod: tool.updatedAt,
        })
      }
      continue
    }
    try {
      const articles = await listArticlesByPillar<{
        slug: string
        updatedAt: string
      }>(pillar.slug)
      for (const a of articles) {
        urls.push({
          loc: `${siteUrl}${articleHref(pillar.slug, a.slug)}`,
          lastmod: a.updatedAt,
        })
      }
    } catch {
      // Sanity unreachable — continue.
    }
  }

  urls.push({ loc: `${siteUrl}/about/expert-authors` })
  try {
    const authors = await listAuthors<{ slug: string }>()
    for (const a of authors) {
      urls.push({ loc: `${siteUrl}/about/expert-authors/${a.slug}` })
    }
  } catch {
    // Sanity unreachable — continue.
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control':
        'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
