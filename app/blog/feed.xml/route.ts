import { Feed } from 'feed'
import { getPostListItems } from '~/libs/get-posts'

export async function GET() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!rawBaseUrl && process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL environment variable must be set in production'
    )
  }
  const baseUrl = (rawBaseUrl || 'https://tambo.co').replace(/\/+$/, '')

  const feed = new Feed({
    title: 'Tambo Blog',
    description: 'Build agents that speak your UI',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',
    image: `${baseUrl}/og-image.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Tambo`,
    feedLinks: {
      rss2: `${baseUrl}/blog/feed.xml`,
    },
  })

  const posts = await getPostListItems()

  for (const post of posts) {
    const postDate = new Date(post.date)
    if (Number.isNaN(postDate.getTime())) continue

    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/posts/${post.slug}`,
      link: `${baseUrl}/blog/posts/${post.slug}`,
      description: post.description || '',
      author: post.author ? [{ name: post.author }] : undefined,
      date: postDate,
      category: post.category ? [{ name: post.category }] : undefined,
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
