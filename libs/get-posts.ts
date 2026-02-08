import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'
import { BLOG_DEFAULTS } from './blog/defaults'
import type { BlogCategory, BlogPostListItem } from './blog/types'

// Define our blog post types
export interface BlogFrontMatter {
  title: string
  date: string
  description?: string
  author?: string
  category?: BlogCategory
}

export interface BlogPost {
  name: string
  route: string
  frontMatter: BlogFrontMatter
  content?: string
}

export async function getPosts(): Promise<BlogPost[]> {
  const pageMap = await getPageMap('/blog/posts')
  const { directories } = normalizePages({
    list: pageMap,
    route: '/blog/posts',
  })

  const posts = directories
    .filter(
      (item: { name?: string; frontMatter?: unknown }): item is BlogPost => {
        return (
          item.name !== 'index' && !!(item as unknown as BlogPost).frontMatter
        )
      }
    )
    .map((item) => ({
      name: item.name,
      route: item.route,
      content: (item as unknown as { content?: string }).content || '',
      frontMatter: {
        title: item.frontMatter.title ?? '',
        date: item.frontMatter.date ?? new Date().toISOString(),
        description: item.frontMatter.description,
        author: item.frontMatter.author ?? BLOG_DEFAULTS.author,
        category: item.frontMatter.category,
      },
    }))
    .toSorted(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime()
    )

  return posts
}

// Transform posts to BlogPostListItem format
export async function getPostListItems(): Promise<BlogPostListItem[]> {
  const posts = await getPosts()

  return posts.map((post) => {
    const slug = post.name
    // Use explicit frontmatter category or default to "update"
    const category = post.frontMatter.category ?? 'update'

    return {
      id: slug,
      slug,
      title: post.frontMatter.title,
      category,
      date: post.frontMatter.date,
      description: post.frontMatter.description,
      author: post.frontMatter.author,
    }
  })
}
