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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url

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
    url: `${baseUrl}/blog/${slug}`,
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
      '@id': `${baseUrl}/blog/${slug}`,
    },
  }
}
