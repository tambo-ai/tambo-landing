type JsonLd = Record<string, unknown>

export function generateBlogPostSchema({
  baseUrl,
  title,
  description,
  publishedAt,
  updatedAt,
  authorName,
  authorUrl,
  slug,
  image,
}: {
  baseUrl: string
  title: string
  description?: string
  publishedAt: string
  updatedAt?: string
  authorName: string
  authorUrl?: string
  slug: string
  image?: string
}): JsonLd {
  const postUrl = `${baseUrl}/blog/posts/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description ? { description } : {}),
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    image: image || `${baseUrl}/opengraph-image.jpg`,
    url: postUrl,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Tambo',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  }
}
