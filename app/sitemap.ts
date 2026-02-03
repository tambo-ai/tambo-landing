import type { MetadataRoute } from 'next'
import { getPostListItems } from '~/libs/get-posts'
import { getBaseUrl } from '~/libs/base-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl({ requireInProduction: true })

  const posts = await getPostListItems()
  const blogPosts = posts
    .filter((post) => {
      const date = new Date(post.date)
      return !Number.isNaN(date.getTime())
    })
    .map((post) => ({
      url: `${baseUrl}/blog/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  return [...staticRoutes, ...blogPosts]
}
