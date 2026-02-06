import type { MetadataRoute } from 'next'

function getBaseUrl(): string {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!rawBaseUrl && process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL environment variable must be set in production'
    )
  }

  return (rawBaseUrl || 'https://tambo.co').replace(/\/+$/, '')
}

const APP_BASE_URL = getBaseUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/draft-mode/'],
    },
    sitemap: `${APP_BASE_URL}/sitemap.xml`,
  }
}
