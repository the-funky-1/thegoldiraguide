import type {
  EducationalOccupationalCredential,
  Person,
  WithContext,
} from 'schema-dts'

type Credential = {
  name: string
  credentialCategory: 'degree' | 'license' | 'certification'
  recognizedBy?: string
  verificationUrl?: string
}

type Input = {
  siteUrl: string
  name: string
  slug: string
  jobTitle?: string
  bio?: string
  credentials?: Credential[]
  socialProfiles?: { platform: string; url: string }[]
}

type ConcreteCredential = Exclude<EducationalOccupationalCredential, string>
type ConcretePerson = Exclude<Person, string>

export function buildPerson(input: Input): WithContext<ConcretePerson> {
  const hasCredential: ConcreteCredential[] = (input.credentials ?? []).map(
    (c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      credentialCategory: c.credentialCategory,
      ...(c.recognizedBy && {
        recognizedBy: { '@type': 'Organization', name: c.recognizedBy },
      }),
      ...(c.verificationUrl && { url: c.verificationUrl }),
    }),
  )

  const out: WithContext<ConcretePerson> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: `${input.siteUrl}/about/expert-authors/${input.slug}`,
  }
  if (input.jobTitle) out.jobTitle = input.jobTitle
  if (input.bio) out.description = input.bio
  if (hasCredential.length > 0) out.hasCredential = hasCredential
  if (input.socialProfiles && input.socialProfiles.length > 0) {
    out.sameAs = input.socialProfiles.map((s) => s.url)
  }
  return out
}
