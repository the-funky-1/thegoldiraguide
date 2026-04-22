'use client'

import { useEffect } from 'react'
import * as amplitude from '@amplitude/analytics-browser'
import { analyticsConfig } from './config'
import type { AnalyticsProperties } from './track'

let initialized = false
let initPromise: Promise<boolean> | null = null

function shouldInitialize(): boolean {
  return (
    !analyticsConfig.disabled &&
    Boolean(analyticsConfig.amplitudeApiKey) &&
    typeof window !== 'undefined'
  )
}

export function initializeAmplitude(): Promise<boolean> {
  if (!shouldInitialize()) return Promise.resolve(false)
  if (initialized) return Promise.resolve(true)
  if (initPromise) return initPromise

  initPromise = amplitude
    .init(analyticsConfig.amplitudeApiKey, undefined, {
      autocapture: {
        attribution: true,
        elementInteractions: true,
        fileDownloads: true,
        formInteractions: true,
        frustrationInteractions: true,
        networkTracking: true,
        pageUrlEnrichment: true,
        pageViews: true,
        sessions: true,
        webVitals: true,
      },
      logLevel: analyticsConfig.debug
        ? amplitude.Types.LogLevel.Debug
        : amplitude.Types.LogLevel.Warn,
      serverZone: analyticsConfig.amplitudeServerZone,
    })
    .promise.then(() => {
      initialized = true
      return true
    })
    .catch((error: unknown) => {
      initPromise = null
      if (analyticsConfig.debug) {
        console.warn('Amplitude analytics failed to initialize', error)
      }
      return false
    })

  return initPromise
}

export function trackAmplitudeEvent(
  eventName: string,
  properties: AnalyticsProperties,
) {
  if (!shouldInitialize()) return

  void initializeAmplitude().then((ready) => {
    if (ready) {
      amplitude.track(eventName, properties)
    }
  })
}

export function AmplitudeProvider() {
  useEffect(() => {
    void initializeAmplitude()
  }, [])

  return null
}
