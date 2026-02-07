import type { MetadataRoute } from 'next'
import { SEO_FALLBACK_BASE_URL } from '~/libs/seo/constants'

const APP_BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || SEO_FALLBACK_BASE_URL
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
