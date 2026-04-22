import { groq } from 'next-sanity'

// Plain string (not groq-tagged) — this is a fragment, not a standalone query,
// so we don't want sanity typegen to parse it. It's interpolated into the queries below.
const authorProjection = `
  _id,
  name,
  "slug": slug.current,
  jobTitle,
  bio,
  "portrait": portrait.asset->url,
  "credentials": credentials[]->{ _id, name, credentialCategory, recognizedBy, dateEarned, verificationUrl },
  "socialProfiles": socialProfiles[]{ platform, url }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    updatedAt,
    "pillar": pillar->{ _id, title, "slug": slug.current, order },
    "author": author->{ ${authorProjection} },
    "reviewedBy": reviewedBy{
      reviewedAt,
      "reviewer": reviewer->{ ${authorProjection} }
    },
    body[]{
      ...,
      _type == "feeTable" => {
        ...,
        "rows": rows[]->{
          _id, dealerName, setupFeeUsd, annualAdminFeeUsd, storageModel,
          storageFlatFeeUsd, storageScalingPercent,
          typicalPurchaseSpreadPercent, typicalLiquidationSpreadPercent,
          mandatorySalesCall
        }
      }
    },
    citations[]{ _type, label, url, accessed },
    schemaJsonLdType,
    seo
  }
`

export const allArticleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`

export const pillarsQuery = groq`
  *[_type == "pillar"] | order(order asc){
    _id, title, "slug": slug.current, summary, order
  }
`

export const feeScheduleBySlugQuery = groq`
  *[_type == "feeSchedule" && slug.current == $slug][0]{
    _id,
    dealerName,
    "slug": slug.current,
    setupFeeUsd,
    annualAdminFeeUsd,
    storageModel,
    storageFlatFeeUsd,
    storageScalingPercent,
    typicalPurchaseSpreadPercent,
    typicalLiquidationSpreadPercent,
    minimumInvestmentUsd,
    mandatorySalesCall,
    sourceUrl,
    dataVerifiedAt
  }
`

export const allFeeSchedulesQuery = groq`
  *[_type == "feeSchedule"] | order(dealerName asc){
    _id,
    dealerName,
    "slug": slug.current,
    setupFeeUsd,
    annualAdminFeeUsd,
    storageModel,
    storageFlatFeeUsd,
    storageScalingPercent,
    typicalPurchaseSpreadPercent,
    typicalLiquidationSpreadPercent,
    minimumInvestmentUsd,
    mandatorySalesCall,
    sourceUrl,
    dataVerifiedAt
  }
`

export const articlesByPillarQuery = groq`
  *[_type == "article" && pillar->slug.current == $pillar] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    updatedAt,
    schemaJsonLdType,
    "pillar": pillar->{ "slug": slug.current }
  }
`

export const articleSlugsByPillarQuery = groq`
  *[_type == "article" && pillar->slug.current == $pillar && defined(slug.current)]{ "slug": slug.current }
`

export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    jobTitle,
    bio,
    "portrait": portrait.asset->url,
    "credentials": credentials[]->{ _id, name, credentialCategory, recognizedBy, dateEarned, verificationUrl },
    "socialProfiles": socialProfiles[]{ platform, url }
  }
`

export const allAuthorsQuery = groq`
  *[_type == "author"] | order(name asc){
    _id, name, "slug": slug.current, jobTitle, "portrait": portrait.asset->url
  }
`
