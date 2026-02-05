import { Feed } from 'feed'
import { getPostListItems } from '~/libs/get-posts'

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (process.env.NODE_ENV === 'production' && !envBaseUrl) {
    return new Response(
      'NEXT_PUBLIC_BASE_URL environment variable must be set',
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  const rawBaseUrl = envBaseUrl ?? origin

  const baseUrl = rawBaseUrl.replace(/\/+$/, '')

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
    const hasValidDate = !Number.isNaN(postDate.getTime())
    if (!hasValidDate && process.env.NODE_ENV !== 'production') {
      console.warn('Invalid blog post date for RSS feed', {
        slug: post.slug,
        date: post.date,
      })
    }

    const date = hasValidDate ? postDate : new Date(0)

    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/posts/${post.slug}`,
      link: `${baseUrl}/blog/posts/${post.slug}`,
      description: post.description || '',
      author: post.author ? [{ name: post.author }] : undefined,
      date,
      category: post.category ? [{ name: post.category }] : undefined,
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
