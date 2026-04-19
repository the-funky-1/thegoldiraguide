import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { listAuthors } from '@/sanity/fetchers'

export const metadata: Metadata = {
  title: 'Expert authors',
  alternates: { canonical: '/about/expert-authors' },
}

export const revalidate = 3600

type Author = {
  _id: string
  name: string
  slug: string
  jobTitle?: string
  portrait?: string
}

export default async function ExpertAuthorsIndex() {
  let authors: Author[] = []
  try {
    authors = await listAuthors<Author>()
  } catch {
    authors = []
  }
  return (
    <div className="px-6 py-10">
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/about', label: 'Institutional Accountability' },
          { label: 'Expert authors' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">Expert authors</h1>
      {authors.length === 0 ? (
        <p className="mt-10 text-slate-charcoal">
          No expert author profiles published yet.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {authors.map((a) => (
            <li
              key={a._id}
              className="rounded-lg border border-slate-charcoal/20 bg-white p-6"
            >
              <h2 className="font-serif text-xl">
                <Link
                  href={`/about/expert-authors/${a.slug}`}
                  className="underline-offset-2 hover:underline"
                >
                  {a.name}
                </Link>
              </h2>
              {a.jobTitle && (
                <p className="text-sm text-slate-charcoal">{a.jobTitle}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
