import type { Metadata, Viewport } from 'next'

import type { PropsWithChildren } from 'react'
import { ReactTempus } from 'tempus/react'
import { RealViewport } from '~/components/real-viewport'
import AppData from '~/package.json'
import { AnalyticsProvider } from '~/providers/posthog-provider'
import { themes } from '~/styles/colors'
import '~/styles/css/index.css'

import Script from 'next/script'
import { GSAPRuntime } from '~/components/gsap/runtime'

import { OrchestraTools } from '~/orchestra'
import { fontsVariable } from '~/styles/fonts'

const APP_NAME = AppData.name
const APP_DEFAULT_TITLE = 'Tambo'
const APP_TITLE_TEMPLATE = '%s'
const APP_DESCRIPTION = AppData.description
const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'AI-Powered React Components',
    'Generative UI Components',
    'React AI Integration',
    'Contextual UI Generation',
    'Dynamic Interface Adaptation',
    'Conversational UI Framework',
    'Context-Aware Interfaces',
    'Natural Language UI',
    'AI UX Development',
    'Client Side MCP Integration',
    'Server Side MCP Integration',
    'React AI Agent Framework',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: APP_BASE_URL,
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: APP_DEFAULT_TITLE,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  authors: [
    { name: 'darkroom.engineering', url: 'https://darkroom.engineering' },
  ],
  other: {
    'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  },
}

export const viewport: Viewport = {
  themeColor: themes.light.primary,
  colorScheme: 'normal',
}

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={fontsVariable}
      // NOTE: This is due to the data-theme attribute being set which causes hydration errors
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external origins for faster resource loading */}
        <link rel="preconnect" href="https://us.i.posthog.com" />
        <link rel="preconnect" href="https://us-assets.i.posthog.com" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
      </head>
      {/* this helps to track Satus usage thanks to Wappalyzer */}
      <Script async>{`window.satusVersion = '${AppData.version}';`}</Script>
      {/* Cloudflare Turnstile for contact form spam protection */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
          onLoad={() =>
            window.dispatchEvent(new Event('turnstile:loaded'))
          }
        />
      )}
      <body>
        <AnalyticsProvider>
          {/* Critical: CSS custom properties needed for layout */}
          <RealViewport>
            {/* Main app content */}
            {children}
          </RealViewport>
          {/* Development tools - dynamically imported */}
          <OrchestraTools />

          {/* Animation framework */}
          <GSAPRuntime />

          {/* RAF management - lightweight, but don't patch in draft mode to avoid conflicts */}
          <ReactTempus
            // patch={!isDraftMode}
            patch={true}
          />
        </AnalyticsProvider>
      </body>
    </html>
  )
}
