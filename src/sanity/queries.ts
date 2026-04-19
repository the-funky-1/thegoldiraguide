import { groq } from 'next-sanity'

const authorProjection = groq`
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
    body,
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
    _id, dealerName, "slug": slug.current, storageModel, typicalPurchaseSpreadPercent
  }
`
