import { getBaseUrl } from './base-url'
import { siteConfig } from './config'

/**
 * Generates JSON-LD schema markup for a blog post
 */
export function generateBlogPostSchema({
  title,
  description,
  publishedAt,
  updatedAt,
  authorName,
  authorUrl,
  slug,
  image,
}: {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  authorName: string
  authorUrl?: string
  slug: string
  image?: string
}) {
  const baseUrl = getBaseUrl()
  const postUrl = `${baseUrl}/blog/posts/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    image: image || `${baseUrl}/api/og`,
    url: postUrl,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/api/og`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  }
}
