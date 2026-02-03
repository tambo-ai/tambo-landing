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
    'generative UI',
    'React AI toolkit',
    'open-source AI',
    'AI components',
    'MCP',
    'Model Context Protocol',
    'React agent',
    'AI copilot',
    'streaming UI',
    'component rendering',
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
        alt: 'Tambo - the open-source generative UI toolkit for React',
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
        {/* AI agent discovery */}
        <link rel="help" type="text/plain" href="/llms.txt" />
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${APP_BASE_URL}/#organization`,
                  name: 'Tambo',
                  url: APP_BASE_URL,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${APP_BASE_URL}/icon.png`,
                  },
                  sameAs: [
                    'https://github.com/tambo-ai/tambo',
                    'https://twitter.com/tambo_ai',
                    'https://discord.gg/wMeVUZXBPg',
                  ],
                  description:
                    'Tambo is the open-source generative UI toolkit for React. Build agents that render your components.',
                },
                {
                  '@type': 'WebSite',
                  '@id': `${APP_BASE_URL}/#website`,
                  url: APP_BASE_URL,
                  name: 'Tambo',
                  publisher: {
                    '@id': `${APP_BASE_URL}/#organization`,
                  },
                  description: APP_DESCRIPTION,
                },
              ],
            }),
          }}
        />
      </head>
      {/* this helps to track Satus usage thanks to Wappalyzer */}
      <Script async>{`window.satusVersion = '${AppData.version}';`}</Script>
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
