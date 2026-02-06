import type { MetadataRoute } from 'next'
import { getBaseUrl } from '~/libs/seo/base-url'

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
