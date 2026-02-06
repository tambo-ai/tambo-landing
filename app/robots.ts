import type { MetadataRoute } from 'next'

const APP_BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'https://tambo.co'
).replace(/\/+$/, '')

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
