import { NextResponse, type NextRequest } from 'next/server'
import { getPublicToolPage, publicToolMarkdown } from '@/content/tools/public-tools'
import { PILLARS, type PillarSlug } from '@/lib/site-map'
import { getArticleBySlug } from '@/sanity/fetchers'
import { portableTextToMarkdown } from '@/seo/markdown'

const PILLAR_SLUGS = new Set<string>(PILLARS.map((p) => p.slug))

function parsePath(
  pathSegments: string[],
): { pillar: PillarSlug; slug: string } | null {
  if (pathSegments.length !== 2) return null
  const pillarRaw = pathSegments[0]
  const articleRaw = pathSegments[1]
  if (!pillarRaw || !articleRaw) return null
  const slug = articleRaw.replace(/\.md$/, '')
  if (!PILLAR_SLUGS.has(pillarRaw)) return null
  return { pillar: pillarRaw as PillarSlug, slug }
}

type Article = {
  title: string
  summary?: string
  publishedAt: string
  updatedAt: string
  body?: unknown
  pillar?: { slug: string }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params
  const parsed = parsePath(path)
  if (!parsed) return new NextResponse('Not found', { status: 404 })

  if (parsed.pillar === 'tools') {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
    const tool = getPublicToolPage(parsed.slug)
    if (!tool) return new NextResponse('Not found', { status: 404 })
    return new NextResponse(publicToolMarkdown(tool, siteUrl), {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'cache-control':
          'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
      },
    })
  }

  const article = await getArticleBySlug<Article>(parsed.slug)
  if (!article || article.pillar?.slug !== parsed.pillar) {
    return new NextResponse('Not found', { status: 404 })
  }

  const body = [
    `# ${article.title}`,
    article.summary ? `\n> ${article.summary}` : '',
    `\n_Published ${article.publishedAt.slice(0, 10)} · Updated ${article.updatedAt.slice(0, 10)}_`,
    '',
    portableTextToMarkdown(article.body as never),
  ]
    .filter((s) => s !== '')
    .join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control':
        'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
