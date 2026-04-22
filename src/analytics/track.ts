'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { track as trackVercel } from '@vercel/analytics'
import { analyticsConfig } from './config'
import { trackAmplitudeEvent } from './amplitude'
import type { AnalyticsEventName } from './events'

export type AnalyticsPropertyValue = string | number | boolean | null
export type AnalyticsPropertyInput = AnalyticsPropertyValue | undefined
export type AnalyticsProperties = Record<string, AnalyticsPropertyValue>
export type AnalyticsPropertyInputs = Record<string, AnalyticsPropertyInput>

const MAX_PROPERTY_LENGTH = 180

function truncate(value: string): string {
  return value.length > MAX_PROPERTY_LENGTH
    ? value.slice(0, MAX_PROPERTY_LENGTH)
    : value
}

function cleanProperties(
  properties: AnalyticsPropertyInputs,
): AnalyticsProperties {
  return Object.fromEntries(
    Object.entries(properties)
      .filter((entry): entry is [string, AnalyticsPropertyValue] => {
        const value = entry[1]
        return (
          value === null ||
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        )
      })
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? truncate(value) : value,
      ]),
  )
}

function currentPageContext(): AnalyticsProperties {
  if (typeof window === 'undefined') return {}

  const url = new URL(window.location.href)
  const params = url.searchParams
  const referrer = document.referrer ? new URL(document.referrer) : null

  return cleanProperties({
    page_path: url.pathname,
    page_title: document.title,
    referrer_domain: referrer?.hostname.replace(/^www\./, ''),
    utm_campaign: params.get('utm_campaign') ?? undefined,
    utm_content: params.get('utm_content') ?? undefined,
    utm_medium: params.get('utm_medium') ?? undefined,
    utm_source: params.get('utm_source') ?? undefined,
    utm_term: params.get('utm_term') ?? undefined,
    viewport_height: window.innerHeight,
    viewport_width: window.innerWidth,
  })
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsPropertyInputs = {},
) {
  if (analyticsConfig.disabled || typeof window === 'undefined') return

  const payload = {
    ...currentPageContext(),
    ...cleanProperties(properties),
  }

  if (analyticsConfig.googleAnalyticsId) {
    sendGAEvent('event', eventName, payload)
  }

  trackVercel(eventName, payload)
  trackAmplitudeEvent(eventName, payload)

  if (analyticsConfig.debug) {
    console.debug('Analytics event', eventName, payload)
  }
}
