'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
