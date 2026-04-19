import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { getAuthorBySlug, listAuthors } from '@/sanity/fetchers'
import { JsonLd } from '@/seo/json-ld'
import { buildPerson } from '@/seo/schemas/person'

export const revalidate = 3600

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

type Credential = {
  _id: string
  name: string
  credentialCategory: string
  recognizedBy?: string
  verificationUrl?: string
}

type Author = {
  name: string
  slug: string
  jobTitle?: string
  bio?: string
  portrait?: string
  credentials?: Credential[]
  socialProfiles?: { platform: string; url: string }[]
}

export async function generateStaticParams() {
  try {
    const authors = await listAuthors<{ slug: string }>()
    return authors.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug<Author>(slug)
  if (!author) return {}
  return {
    title: author.name,
    alternates: { canonical: `/about/expert-authors/${slug}` },
  }
}

function toCredentialCategory(
  value: string,
): 'degree' | 'license' | 'certification' {
  if (value === 'degree' || value === 'license' || value === 'certification') {
    return value
  }
  return 'certification'
}

export default async function AuthorProfile({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = await getAuthorBySlug<Author>(slug)
  if (!author) notFound()

  const personLd = buildPerson({
    siteUrl,
    name: author.name,
    slug,
    ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
    ...(author.bio ? { bio: author.bio } : {}),
    ...(author.credentials && author.credentials.length > 0
      ? {
          credentials: author.credentials.map((c) => ({
            name: c.name,
            credentialCategory: toCredentialCategory(c.credentialCategory),
            ...(c.recognizedBy ? { recognizedBy: c.recognizedBy } : {}),
            ...(c.verificationUrl
              ? { verificationUrl: c.verificationUrl }
              : {}),
          })),
        }
      : {}),
    ...(author.socialProfiles && author.socialProfiles.length > 0
      ? { socialProfiles: author.socialProfiles }
      : {}),
  })

  return (
    <>
      <JsonLd data={personLd} />
      <article className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs
          items={[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'Institutional Accountability' },
            { href: '/about/expert-authors', label: 'Expert authors' },
            { label: author.name },
          ]}
        />
        <h1 className="mt-6 font-serif text-4xl font-bold">{author.name}</h1>
        {author.jobTitle && (
          <p className="text-lg text-slate-charcoal">{author.jobTitle}</p>
        )}
        {author.bio && <p className="mt-6 leading-relaxed">{author.bio}</p>}

        {author.credentials && author.credentials.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Credentials</h2>
            <ul className="mt-4 space-y-2">
              {author.credentials.map((c) => (
                <li key={c._id}>
                  <strong>{c.name}</strong>
                  {c.recognizedBy ? ` — ${c.recognizedBy}` : ''}
                  {c.verificationUrl && (
                    <>
                      {' '}
                      ·{' '}
                      <a
                        href={c.verificationUrl}
                        rel="noopener external"
                        className="underline"
                      >
                        Verify
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {author.socialProfiles && author.socialProfiles.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Verified profiles</h2>
            <ul className="mt-4 space-y-2">
              {author.socialProfiles.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    rel="noopener external me"
                    className="underline"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  )
}
